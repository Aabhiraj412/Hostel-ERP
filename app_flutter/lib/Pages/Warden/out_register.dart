import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';

class OutdoorRegister extends StatefulWidget {
  const OutdoorRegister({super.key});

  @override
  State<OutdoorRegister> createState() => _OutdoorRegisterState();
}

class _OutdoorRegisterState extends State<OutdoorRegister>
    with SingleTickerProviderStateMixin {
  bool loading = true;
  bool refreshing = false;
  bool fetchingStudent = false;

  List<dynamic> entries = [];
  Map<String, dynamic>? selectedStudent;

  late AnimationController _controller;
  late Animation<double> _slideAnimation;

  // ---------------- INIT ----------------
  @override
  void initState() {
    super.initState();
    fetchEntries();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );

    _slideAnimation = Tween<double>(begin: 300, end: 0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  // ---------------- FETCH ENTRIES ----------------
  Future<void> fetchEntries() async {
    final appState = context.read<AppState>();

    try {
      final response = await http.get(
        Uri.parse('${appState.localhost}/api/warden/getentries'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode != 200) {
        throw data['message'] ?? 'Unable to fetch entries';
      }

      setState(() => entries = data);
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- FETCH STUDENT DETAILS ----------------
  Future<void> fetchStudentDetails(String studentId) async {
    final appState = context.read<AppState>();

    setState(() => fetchingStudent = true);

    try {
      final response = await http.get(
        Uri.parse('${appState.localhost}/api/warden/getdetail/$studentId'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode != 200) {
        throw data['message'] ?? 'Unable to fetch student details';
      }

      setState(() => selectedStudent = data);
      _controller.forward();
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      setState(() => fetchingStudent = false);
    }
  }

  // ---------------- DISMISS POPUP ----------------
  void dismissPopup() {
    if (selectedStudent != null) {
      _controller.reverse().then((_) {
        setState(() => selectedStudent = null);
      });
    }
  }

  // ---------------- REFRESH ----------------
  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchEntries();
    setState(() => refreshing = false);
  }

  // ---------------- UI ----------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Out Register'),
      body: GestureDetector(
        onTap: dismissPopup,
        child: Stack(
          children: [
            loading
                ? const Center(
                    child:
                        CircularProgressIndicator(color: Color(0xff2cb5a0)),
                  )
                : RefreshIndicator(
                    onRefresh: onRefresh,
                    child: entries.isEmpty
                        ? const Center(
                            child: Text(
                              'No entries found',
                              style:
                                  TextStyle(fontSize: 16, color: Colors.grey),
                            ),
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.all(12),
                            itemCount: entries.length,
                            itemBuilder: (context, index) {
                              final item = entries[index];
                              return GestureDetector(
                                onTap: () =>
                                    fetchStudentDetails(item['student']),
                                child: Container(
                                  margin:
                                      const EdgeInsets.symmetric(vertical: 8),
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(15),
                                    border: const Border(
                                      left: BorderSide(
                                          color: Color(0xff2cb5a0), width: 5),
                                    ),
                                    boxShadow: const [
                                      BoxShadow(
                                        color: Colors.black12,
                                        blurRadius: 8,
                                      ),
                                    ],
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Purpose: ${item['purpose']}',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                          color: Color(0xff2cb5a0),
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        'Out Time: ${DateTime.parse(item['out_time']).toLocal()}',
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        item['in_time'] != null
                                            ? 'In Time: ${DateTime.parse(item['in_time']).toLocal()}'
                                            : 'In Time: Not Returned',
                                        style: TextStyle(
                                          color: item['in_time'] == null
                                              ? Colors.red
                                              : Colors.black,
                                          fontWeight: item['in_time'] == null
                                              ? FontWeight.bold
                                              : FontWeight.normal,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                  ),

            // ---------------- SLIDE UP DETAILS ----------------
            if (selectedStudent != null)
              AnimatedBuilder(
                animation: _slideAnimation,
                builder: (_, child) {
                  return Positioned(
                    left: 0,
                    right: 0,
                    bottom: -_slideAnimation.value,
                    child: child!,
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(20)),
                    boxShadow: [
                      BoxShadow(color: Colors.black26, blurRadius: 10),
                    ],
                  ),
                  child: fetchingStudent
                      ? const Center(
                          child: CircularProgressIndicator(
                              color: Color(0xff2cb5a0)),
                        )
                      : Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text(
                              'Student Details',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Color(0xff2cb5a0),
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text('Name: ${selectedStudent!['name']}'),
                            Text(
                                'Roll No: ${selectedStudent!['roll_no']}'),
                            Text(
                                'Phone: ${selectedStudent!['phone_no']}'),
                            Text(
                                'Hostel: ${selectedStudent!['hostel']}'),
                            Text(
                                'Room No: ${selectedStudent!['room_no']}'),
                          ],
                        ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
