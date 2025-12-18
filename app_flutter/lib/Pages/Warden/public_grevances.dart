import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';

class PublicGrievances extends StatefulWidget {
  const PublicGrievances({super.key});

  @override
  State<PublicGrievances> createState() => _PublicGrievancesState();
}

class _PublicGrievancesState extends State<PublicGrievances> {
  bool loading = true;
  bool refreshing = false;
  bool updating = false;

  List<dynamic> grievances = [];
  List<dynamic> filtered = [];

  String filterStatus = 'All';
  Map<String, dynamic>? selectedGrievance;

  // ---------------- FETCH GRIEVANCES ----------------
  Future<void> fetchGrievances() async {
    final appState = context.read<AppState>();

    try {
      final response = await http.get(
        Uri.parse('${appState.localhost}/api/warden/getPublicgrievance'),
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
      setState(() {
        loading = false;
        refreshing = false;
      });
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
    } else if (filterStatus == 'Upvotes') {
      filtered = [...grievances]
        ..sort(
          (a, b) =>
              (b['upvotes'] as List).length -
              (a['upvotes'] as List).length,
        );
    } else {
      filtered = grievances;
    }
  }

  // ---------------- UPDATE STATUS ----------------
  Future<void> updateGrievanceStatus(String id, String status) async {
    final appState = context.read<AppState>();
    setState(() => updating = true);

    try {
      final response = await http.post(
        Uri.parse('${appState.localhost}/api/warden/setPublicgrievance/$id'),
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
        grievances =
            grievances.map((g) => g['_id'] == id ? data : g).toList();
        applyFilter();
        selectedGrievance = null;
      });
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      setState(() => updating = false);
    }
  }

  // ---------------- REFRESH ----------------
  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchGrievances();
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
      appBar: const Nav(title: 'Public Grievances'),
      body: Column(
        children: [
          // ---------------- FILTER BAR ----------------
          SizedBox(
            height: 55,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 8),
              children: ['All', 'Pending', 'Resolved', 'Cancelled', 'Upvotes']
                  .map(
                    (status) => Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: ChoiceChip(
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
                      ),
                    ),
                  )
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
                              'No Public grievances',
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
                                onTap: () =>
                                    setState(() => selectedGrievance = item),
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
                                            fontWeight: FontWeight.bold),
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

      // ---------------- BOTTOM MODAL ----------------
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
                        Text(
                            'Upvotes: ${(selectedGrievance!['upvotes'] as List).length}'),
                        const SizedBox(height: 10),
                        Text('Status: ${selectedGrievance!['status']}'),
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
                          onPressed: () =>
                              setState(() => selectedGrievance = null),
                          child: const Text('Close'),
                        ),
                      ],
                    ),
            ),
    );
  }
}
