import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';

class HostlerLeaves extends StatefulWidget {
  const HostlerLeaves({super.key});

  @override
  State<HostlerLeaves> createState() => _HostlerLeavesState();
}

class _HostlerLeavesState extends State<HostlerLeaves> {
  List<dynamic> leaves = [];
  bool loading = true;
  bool refreshing = false;

  bool alert = false;
  String alertMessage = '';

  bool success = false;
  String successMessage = '';

  String filterStatus = 'All';

  bool showApplyModal = false;
  bool processing = false;

  dynamic selectedLeave;

  final TextEditingController daysCtrl = TextEditingController();
  final TextEditingController reasonCtrl = TextEditingController();
  final TextEditingController addressCtrl = TextEditingController();
  final TextEditingController contactCtrl = TextEditingController();

  DateTime? fromDate;
  DateTime? toDate;

  // ---------------- FETCH LEAVES ----------------
  Future<void> fetchLeaves() async {
    final appState = context.read<AppState>();

    try {
      final res = await http.get(
        Uri.parse('${appState.localhost}/api/Hostler/getleaves'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(res.body);
      data.sort(
        (a, b) => DateTime.parse(b['createdAt'])
            .compareTo(DateTime.parse(a['createdAt'])),
      );

      setState(() => leaves = data);
    } catch (e) {
      setState(() {
        alertMessage = 'Failed to fetch leaves';
        alert = true;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- APPLY LEAVE ----------------
  Future<void> applyLeave() async {
    final appState = context.read<AppState>();

    if (daysCtrl.text.isEmpty ||
        fromDate == null ||
        toDate == null ||
        reasonCtrl.text.isEmpty ||
        addressCtrl.text.isEmpty ||
        contactCtrl.text.isEmpty) {
      setState(() {
        alertMessage = 'Please fill all fields.';
        alert = true;
      });
      return;
    }

    final diff =
        toDate!.difference(fromDate!).inDays + 1;

    if (diff != int.tryParse(daysCtrl.text)) {
      setState(() {
        alertMessage = 'Incorrect number of days.';
        alert = true;
      });
      return;
    }

    setState(() => processing = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/hostler/applyleave'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
        body: jsonEncode({
          'days': daysCtrl.text,
          'from': DateFormat('yyyy-MM-dd').format(fromDate!),
          'to': DateFormat('yyyy-MM-dd').format(toDate!),
          'reason': reasonCtrl.text,
          'address': addressCtrl.text,
          'contact_no': contactCtrl.text,
        }),
      );

      if (res.statusCode != 200) {
        throw 'Failed to apply leave';
      }

      final newLeave = jsonDecode(res.body);
      setState(() {
        leaves.insert(0, newLeave);
        showApplyModal = false;
        successMessage = 'Leave applied successfully';
        success = true;
        _clearForm();
      });
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => processing = false);
    }
  }

  void _clearForm() {
    daysCtrl.clear();
    reasonCtrl.clear();
    addressCtrl.clear();
    contactCtrl.clear();
    fromDate = null;
    toDate = null;
  }

  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchLeaves();
    setState(() => refreshing = false);
  }

  List<dynamic> get filteredLeaves {
    if (filterStatus == 'All') return leaves;
    return leaves.where((l) => l['status'] == filterStatus).toList();
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'Approved':
        return const Color(0xff66BB6A);
      case 'Rejected':
        return const Color(0xffEF5350);
      default:
        return const Color(0xffFFA726);
    }
  }

  @override
  void initState() {
    super.initState();
    fetchLeaves();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Leaves'),
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
                        child: ListView.builder(
                          itemCount: filteredLeaves.length,
                          itemBuilder: (_, i) {
                            final leave = filteredLeaves[i];
                            return _leaveCard(leave);
                          },
                        ),
                      ),
              ),
            ],
          ),

          /// APPLY BUTTON
          Positioned(
            bottom: 20,
            left: 20,
            right: 20,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xff2cb5a0),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              onPressed: () => setState(() => showApplyModal = true),
              child: const Text(
                'Apply for Leave',
                style: TextStyle(fontSize: 16, color: Colors.white),
              ),
            ),
          ),

          if (showApplyModal) _applyLeaveDialog(),
          if (selectedLeave != null) _leaveDetailsDialog(),

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

  // ---------------- UI HELPERS ----------------
  Widget _filterRow() {
    const filters = ['All', 'Pending', 'Approved', 'Rejected'];
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: filters.map((f) {
          final active = filterStatus == f;
          return ChoiceChip(
            label: Text(f),
            selected: active,
            selectedColor: const Color(0xff2cb5a0),
            onSelected: (_) => setState(() => filterStatus = f),
            labelStyle: TextStyle(
              color: active ? Colors.white : const Color(0xff2cb5a0),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _leaveCard(dynamic leave) {
    return GestureDetector(
      onTap: () => setState(() => selectedLeave = leave),
      child: Card(
        margin: const EdgeInsets.all(10),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Reason: ${leave['reason']}'),
              Text('From: ${leave['from'].split('T')[0]}'),
              Text('To: ${leave['to'].split('T')[0]}'),
              Container(
                margin: const EdgeInsets.only(top: 8),
                padding: const EdgeInsets.symmetric(
                    horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _statusColor(leave['status']),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  leave['status'],
                  style: const TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _applyLeaveDialog() {
    return _modal(
      title: 'Apply for Leave',
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _input(daysCtrl, 'No of Days', TextInputType.number),
          _datePicker('From Date', fromDate, (d) => setState(() => fromDate = d)),
          _datePicker('To Date', toDate, (d) => setState(() => toDate = d)),
          _input(reasonCtrl, 'Reason'),
          _input(addressCtrl, 'Address'),
          _input(contactCtrl, 'Contact Number', TextInputType.phone),
          const SizedBox(height: 10),
          processing
              ? const CircularProgressIndicator()
              : ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xff2cb5a0),
                  ),
                  onPressed: applyLeave,
                  child: const Text(
                    'Submit',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
        ],
      ),
      onClose: () => setState(() => showApplyModal = false),
    );
  }

  Widget _leaveDetailsDialog() {
    final l = selectedLeave;
    return _modal(
      title: 'Leave Details',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Reason: ${l['reason']}'),
          Text('From: ${l['from'].split('T')[0]}'),
          Text('To: ${l['to'].split('T')[0]}'),
          Text('Days: ${l['days']}'),
          Text('Contact: ${l['contact_no']}'),
          Text('Address: ${l['address']}'),
          Container(
            margin: const EdgeInsets.only(top: 8),
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: _statusColor(l['status']),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              'Status: ${l['status']}',
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
      onClose: () => setState(() => selectedLeave = null),
    );
  }

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
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xff2cb5a0),
                    ),
                  ),
                  const SizedBox(height: 10),
                  child,
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _input(
    TextEditingController ctrl,
    String hint, [
    TextInputType type = TextInputType.text,
  ]) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: TextField(
        controller: ctrl,
        keyboardType: type,
        decoration: InputDecoration(
          hintText: hint,
          border: const OutlineInputBorder(),
        ),
      ),
    );
  }

  Widget _datePicker(
    String label,
    DateTime? date,
    ValueChanged<DateTime> onPick,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xff2cb5a0),
        ),
        onPressed: () async {
          final picked = await showDatePicker(
            context: context,
            initialDate: date ?? DateTime.now(),
            firstDate: DateTime(2024),
            lastDate: DateTime(2100),
          );
          if (picked != null) onPick(picked);
        },
        child: Text(
          date == null
              ? label
              : DateFormat('yyyy-MM-dd').format(date),
          style: const TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}
