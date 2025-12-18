import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';

class HostlerPublicGrievances extends StatefulWidget {
  const HostlerPublicGrievances({super.key});

  @override
  State<HostlerPublicGrievances> createState() =>
      _HostlerPublicGrievancesState();
}

class _HostlerPublicGrievancesState extends State<HostlerPublicGrievances> {
  List<dynamic> grievances = [];
  List<dynamic> filtered = [];

  bool loading = true;
  bool refreshing = false;

  String filterStatus = 'All';

  dynamic selectedGrievance;

  bool showAddModal = false;
  bool adding = false;
  bool upvoting = false;

  final TextEditingController titleCtrl = TextEditingController();
  final TextEditingController descCtrl = TextEditingController();

  bool alert = false;
  String alertMessage = '';

  bool success = false;
  String successMessage = '';

  // ---------------- FETCH ----------------
  Future<void> fetchGrievances() async {
    final appState = context.read<AppState>();

    try {
      final res = await http.get(
        Uri.parse('${appState.localhost}/api/hostler/getpublicgrievance'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(res.body);

      setState(() {
        grievances = data;
        _applyFilter();
      });
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- FILTER ----------------
  void _applyFilter() {
    final appState = context.read<AppState>();

    if (filterStatus == 'All') {
      filtered = grievances;
    } else if (filterStatus == 'Upvoted') {
      filtered = grievances
          .where((g) => g['upvotes'].contains(appState.data['_id']))
          .toList();
    } else {
      filtered = grievances.where((g) => g['status'] == filterStatus).toList();
    }
  }

  // ---------------- ADD ----------------
  Future<void> addGrievance() async {
    if (titleCtrl.text.isEmpty || descCtrl.text.isEmpty) {
      setState(() {
        alertMessage = 'Please fill all fields.';
        alert = true;
      });
      return;
    }

    final appState = context.read<AppState>();
    setState(() => adding = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/hostler/publicgrievance'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
        body: jsonEncode({
          'title': titleCtrl.text.trim(),
          'description': descCtrl.text.trim(),
        }),
      );

      if (res.statusCode != 200) {
        throw 'Failed to add grievance';
      }

      final data = jsonDecode(res.body);

      setState(() {
        grievances.insert(0, data);
        _applyFilter();
        showAddModal = false;
        titleCtrl.clear();
        descCtrl.clear();
        successMessage = 'Grievance added successfully.';
        success = true;
      });
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => adding = false);
    }
  }

  // ---------------- UPVOTE ----------------
  Future<void> upvote() async {
    final appState = context.read<AppState>();
    setState(() => upvoting = true);

    try {
      final res = await http.get(
        Uri.parse(
          '${appState.localhost}/api/hostler/publicgrievance/upvote/${selectedGrievance['_id']}',
        ),
        headers: {'Cookie': appState.cookie},
      );

      if (res.statusCode != 200) {
        throw 'Failed to upvote';
      }

      final updated = jsonDecode(res.body);

      setState(() {
        grievances = grievances
            .map((g) => g['_id'] == updated['_id'] ? updated : g)
            .toList();
        selectedGrievance = updated;
        _applyFilter();
      });
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => upvoting = false);
    }
  }

  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchGrievances();
    setState(() => refreshing = false);
  }

  @override
  void initState() {
    super.initState();
    fetchGrievances();
  }

  @override
  void dispose() {
    titleCtrl.dispose();
    descCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Public Grievances'),
      body: Stack(
        children: [
          Column(
            children: [
              _filterRow(),
              Expanded(
                child: loading
                    ? const Center(
                        child: CircularProgressIndicator(
                          color: Color(0xff2cb5a0),
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: onRefresh,
                        child: filtered.isEmpty
                            ? const Center(
                                child: Text(
                                  'No public grievances',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              )
                            : ListView.builder(
                                padding: const EdgeInsets.all(10),
                                itemCount: filtered.length,
                                itemBuilder: (_, i) =>
                                    _grievanceCard(filtered[i]),
                              ),
                      ),
              ),
            ],
          ),

          /// ADD BUTTON
          Positioned(
            bottom: 20,
            right: 20,
            child: FloatingActionButton.extended(
              backgroundColor: const Color(0xff2cb5a0),
              onPressed: () => setState(() => showAddModal = true),
              label: const Text(
                'Add Grievance',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),

          if (showAddModal) _addModal(),
          if (selectedGrievance != null) _detailsModal(),

          ErrorAlert(
            message: alertMessage,
            alert: alert,
            onClose: () => setState(() => alert = false),
          ),
          SuccessAlert(
            message: successMessage,
            success: success,
            onClose: () => setState(() => success = false),
          ),
        ],
      ),
    );
  }

  // ---------------- FILTER ROW ----------------
  Widget _filterRow() {
    const filters = ['All', 'Pending', 'Resolved', 'Cancelled', 'Upvoted'];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.all(8),
      child: Row(
        children: filters.map((f) {
          final active = filterStatus == f;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: GestureDetector(
              onTap: () {
                setState(() {
                  filterStatus = f;
                  _applyFilter();
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(
                  vertical: 10,
                  horizontal: 25,
                ),
                decoration: BoxDecoration(
                  color: active ? const Color(0xff2cb5a0) : null,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xff2cb5a0)),
                ),
                child: Text(
                  f,
                  style: TextStyle(
                    color: active ? Colors.white : const Color(0xff2cb5a0),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ---------------- CARD ----------------
  Widget _grievanceCard(dynamic g) {
    Color statusColor = g['status'] == 'Pending'
        ? Colors.orange
        : g['status'] == 'Resolved'
        ? Colors.green
        : Colors.red;

    return GestureDetector(
      onTap: () => setState(() => selectedGrievance = g),
      child: Card(
        elevation: 4,
        margin: const EdgeInsets.symmetric(vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Padding(
          padding: const EdgeInsets.all(15),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                g['title'],
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 5),
              Text(g['description']),
              const SizedBox(height: 5),
              Text('${g['upvotes'].length} Upvotes'),
              const SizedBox(height: 5),
              Text(
                'Date: ${DateTime.parse(g['date']).toLocal().toString().split(' ')[0]}',
                style: const TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 5),
              Text(
                'Status: ${g['status']}',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: statusColor,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------- ADD MODAL ----------------
  Widget _addModal() {
    return _modal(
      title: 'Add Grievance',
      onClose: () => setState(() => showAddModal = false),
      child: Column(
        children: [
          TextField(
            controller: titleCtrl,
            decoration: const InputDecoration(
              labelText: 'Title',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: descCtrl,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Description',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 20),
          adding
              ? const CircularProgressIndicator(color: Color(0xff2cb5a0))
              : ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xff2cb5a0),
                    minimumSize: const Size(double.infinity, 45),
                  ),
                  onPressed: addGrievance,
                  child: const Text(
                    'Submit',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
        ],
      ),
    );
  }

  // ---------------- DETAILS MODAL ----------------
  Widget _detailsModal() {
    final appState = context.read<AppState>();
    final bool hasUpvoted = selectedGrievance['upvotes'].contains(
      appState.data['_id'],
    );

    return _modal(
      title: 'Grievance Details',
      onClose: () => setState(() => selectedGrievance = null),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Title: ${selectedGrievance['title']}'),
          const SizedBox(height: 5),
          Text('Description: ${selectedGrievance['description']}'),
          const SizedBox(height: 5),
          Text('Upvotes: ${selectedGrievance['upvotes'].length}'),
          const SizedBox(height: 5),
          Text('Status: ${selectedGrievance['status']}'),
          const SizedBox(height: 15),
          upvoting
              ? const CircularProgressIndicator(color: Color(0xff2cb5a0))
              : ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xff2cb5a0),
                    minimumSize: const Size(double.infinity, 45),
                  ),
                  onPressed: upvote,
                  child: Text(
                    hasUpvoted ? 'Remove Up Vote' : 'Up Vote',
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
        ],
      ),
    );
  }

  // ---------------- COMMON MODAL ----------------
  Widget _modal({
    required String title,
    required Widget child,
    required VoidCallback onClose,
  }) {
    return GestureDetector(
      onTap: onClose,
      child: Container(
        color: Colors.black54,
        child: Center(
          child: GestureDetector(
            onTap: () {},
            child: Container(
              width: 330,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xff2cb5a0),
                    ),
                  ),
                  const SizedBox(height: 15),
                  child,
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
