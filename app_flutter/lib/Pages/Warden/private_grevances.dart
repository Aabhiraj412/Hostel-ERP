import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';

class PrivateGrievances extends StatefulWidget {
  const PrivateGrievances({super.key});

  @override
  State<PrivateGrievances> createState() => _PrivateGrievancesState();
}

class _PrivateGrievancesState extends State<PrivateGrievances> {
  bool loading = true;
  bool refreshing = false;
  bool updating = false;

  List<dynamic> grievances = [];
  List<dynamic> filtered = [];

  String filterStatus = 'All';

  Map<String, dynamic>? selectedGrievance;
  Map<String, dynamic>? selectedHostler;

  // ---------------- FETCH GRIEVANCES ----------------
  Future<void> fetchGrievances() async {
    final appState = context.read<AppState>();

    try {
      final response = await http.get(
        Uri.parse('${appState.localhost}/api/warden/getprivategrievance'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode != 200) {
        throw data['message'] ?? 'Unable to fetch grievances';
      }

      setState(() {
        grievances = data;
        applyFilter();
      });
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- FETCH HOSTLER DETAILS ----------------
  Future<void> fetchHostlerDetails(String studentId) async {
    final appState = context.read<AppState>();

    try {
      final response = await http.get(
        Uri.parse('${appState.localhost}/api/warden/getdetail/$studentId'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode != 200) {
        throw data['message'] ?? 'Unable to fetch hostler details';
      }

      setState(() => selectedHostler = data);
    } catch (e) {
      debugPrint(e.toString());
    }
  }

  // ---------------- UPDATE GRIEVANCE STATUS ----------------
  Future<void> updateGrievanceStatus(String id, String status) async {
    final appState = context.read<AppState>();

    setState(() => updating = true);

    try {
      final response = await http.post(
        Uri.parse('${appState.localhost}/api/warden/setprivategrievance/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
        body: jsonEncode({'status': status}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode != 200) {
        throw data['message'] ?? 'Failed to update grievance';
      }

      setState(() {
        grievances = grievances
            .map((g) => g['_id'] == id ? data : g)
            .toList();
        applyFilter();
        selectedGrievance = null;
        selectedHostler = null;
      });
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      setState(() => updating = false);
    }
  }

  // ---------------- FILTER ----------------
  void applyFilter() {
    if (filterStatus == 'Pending') {
      filtered =
          grievances.where((g) => g['status'] == 'Pending').toList();
    } else if (filterStatus == 'Resolved') {
      filtered =
          grievances.where((g) => g['status'] == 'Resolved').toList();
    } else if (filterStatus == 'Cancelled') {
      filtered =
          grievances.where((g) => g['status'] == 'Cancelled').toList();
    } else {
      filtered = grievances;
    }
  }

  // ---------------- REFRESH ----------------
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

  // ---------------- UI ----------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Private Grievances'),
      body: Column(
        children: [
          // ---------------- FILTER BUTTONS ----------------
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: ['All', 'Pending', 'Resolved', 'Cancelled']
                  .map((status) => FilterChip(
                        label: Text(status),
                        selected: filterStatus == status,
                        selectedColor: const Color(0xff2cb5a0),
                        onSelected: (_) {
                          setState(() {
                            filterStatus = status;
                            applyFilter();
                          });
                        },
                        labelStyle: TextStyle(
                          color: filterStatus == status
                              ? Colors.white
                              : const Color(0xff2cb5a0),
                          fontWeight: FontWeight.bold,
                        ),
                        backgroundColor: Colors.white,
                        side: const BorderSide(
                            color: Color(0xff2cb5a0)),
                      ))
                  .toList(),
            ),
          ),

          // ---------------- LIST ----------------
          Expanded(
            child: loading
                ? const Center(
                    child:
                        CircularProgressIndicator(color: Color(0xff2cb5a0)),
                  )
                : RefreshIndicator(
                    onRefresh: onRefresh,
                    child: filtered.isEmpty
                        ? const Center(
                            child: Text(
                              'No private grievances',
                              style:
                                  TextStyle(fontSize: 16, color: Colors.grey),
                            ),
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.all(12),
                            itemCount: filtered.length,
                            itemBuilder: (_, index) {
                              final item = filtered[index];
                              return GestureDetector(
                                onTap: () {
                                  setState(() =>
                                      selectedGrievance = item);
                                  fetchHostlerDetails(item['student']);
                                },
                                child: Container(
                                  margin:
                                      const EdgeInsets.symmetric(vertical: 8),
                                  padding: const EdgeInsets.all(15),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(10),
                                    border: const Border(
                                      left: BorderSide(
                                          color: Color(0xff2cb5a0), width: 5),
                                    ),
                                    boxShadow: const [
                                      BoxShadow(
                                          color: Colors.black12,
                                          blurRadius: 5),
                                    ],
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        item['title'],
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(item['description']),
                                      const SizedBox(height: 6),
                                      Text(
                                        'Date: ${DateTime.parse(item['date']).toLocal().toString().split(' ')[0]}',
                                        style: const TextStyle(
                                            color: Colors.grey),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        'Status: ${item['status']}',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: item['status'] == 'Pending'
                                              ? Colors.orange
                                              : item['status'] == 'Resolved'
                                                  ? Colors.green
                                                  : Colors.red,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
          ),
        ],
      ),

      // ---------------- MODAL ----------------
      bottomSheet: selectedGrievance == null
          ? null
          : Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.vertical(top: Radius.circular(20)),
                boxShadow: [
                  BoxShadow(color: Colors.black26, blurRadius: 10),
                ],
              ),
              child: updating
                  ? const Center(
                      child: CircularProgressIndicator(
                          color: Color(0xff2cb5a0)),
                    )
                  : Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          'Grievance Details',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Color(0xff2cb5a0),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text('Title: ${selectedGrievance!['title']}'),
                        Text(
                            'Description: ${selectedGrievance!['description']}'),
                        Text(
                            'Date: ${DateTime.parse(selectedGrievance!['date']).toLocal().toString().split(' ')[0]}'),
                        if (selectedHostler != null) ...[
                          const SizedBox(height: 10),
                          Text(
                              'Submitted By: ${selectedHostler!['name']}'),
                          Text('Room No: ${selectedHostler!['room_no']}'),
                          Text('Hostel: ${selectedHostler!['hostel']}'),
                        ],
                        const SizedBox(height: 15),
                        if (selectedGrievance!['status'] == 'Pending')
                          Row(
                            mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                            children: [
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.green),
                                onPressed: () =>
                                    updateGrievanceStatus(
                                        selectedGrievance!['_id'],
                                        'Resolved'),
                                child: const Text('Resolve'),
                              ),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red),
                                onPressed: () =>
                                    updateGrievanceStatus(
                                        selectedGrievance!['_id'],
                                        'Cancelled'),
                                child: const Text('Cancel'),
                              ),
                            ],
                          ),
                        const SizedBox(height: 10),
                        TextButton(
                          onPressed: () => setState(() {
                            selectedGrievance = null;
                            selectedHostler = null;
                          }),
                          child: const Text('Close'),
                        ),
                      ],
                    ),
            ),
    );
  }
}
