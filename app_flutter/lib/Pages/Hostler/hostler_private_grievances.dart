import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';

class HostlerPrivateGrievances extends StatefulWidget {
  const HostlerPrivateGrievances({super.key});

  @override
  State<HostlerPrivateGrievances> createState() =>
      _HostlerPrivateGrievancesState();
}

class _HostlerPrivateGrievancesState extends State<HostlerPrivateGrievances> {
  List<dynamic> grievances = [];
  List<dynamic> filtered = [];

  bool loading = true;
  bool refreshing = false;

  bool showAddModal = false;
  bool adding = false;

  dynamic selectedGrievance;

  String filterStatus = 'All';

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
        Uri.parse('${appState.localhost}/api/hostler/getprivategrievance'),
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
        Uri.parse('${appState.localhost}/api/hostler/privategrievance'),
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
        successMessage = 'Grievance added successfully!';
        success = true;
        showAddModal = false;
        titleCtrl.clear();
        descCtrl.clear();
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

  // ---------------- FILTER ----------------
  void _applyFilter() {
    if (filterStatus == 'All') {
      filtered = grievances;
    } else {
      filtered = grievances.where((g) => g['status'] == filterStatus).toList();
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
      appBar: const Nav(title: 'Private Grievances'),
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
                                  'No private grievances',
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

          /// FLOATING BUTTON
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

          /// MODALS
          if (showAddModal) _addModal(),
          if (selectedGrievance != null) _detailsModal(),

          /// ALERTS
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
    const filters = ['All', 'Pending', 'Resolved', 'Cancelled'];

    return Padding(
      padding: const EdgeInsets.all(8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: filters.map((f) {
          final active = filterStatus == f;
          return GestureDetector(
            onTap: () {
              setState(() {
                filterStatus = f;
                _applyFilter();
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 15),
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
        margin: const EdgeInsets.symmetric(vertical: 8),
        elevation: 4,
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
          Text('Date: ${DateTime.parse(selectedGrievance['date']).toLocal()}'),
          const SizedBox(height: 5),
          Text('Status: ${selectedGrievance['status']}'),
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
              width: 320,
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
