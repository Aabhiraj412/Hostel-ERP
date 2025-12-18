import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';
import '../landing.dart';

class Hostler extends StatefulWidget {
  const Hostler({super.key});

  @override
  State<Hostler> createState() => _HostlerState();
}

class _HostlerState extends State<Hostler> {
  bool loading = true;
  bool refreshing = false;

  bool alert = false;
  String alertMessage = '';

  bool success = false;
  String successMessage = '';

  bool loggingOut = false;

  // ---------------- FETCH DATA ----------------
  Future<void> fetchHostlerData() async {
    final appState = context.read<AppState>();

    try {
      final res = await http.get(
        Uri.parse('${appState.localhost}/api/hostler/getdetails'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(res.body);
      if (res.statusCode != 200) {
        throw data['message'] ?? 'Failed to fetch data';
      }

      appState.setData(data);
    } catch (e) {
      setState(() {
        alertMessage = 'Failed to fetch hosteller data.';
        alert = true;
      });
    } finally {
      setState(() {
        loading = false;
        refreshing = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    fetchHostlerData();
  }

  // ---------------- LOGOUT ----------------
  Future<void> logoutUser() async {
    final appState = context.read<AppState>();
    setState(() => loggingOut = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/auth/hostlerlogout'),
        headers: {'Content-Type': 'application/json'},
      );

      if (res.statusCode != 200) throw 'Logout failed';

      appState.setCookie('');
      appState.setUser('');
      appState.setData(null);

      if (!mounted) return;

      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const Landing()),
        (route) => false,
      );
    } catch (_) {
      setState(() {
        alertMessage = 'An error occurred while logging out.';
        alert = true;
      });
    } finally {
      setState(() => loggingOut = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final hostler = appState.data;

    if (loading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
        ),
      );
    }

    if (hostler == null) {
      return const Scaffold(
        body: Center(child: Text('No data available for Hosteller')),
      );
    }

    return Scaffold(
      appBar: const Nav(title: 'Hosteller Details'),
      backgroundColor: const Color(0xfff5f5f5),
      body: Stack(
        children: [
          RefreshIndicator(
            onRefresh: () async {
              setState(() => refreshing = true);
              await fetchHostlerData();
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  _detailsCard(hostler),
                  const SizedBox(height: 20),
                  _logoutButton(),
                ],
              ),
            ),
          ),

          /// Alerts
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

  // ---------------- UI ----------------
  Widget _detailsCard(dynamic h) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _row('Name', h['name']),
          _row('Roll No', h['roll_no']),
          _row('Aadhar', h['aadhar']),
          _row('Gender', h['gender']),
          _row('Father\'s Name', h['fathers_name']),
          _row('Mother\'s Name', h['mothers_name']),
          _row('Phone', h['phone_no']),
          _row('Email', h['email']),
          _row('Address', h['address']),
          _row('Year', h['year']),
          _row('College', h['college']),
          _row('Hostel', h['hostel']),
          _row('Room No', h['room_no']),
          _row('DOB', h['date_of_birth']),
          _row('Blood Group', h['blood_group']),
          _row('Local Guardian', h['local_guardian']),
          _row('LG Phone', h['local_guardian_phone']),
          _row('LG Address', h['local_guardian_address']),
          _row('Father Phone', h['fathers_no']),
          _row('Mother Phone', h['mothers_no']),
          _row('Father Email', h['fathers_email']),
          _row('Mother Email', h['mothers_email']),
          _row('Course', h['course']),
          _row('Branch', h['branch']),
        ],
      ),
    );
  }

  Widget _row(String label, dynamic value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Text(
        '$label: ${value ?? '-'}',
        style: const TextStyle(fontSize: 17, color: Color(0xff444444)),
      ),
    );
  }

  Widget _logoutButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xffe74c3c),
          padding: const EdgeInsets.symmetric(vertical: 12),
        ),
        onPressed: () => _showLogoutDialog(),
        child: const Text(
          'Logout',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  // ---------------- LOGOUT DIALOG ----------------
  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          title: const Text(
            'Log Out',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xffe74c3c),
            ),
          ),
          content: const Text('Are you sure you want to logout?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text(
                'Cancel',
                style: TextStyle(color: Colors.black),
              ),
            ),
            loggingOut
                ? const Padding(
                    padding: EdgeInsets.all(8),
                    child: CircularProgressIndicator(),
                  )
                : ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xffe74c3c),
                    ),
                    onPressed: () async {
                      Navigator.pop(dialogContext);
                      await logoutUser();
                    },
                    child: const Text(
                      'Confirm',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
          ],
        );
      },
    );
  }
}
