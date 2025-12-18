import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/minicard.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';
import 'hostler.dart';

class HostlerDashboard extends StatefulWidget {
  const HostlerDashboard({super.key});

  @override
  State<HostlerDashboard> createState() => _HostlerDashboardState();
}

class _HostlerDashboardState extends State<HostlerDashboard> {
  bool loading = false;
  bool showSetPassword = false;

  String password = '';
  String confirmPassword = '';
  bool showPassword = false;
  bool showConfirmPassword = false;

  bool alert = false;
  String alertMessage = '';

  bool success = false;
  String successMessage = '';

  // ---------------- PROFILE COMPLETION CHECK ----------------
  bool _needsCompletion(Map<String, dynamic>? data) {
    if (data == null) return true;

    const fields = [
      'password',
      'date_of_birth',
      'blood_group',
      'local_guardian',
      'local_guardian_phone',
      'local_guardian_address',
      'fathers_no',
      'mothers_no',
      'fathers_email',
      'mothers_email',
      'course',
      'branch',
    ];

    for (final f in fields) {
      if (data[f] == null || data[f].toString().trim().isEmpty) {
        return true;
      }
    }
    return false;
  }

  // ---------------- SET PASSWORD ----------------
  Future<void> setPassword() async {
    final appState = context.read<AppState>();

    if (password != confirmPassword) {
      setState(() {
        alertMessage = 'Passwords do not match.';
        alert = true;
      });
      return;
    }

    setState(() => loading = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/hostler/setpass'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
        body: jsonEncode({
          'password': password,
          'confirm_password': confirmPassword,
        }),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw data['message'] ?? 'Failed to update password';
      }

      appState.setData(data);

      setState(() {
        successMessage = data['message'] ?? 'Password updated successfully.';
        success = true;
        showSetPassword = false;
        password = '';
        confirmPassword = '';
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

  void go(String route) {
    Navigator.pushNamed(context, route);
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final data = appState.data;
    final needsCompletion = _needsCompletion(data);

    return Scaffold(
      appBar: const Nav(title: 'Hosteller Dashboard', showBack: false),
      backgroundColor: const Color(0xfff8f9fa),
      body: Stack(
        children: [
          /// 🔥 GRID DASHBOARD (STABLE)
          GridView.count(
            padding: const EdgeInsets.all(16),
            crossAxisCount: 2,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            childAspectRatio: 1,
            children: [
              if (needsCompletion) ...[
                MiniCard(
                  title: 'Add Details',
                  icon: Icons.person_add,
                  onTap: () => go('/add-details'),
                ),
                MiniCard(
                  title: 'Set Password',
                  icon: Icons.lock,
                  onTap: () => setState(() => showSetPassword = true),
                ),
              ],

              MiniCard(
                title: 'Profile',
                icon: Icons.person,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const Hostler()),
                  );
                },
              ),
              MiniCard(
                title: 'View Attendance',
                icon: Icons.check_circle,
                onTap: () => go('/hosteller-attendance'),
              ),
              MiniCard(
                title: 'Leaves',
                icon: Icons.calendar_month,
                onTap: () => go('/leaves'),
              ),
              MiniCard(
                title: 'Out Register',
                icon: Icons.assignment,
                onTap: () => go('/out-register'),
              ),
              MiniCard(
                title: 'Public Grievances',
                icon: Icons.help,
                onTap: () => go('/public-grievances'),
              ),
              MiniCard(
                title: 'Private Grievances',
                icon: Icons.lock_outline,
                onTap: () => go('/private-grievances'),
              ),
              MiniCard(
                title: 'Mess Menu',
                icon: Icons.restaurant,
                onTap: () => go('/mess-menu'),
              ),
              MiniCard(
                title: 'Notices',
                icon: Icons.campaign,
                onTap: () => go('/notices'),
              ),
            ],
          ),

          /// 🔔 ALERTS
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

          /// 🔐 SET PASSWORD MODAL
          if (showSetPassword) _setPasswordDialog(),
        ],
      ),
    );
  }

  // ---------------- SET PASSWORD MODAL ----------------
  Widget _setPasswordDialog() {
    return GestureDetector(
      onTap: () => setState(() => showSetPassword = false),
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
                  const Text(
                    'Set Password',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xff2cb5a0),
                    ),
                  ),
                  const SizedBox(height: 15),

                  _passwordField(
                    'Password',
                    password,
                    showPassword,
                    (v) => setState(() => password = v),
                    () => setState(() => showPassword = !showPassword),
                  ),
                  _passwordField(
                    'Confirm Password',
                    confirmPassword,
                    showConfirmPassword,
                    (v) => setState(() => confirmPassword = v),
                    () => setState(
                      () => showConfirmPassword = !showConfirmPassword,
                    ),
                  ),

                  const SizedBox(height: 10),

                  loading
                      ? const CircularProgressIndicator()
                      : SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xff2cb5a0),
                            ),
                            onPressed: setPassword,
                            child: const Text(
                              'Set Password',
                              style: TextStyle(color: Colors.white),
                            ),
                          ),
                        ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _passwordField(
    String hint,
    String value,
    bool visible,
    ValueChanged<String> onChanged,
    VoidCallback toggle,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        obscureText: !visible,
        onChanged: onChanged,
        decoration: InputDecoration(
          hintText: hint,
          border: const OutlineInputBorder(),
          suffixIcon: IconButton(
            icon: Icon(visible ? Icons.visibility : Icons.visibility_off),
            onPressed: toggle,
          ),
        ),
      ),
    );
  }
}
