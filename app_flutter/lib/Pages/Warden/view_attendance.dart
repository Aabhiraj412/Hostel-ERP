import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';

class ViewAttendance extends StatefulWidget {
  const ViewAttendance({super.key});

  @override
  State<ViewAttendance> createState() => _ViewAttendanceState();
}

class _ViewAttendanceState extends State<ViewAttendance> {
  DateTime selectedDate = DateTime.now();
  String selectedHostel = 'All';

  List<dynamic> hostlers = [];

  bool loading = false;
  bool refreshing = false;

  bool alert = false;
  String alertMessage = '';

  bool success = false;
  String successMessage = '';

  // ---------------- FETCH HOSTLERS ----------------
  Future<void> fetchHostlers() async {
    final appState = context.read<AppState>();

    setState(() => loading = true);

    try {
      final formattedDate = DateFormat('yyyy-MM-dd').format(
        selectedDate.toLocal(),
      );

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

      final List filteredByDate = data.map((hostler) {
        final bool isPresent = (hostler['present_on'] as List).any(
          (d) => d.toString().split('T')[0] == formattedDate,
        );

        return {
          ...hostler,
          'status': isPresent ? 'present' : 'absent',
        };
      }).toList();

      final List filteredByHostel = selectedHostel == 'All'
          ? filteredByDate
          : filteredByDate
              .where((h) => h['hostel'] == selectedHostel)
              .toList();

      setState(() {
        hostlers = filteredByHostel;
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

  // ---------------- DATE PICKER ----------------
  Future<void> pickDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2022),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      setState(() => selectedDate = picked);
      fetchHostlers();
    }
  }

  // ---------------- REFRESH ----------------
  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchHostlers();
    setState(() => refreshing = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'View Attendance'),
      body: Stack(
        children: [
          RefreshIndicator(
            onRefresh: onRefresh,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                /// DATE PICKER
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xfff7a400),
                  ),
                  onPressed: pickDate,
                  child: Text(
                    DateFormat('EEE, dd MMM yyyy').format(selectedDate),
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                /// HOSTEL DROPDOWN
                DropdownButtonFormField<String>(
                  value: selectedHostel,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'All', child: Text('All Hostels')),
                    DropdownMenuItem(
                        value: 'Aryabhatt', child: Text('Aryabhatt')),
                    DropdownMenuItem(
                        value: 'RN Tagore', child: Text('RN Tagore')),
                    DropdownMenuItem(
                        value: 'Sarojni Naidu',
                        child: Text('Sarojni Naidu')),
                  ],
                  onChanged: (val) {
                    setState(() => selectedHostel = val!);
                    fetchHostlers();
                  },
                ),

                const SizedBox(height: 16),

                /// FETCH BUTTON
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xff2cb5a0),
                  ),
                  onPressed: loading ? null : fetchHostlers,
                  child: Text(
                    loading ? 'Fetching...' : 'Fetch Attendance',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                /// HOSTLERS LIST
                if (hostlers.isEmpty && !loading)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.only(top: 40),
                      child: Text(
                        'No records found',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  )
                else
                  ...hostlers.map(
                    (hostler) => Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: const BoxDecoration(
                        border: Border(
                          bottom: BorderSide(color: Colors.grey),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            hostler['name'],
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'Room No: ${hostler['room_no']}',
                            style: const TextStyle(color: Colors.grey),
                          ),
                          Text(
                            hostler['status'] == 'present'
                                ? 'Present'
                                : 'Absent',
                            style: TextStyle(
                              color: hostler['status'] == 'present'
                                  ? const Color(0xff2cb5a0)
                                  : Colors.red,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),

          /// LOADING OVERLAY
          if (loading)
            const Center(
              child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
            ),

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
}
