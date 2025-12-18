import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';

class HostlerDetails extends StatefulWidget {
  final Map<String, dynamic> hostler;

  const HostlerDetails({super.key, required this.hostler});

  @override
  State<HostlerDetails> createState() => _HostlerDetailsState();
}

class _HostlerDetailsState extends State<HostlerDetails> {
  bool loading = false;
  bool refreshing = false;

  bool showChangeRoom = false;
  bool showRemove = false;

  String hostel = '';
  String room = '';

  // ---------------- CHANGE ROOM ----------------
  Future<void> changeRoom() async {
    final appState = context.read<AppState>();

    if (hostel.isEmpty || room.isEmpty) return;

    setState(() => loading = true);

    try {
      final res = await http.post(
        Uri.parse(
          '${appState.localhost}/api/warden/setroom/${widget.hostler['_id']}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
        body: jsonEncode({'hostel': hostel, 'room': room}),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Room changed successfully')),
        );
      } else {
        throw data['message'] ?? 'Failed to change room';
      }
    } catch (e) {
      _showError(e.toString());
    } finally {
      setState(() {
        loading = false;
        showChangeRoom = false;
      });
    }
  }

  // ---------------- REMOVE HOSTLER ----------------
  Future<void> removeHostler() async {
    final appState = context.read<AppState>();

    setState(() => loading = true);

    try {
      final res = await http.get(
        Uri.parse(
          '${appState.localhost}/api/warden/removehostler/${widget.hostler['_id']}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        Navigator.pop(context);
      } else {
        throw data['message'] ?? 'Failed to remove hosteller';
      }
    } catch (e) {
      _showError(e.toString());
    } finally {
      setState(() {
        loading = false;
        showRemove = false;
      });
    }
  }

  // ---------------- ERROR ----------------
  void _showError(String msg) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(msg), backgroundColor: Colors.red));
  }

  // ---------------- REFRESH ----------------
  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => refreshing = false);
  }

  Widget _info(String label, dynamic value) {
    if (value == null || value.toString().isEmpty) return const SizedBox();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Text(
        '$label: $value',
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final h = widget.hostler;

    return Scaffold(
      appBar: const Nav(title: 'Hosteller Details'),
      backgroundColor: const Color(0xfff5f5f5),
      body: Stack(
        children: [
          RefreshIndicator(
            onRefresh: onRefresh,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(15),
                      boxShadow: const [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 10,
                          offset: Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _info('Name', h['name']),
                        _info('Phone', h['phone_no']),
                        _info('Email', h['email']),
                        _info('Aadhar', h['aadhar']),
                        _info('Roll No', h['roll_no']),
                        _info('Gender', h['gender']),
                        _info('Year', h['year']),
                        _info('College', h['college']),
                        _info('Hostel', h['hostel']),
                        _info('Room No', h['room_no']),
                        _info('Address', h['address']),
                        _info('Father', h['fathers_name']),
                        _info('Mother', h['mothers_name']),
                      ],
                    ),
                  ),

                  const SizedBox(height: 30),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xff2cb5a0),
                        padding: const EdgeInsets.all(14),
                      ),
                      onPressed: () => setState(() => showChangeRoom = true),
                      child: const Text(
                        'Change Room',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 15),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xffe74c3c),
                        padding: const EdgeInsets.all(14),
                      ),
                      onPressed: () => setState(() => showRemove = true),
                      child: const Text(
                        'Remove Hosteller',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ---------------- LOADING ----------------
          if (loading)
            const Center(
              child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
            ),

          // ---------------- CHANGE ROOM MODAL ----------------
          if (showChangeRoom)
            _modal(
              title: 'Change Room',
              child: Column(
                children: [
                  DropdownButtonFormField<String>(
                    value: hostel.isEmpty ? null : hostel,
                    items: const [
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
                    onChanged: (v) => setState(() => hostel = v ?? ''),
                    decoration: const InputDecoration(
                      labelText: 'Select Hostel',
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    decoration: const InputDecoration(labelText: 'Room Number'),
                    onChanged: (v) => room = v,
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: changeRoom,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff2cb5a0),
                    ),
                    child: const Text(
                      'Submit',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              onClose: () => setState(() => showChangeRoom = false),
            ),

          // ---------------- REMOVE MODAL ----------------
          if (showRemove)
            _modal(
              title: 'Remove Hosteller',
              child: Column(
                children: [
                  const Text(
                    'Are you sure you want to remove this hosteller?',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: removeHostler,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xffe74c3c),
                    ),
                    child: const Text(
                      'Remove',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              onClose: () => setState(() => showRemove = false),
            ),
        ],
      ),
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
