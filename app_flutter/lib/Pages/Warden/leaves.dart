import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';

class Leaves extends StatefulWidget {
  const Leaves({super.key});

  @override
  State<Leaves> createState() => _LeavesState();
}

class _LeavesState extends State<Leaves> {
  bool loading = true;
  bool refreshing = false;
  bool updating = false;

  String filterStatus = 'All';

  List<dynamic> leaves = [];
  Map<String, dynamic>? selectedLeave;
  Map<String, dynamic>? studentDetails;

  // ---------------- FETCH LEAVES ----------------
  Future<void> fetchLeaves() async {
    final appState = context.read<AppState>();

    try {
      final res = await http.get(
        Uri.parse('${appState.localhost}/api/warden/getleaves'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(res.body);
      setState(() => leaves = data);
    } catch (e) {
      debugPrint('Error fetching leaves: $e');
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- FETCH STUDENT DETAILS ----------------
  Future<void> fetchStudentDetails(String id) async {
    final appState = context.read<AppState>();

    try {
      final res = await http.get(
        Uri.parse('${appState.localhost}/api/warden/getdetail/$id'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(res.body);
      if (res.statusCode == 200) {
        setState(() => studentDetails = data);
      }
    } catch (e) {
      debugPrint('Student fetch error: $e');
    }
  }

  // ---------------- UPDATE STATUS ----------------
  Future<void> updateLeaveStatus(String id, String status) async {
    final appState = context.read<AppState>();

    setState(() => updating = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/warden/setleave/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
        body: jsonEncode({'status': status}),
      );

      final updated = jsonDecode(res.body);

      if (res.statusCode == 200) {
        setState(() {
          leaves = leaves
              .map((l) => l['_id'] == id ? updated : l)
              .toList();
          selectedLeave = null;
          studentDetails = null;
        });
      }
    } catch (e) {
      debugPrint('Update error: $e');
    } finally {
      setState(() => updating = false);
    }
  }

  // ---------------- FILTER ----------------
  List<dynamic> get filteredLeaves {
    if (filterStatus == 'All') return leaves;
    return leaves.where((l) => l['status'] == filterStatus).toList();
  }

  // ---------------- REFRESH ----------------
  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchLeaves();
    setState(() => refreshing = false);
  }

  @override
  void initState() {
    super.initState();
    fetchLeaves();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Leave Applications'),
      backgroundColor: const Color(0xfff0f4f7),
      body: Stack(
        children: [
          Column(
            children: [
              // -------- FILTERS --------
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: ['All', 'Pending', 'Approved', 'Rejected']
                      .map(_filterButton)
                      .toList(),
                ),
              ),

              // -------- LIST --------
              Expanded(
                child: loading
                    ? const Center(
                        child: CircularProgressIndicator(
                          color: Color(0xff2cb5a0),
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: onRefresh,
                        child: filteredLeaves.isEmpty
                            ? const Center(
                                child: Text(
                                  'No leave applications',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              )
                            : ListView.builder(
                                itemCount: filteredLeaves.length,
                                itemBuilder: (_, i) {
                                  final l = filteredLeaves[i];
                                  return _leaveCard(l);
                                },
                              ),
                      ),
              ),
            ],
          ),

          // -------- MODAL --------
          if (selectedLeave != null) _leaveModal(),
        ],
      ),
    );
  }

  // ================= UI =================

  Widget _filterButton(String status) {
    final active = filterStatus == status;

    return GestureDetector(
      onTap: () => setState(() => filterStatus = status),
      child: Container(
        padding:
            const EdgeInsets.symmetric(vertical: 8, horizontal: 14),
        decoration: BoxDecoration(
          color: active ? const Color(0xff2cb5a0) : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xff2cb5a0)),
        ),
        child: Text(
          status,
          style: TextStyle(
            color: active ? Colors.white : const Color(0xff2cb5a0),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _leaveCard(Map<String, dynamic> l) {
    return GestureDetector(
      onTap: () {
        setState(() => selectedLeave = l);
        fetchStudentDetails(l['student']);
      },
      child: Container(
        margin: const EdgeInsets.all(10),
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          border:
              const Border(left: BorderSide(color: Color(0xff2cb5a0), width: 5)),
          boxShadow: const [
            BoxShadow(color: Colors.black12, blurRadius: 8),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Reason: ${l['reason']}'),
            Text('From: ${_fmt(l['from'])}'),
            Text('To: ${_fmt(l['to'])}'),
            const SizedBox(height: 6),
            Text(
              'Status: ${l['status']}',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: l['status'] == 'Pending'
                    ? Colors.orange
                    : l['status'] == 'Approved'
                        ? Colors.green
                        : Colors.red,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _leaveModal() {
    final l = selectedLeave!;
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedLeave = null;
          studentDetails = null;
        });
      },
      child: Container(
        color: Colors.black54,
        child: Center(
          child: GestureDetector(
            onTap: () {},
            child: Container(
              width: 340,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Leave Details',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xff2cb5a0),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text('Student: ${studentDetails?['name'] ?? 'Loading...'}'),
                  Text('Hostel: ${studentDetails?['hostel'] ?? '-'}'),
                  Text('Room: ${studentDetails?['room_no'] ?? '-'}'),
                  Text('Reason: ${l['reason']}'),
                  Text('From: ${_fmt(l['from'])}'),
                  Text('To: ${_fmt(l['to'])}'),
                  Text('Days: ${l['days']}'),
                  const SizedBox(height: 10),

                  // CALL
                  InkWell(
                    onTap: () =>
                        launchUrl(Uri.parse('tel:${l['contact_no']}')),
                    child: Text(
                      l['contact_no'],
                      style: const TextStyle(
                        color: Color(0xff2cb5a0),
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ),

                  const SizedBox(height: 15),

                  if (l['status'] == 'Pending')
                    updating
                        ? const CircularProgressIndicator(
                            color: Color(0xff2cb5a0),
                          )
                        : Row(
                            mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                            children: [
                              _actionButton(
                                'Approve',
                                Colors.green,
                                () => updateLeaveStatus(
                                    l['_id'], 'Approved'),
                              ),
                              _actionButton(
                                'Reject',
                                Colors.red,
                                () => updateLeaveStatus(
                                    l['_id'], 'Rejected'),
                              ),
                            ],
                          ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _actionButton(
      String text, Color color, VoidCallback onTap) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 5),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: color),
          onPressed: onTap,
          child: Text(text),
        ),
      ),
    );
  }

  String _fmt(String d) =>
      DateTime.parse(d).toLocal().toString().split(' ')[0];
}
