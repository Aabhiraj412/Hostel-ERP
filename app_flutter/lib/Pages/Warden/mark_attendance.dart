import 'dart:convert';
import 'package:app_flutter/Pages/Warden/warden_dashboard.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/attendance_card.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';

class MarkAttendance extends StatefulWidget {
  const MarkAttendance({super.key});

  @override
  State<MarkAttendance> createState() => _MarkAttendanceState();
}

class _MarkAttendanceState extends State<MarkAttendance> {
  String selectedHostel = 'All';

  List<dynamic> hostlers = [];
  List<String> present = [];

  bool loading = false;
  bool alert = false;
  String alertMessage = '';

  bool success = false;
  String successMessage = '';

  bool changes = false;

  int currentPage = 1;
  final int itemsPerPage = 2;

  // ---------------- FETCH HOSTLERS ----------------
  Future<void> fetchHostlers() async {
    final appState = context.read<AppState>();

    setState(() => loading = true);

    try {
      final res = await http.get(
        Uri.parse('${appState.localhost}/api/warden/getHostlers'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw data['message'] ?? 'Unable to fetch hostlers';
      }

      final filtered = selectedHostel == 'All'
          ? data
          : data.where((h) => h['hostel'] == selectedHostel).toList();

      setState(() => hostlers = filtered);

      // load present list
      final presentRes = await http.post(
        Uri.parse('${appState.localhost}/api/warden/saveattendance'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
        body: jsonEncode({'students': present}),
      );

      final presentData = jsonDecode(presentRes.body);

      if (presentRes.statusCode != 200) {
        throw presentData['message'] ?? 'Unable to load attendance';
      }

      setState(() => present = List<String>.from(presentData['hostler']));
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- SAVE TEMP ATTENDANCE ----------------
  Future<void> saveAttendance() async {
    final appState = context.read<AppState>();

    final res = await http.post(
      Uri.parse('${appState.localhost}/api/warden/saveattendance'),
      headers: {'Content-Type': 'application/json', 'Cookie': appState.cookie},
      body: jsonEncode({'students': present}),
    );

    final data = jsonDecode(res.body);

    if (res.statusCode != 200) {
      throw data['message'] ?? 'Unable to save attendance';
    }

    setState(() => present = List<String>.from(data['hostler']));
  }

  // ---------------- MARK FINAL ATTENDANCE ----------------
  Future<void> markAttendance() async {
    final appState = context.read<AppState>();

    setState(() => loading = true);

    try {
      await saveAttendance();

      final res = await http.post(
        Uri.parse('${appState.localhost}/api/warden/markattendance'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw data['message'] ?? 'Unable to mark attendance';
      }

      setState(() {
        successMessage = 'Attendance marked successfully';
        success = true;
      });

      // Navigator.pushReplacementNamed(context, '/warden-dashboard');
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const WardenDashboard()),
      );
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- PAGINATION ----------------
  int get totalPages => (hostlers.length / itemsPerPage).ceil();

  List<dynamic> get currentHostlers {
    final start = (currentPage - 1) * itemsPerPage;
    final end = start + itemsPerPage;
    return hostlers.sublist(
      start,
      end > hostlers.length ? hostlers.length : end,
    );
  }

  Future<void> nextPage() async {
    if (changes) {
      await saveAttendance();
      setState(() => changes = false);
    }

    if (currentPage < totalPages) {
      setState(() => currentPage++);
    }
  }

  Future<void> prevPage() async {
    if (changes) {
      await saveAttendance();
      setState(() => changes = false);
    }

    if (currentPage > 1) {
      setState(() => currentPage--);
    }
  }

  void toggleSelection(String id) {
    setState(() {
      changes = true;
      present.contains(id) ? present.remove(id) : present.add(id);
    });
  }

  @override
  void initState() {
    super.initState();
    fetchHostlers();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Mark Attendance'),
      body: loading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
            )
          : Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // -------- HOSTEL DROPDOWN --------
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: DropdownButton<String>(
                      value: selectedHostel,
                      isExpanded: true,
                      underline: const SizedBox(),
                      items: const [
                        DropdownMenuItem(
                          value: 'All',
                          child: Text('All Hostels'),
                        ),
                        DropdownMenuItem(
                          value: 'Aryabhatt',
                          child: Text('Aryabhatt'),
                        ),
                        DropdownMenuItem(
                          value: 'RN Tagore',
                          child: Text('RN Tagore'),
                        ),
                        DropdownMenuItem(
                          value: 'Sarojni Naidu',
                          child: Text('Sarojni Naidu'),
                        ),
                      ],
                      onChanged: (v) {
                        setState(() {
                          selectedHostel = v!;
                          currentPage = 1;
                        });
                        fetchHostlers();
                      },
                    ),
                  ),

                  const SizedBox(height: 15),

                  // -------- HOSTLER LIST --------
                  Expanded(
                    child: ListView(
                      children: currentHostlers
                          .map(
                            (h) => AttendanceCard(
                              data: h,
                              present: present,
                              onToggle: toggleSelection,
                            ),
                          )
                          .toList(),
                    ),
                  ),

                  // -------- PAGINATION --------
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _pageButton(
                        'Previous',

                        enabled: currentPage > 1,
                        onTap: prevPage,
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Text(
                          'Page $currentPage of $totalPages',
                          style: const TextStyle(fontSize: 16),
                        ),
                      ),
                      _pageButton(
                        'Save & Next',
                        enabled: currentPage < totalPages,
                        onTap: nextPage,
                      ),
                    ],
                  ),

                  const SizedBox(height: 15),

                  // -------- MARK BUTTON --------
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff2cb5a0),
                      padding: const EdgeInsets.symmetric(
                        vertical: 12,
                        horizontal: 30,
                      ),
                    ),
                    onPressed: markAttendance,
                    child: const Text(
                      'Mark Attendance',
                      style: TextStyle(fontSize: 16, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
      bottomSheet: Stack(
        children: [
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

  Widget _pageButton(
    String text, {
    required bool enabled,
    required VoidCallback onTap,
  }) {
    return ElevatedButton(
      onPressed: enabled ? onTap : null,
      style: ElevatedButton.styleFrom(
        backgroundColor: enabled ? const Color(0xff2cb5a0) : Colors.grey,
      ),
      child: Text(text, style: const TextStyle(color: Colors.white)),
    );
  }
}
