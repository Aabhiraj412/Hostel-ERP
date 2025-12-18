import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/error_alert.dart';

class HostlerAttendance extends StatefulWidget {
  const HostlerAttendance({super.key});

  @override
  State<HostlerAttendance> createState() => _HostlerAttendanceState();
}

class _HostlerAttendanceState extends State<HostlerAttendance> {
  bool loading = false;
  bool refreshing = false;

  bool alert = false;
  String alertMessage = '';

  /// 🔑 Normalized date → color
  final Map<DateTime, Color> _markedDates = {};

  final DateTime _startDate = DateTime(2024, 11, 1);
  late DateTime _focusedDay;

  @override
  void initState() {
    super.initState();
    _focusedDay = DateTime.now();
    fetchHostlerData();
  }

  /// ---------------- FETCH DATA ----------------
  Future<void> fetchHostlerData() async {
    final appState = context.read<AppState>();

    try {
      setState(() => loading = true);

      final res = await http.get(
        Uri.parse('${appState.localhost}/api/hostler/getdetails'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw data['message'] ?? 'Failed to fetch attendance';
      }

      appState.setData(data);
      _buildAttendance(data);
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  /// ---------------- BUILD ATTENDANCE ----------------
  void _buildAttendance(Map<String, dynamic> data) {
    _markedDates.clear();

    /// Present dates from backend
    final List<dynamic> presentOn = data['present_on'] ?? [];

    /// Normalize present dates (YYYY-MM-DD 00:00:00)
    final Set<DateTime> presentDates = presentOn
        .map<DateTime>((d) {
          final parsed = DateTime.parse(d.toString());
          return DateTime(parsed.year, parsed.month, parsed.day);
        })
        .toSet();

    /// End date = yesterday (same as RN)
    final DateTime endDate =
        DateTime.now().subtract(const Duration(days: 1));

    DateTime current = _startDate;

    while (!current.isAfter(endDate)) {
      final normalized = DateTime(
        current.year,
        current.month,
        current.day,
      );

      if (presentDates.contains(normalized)) {
        _markedDates[normalized] = const Color(0xff2cb5a0); // 🟢 Present
      } else {
        _markedDates[normalized] = const Color(0xffe74c3c); // 🔴 Absent
      }

      current = current.add(const Duration(days: 1));
    }

    setState(() {});
  }

  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchHostlerData();
    setState(() => refreshing = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Attendance'),
      body: Stack(
        children: [
          if (loading)
            const Center(
              child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
            )
          else
            RefreshIndicator(
              onRefresh: onRefresh,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: TableCalendar(
                  firstDay: _startDate,
                  lastDay: DateTime.now(),
                  focusedDay: _focusedDay,

                  headerStyle: const HeaderStyle(
                    formatButtonVisible: false,
                    titleCentered: true,
                    titleTextStyle: TextStyle(
                      color: Color(0xff2cb5a0),
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                    leftChevronIcon: Icon(
                      Icons.chevron_left,
                      color: Color(0xff2cb5a0),
                    ),
                    rightChevronIcon: Icon(
                      Icons.chevron_right,
                      color: Color(0xff2cb5a0),
                    ),
                  ),

                  calendarStyle: CalendarStyle(
                    todayDecoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      shape: BoxShape.circle,
                    ),
                    defaultDecoration:
                        const BoxDecoration(shape: BoxShape.circle),
                  ),

                  calendarBuilders: CalendarBuilders(
                    defaultBuilder: (context, day, _) {
                      final normalized =
                          DateTime(day.year, day.month, day.day);
                      final color = _markedDates[normalized];

                      if (color == null) return null;

                      return Container(
                        margin: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: color,
                          shape: BoxShape.circle,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          '${day.day}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      );
                    },
                  ),

                  onPageChanged: (day) {
                    _focusedDay = day;
                  },
                ),
              ),
            ),

          /// 🔔 ERROR ALERT
          ErrorAlert(
            message: alertMessage,
            alert: alert,
            onClose: () => setState(() => alert = false),
          ),
        ],
      ),
    );
  }
}
