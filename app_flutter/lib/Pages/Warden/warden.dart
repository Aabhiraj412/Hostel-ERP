import 'dart:convert';
import 'package:app_flutter/Pages/landing.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/success_alert.dart';
import '../../Components/error_alert.dart';

class Warden extends StatefulWidget {
  const Warden({super.key});

  @override
  State<Warden> createState() => _WardenState();
}

class _WardenState extends State<Warden> {
  bool alert = false;
  String alertMessage = '';

  bool success = false;
  String successMessage = '';

  bool logout = false;
  bool pass = false;
  bool loading = false;

  bool showPassword = false;
  bool showConfirmPassword = false;

  String password = '';
  String confirmPassword = '';
  String? error;

  bool refreshing = false;

  Future<void> fetchData() async {
    final appState = context.read<AppState>();

    try {
      final res = await http.get(
        Uri.parse('${appState.localhost}/api/warden/getdetails'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(res.body);
      if (res.statusCode != 200) {
        throw data['message'] ?? 'Unable to fetch details';
      }

      appState.setUser('Warden');
      appState.setData(data);
    } catch (e) {
      debugPrint('Fetch error: $e');
    }
  }

  Future<bool> logoutUser() async {
    final appState = context.read<AppState>();
    setState(() => loading = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/auth/wardenlogout'),
        headers: {'Content-Type': 'application/json'},
      );

      if (res.statusCode != 200) throw 'Logout failed';

      appState.setCookie('');
      appState.setUser('');
      appState.setData(null);
      return true;
    } catch (_) {
      setState(() {
        alertMessage = 'An error occurred while logging out. Please try again.';
        alert = true;
      });
      return false;
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> changePassword() async {
    final appState = context.read<AppState>();

    if (password.isEmpty || confirmPassword.isEmpty) {
      setState(() => error = 'Please enter both fields.');
      return;
    }

    if (password != confirmPassword) {
      setState(() => error = 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setState(() => error = 'Password must be at least 6 characters.');
      return;
    }

    setState(() {
      error = null;
      loading = true;
    });

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/warden/resetpass'),
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
        throw data['message'] ?? 'Password change failed';
      }

      setState(() {
        successMessage = 'Password changed successfully.';
        success = true;
        pass = false;
        password = '';
        confirmPassword = '';
      });
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final warden = appState.data;

    if (warden == null) {
      return const Scaffold(
        body: Center(child: Text('No data available for the Warden')),
      );
    }

    return Scaffold(
      appBar: const Nav(title: 'Warden Details'),
      body: Center(
        child: RefreshIndicator(
          onRefresh: fetchData,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                _detailsCard(warden),

                const SizedBox(height: 20),

                _actionButton(
                  text: 'Change Password',
                  color: const Color(0xff2cb5a0),
                  onTap: _showChangePasswordDialog,
                ),

                const SizedBox(height: 10),

                _actionButton(
                  text: 'Logout',
                  color: const Color(0xffe74c3c),
                  onTap: _showLogoutDialog,
                ),

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

                // if (logout) _logoutModal(),
                // if (pass) _changePasswordModal(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _detailsCard(dynamic warden) {
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
          _detail('Name', warden['name']),
          _detail('Phone', warden['phone']),
          _detail('Email', warden['email']),
          _detail('Aadhar', warden['aadhar']),
          _detail('Gender', warden['gender']),
          _detail('Hostel', warden['hostel']),
          _detail('Post', warden['post']),
          _detail('Address', warden['address']),
        ],
      ),
    );
  }

  Widget _detail(String label, dynamic value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Text(
        '$label: $value',
        style: const TextStyle(fontSize: 18, color: Color(0xff444444)),
      ),
    );
  }

  Widget _actionButton({
    required String text,
    required Color color,
    required VoidCallback onTap,
  }) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          padding: const EdgeInsets.symmetric(vertical: 12),
        ),
        onPressed: onTap,
        child: Text(
          text,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Color(0xffffffff),
          ),
        ),
      ),
    );
  }

  // Widget _logoutModal() {
  //   return _modal(
  void _showLogoutDialog() {
    showDialog(
      context: context,
      barrierDismissible: true, // tap outside to close
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
              onPressed: () {
                Navigator.pop(dialogContext);
              },
              child: const Text(
                'Cancel',
                style: TextStyle(color: Color.fromARGB(255, 0, 0, 0)),
              ),
            ),
            loading
                ? const Padding(
                    padding: EdgeInsets.all(8),
                    child: CircularProgressIndicator(),
                  )
                : ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xffe74c3c),
                    ),
                    onPressed: () async {
                      final success = await logoutUser();
                      Navigator.pop(dialogContext);
                      if (!mounted || !success) return;

                      // Navigator.of(
                      //   context,
                      //   rootNavigator: true,
                      // ).pushReplacement(
                      //   MaterialPageRoute(builder: (_) => const Landing()),
                      // );
                      Navigator.of(
                        context,
                        rootNavigator: true,
                      ).pushAndRemoveUntil(
                        MaterialPageRoute(builder: (_) => const Landing()),
                        (route) => false, // ❗ clears entire stack
                      );
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

  void _showChangePasswordDialog() {
    showDialog(
      context: context,
      barrierDismissible: true, // tap outside to close
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          title: const Text(
            'Change Password',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xff2cb5a0),
            ),
          ),
          content: StatefulBuilder(
            builder: (context, setDialogState) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _passwordField(
                    'New Password',
                    password,
                    showPassword,
                    (v) => setDialogState(() => password = v),
                    () => setDialogState(() => showPassword = !showPassword),
                  ),
                  _passwordField(
                    'Confirm Password',
                    confirmPassword,
                    showConfirmPassword,
                    (v) => setDialogState(() => confirmPassword = v),
                    () => setDialogState(
                      () => showConfirmPassword = !showConfirmPassword,
                    ),
                  ),
                  if (error != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        error!,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                ],
              );
            },
          ),
          actions: [
            TextButton(
              onPressed: () {
                setState(() {
                  password = '';
                  confirmPassword = '';
                  error = null;
                });
                Navigator.pop(context);
              },
              child: const Text(
                'Cancel',
                style: TextStyle(color: Color.fromARGB(255, 0, 0, 0)),
              ),
            ),
            loading
                ? const Padding(
                    padding: EdgeInsets.all(8),
                    child: CircularProgressIndicator(),
                  )
                : ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff2cb5a0),
                    ),
                    onPressed: () async {
                      await changePassword();
                      if (mounted && error == null) {
                        Navigator.pop(context);
                      }
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

  // Widget _changePasswordModal() {
  //   return _modal(
  //     title: 'Change Password',
  //     message: 'Enter your new password',
  //     buttonColor: const Color(0xff2cb5a0),
  //     content: Column(
  //       children: [
  //         _passwordField(
  //           'New Password',
  //           password,
  //           showPassword,
  //           (v) => setState(() => password = v),
  //           () => setState(() => showPassword = !showPassword),
  //         ),
  //         _passwordField(
  //           'Confirm Password',
  //           confirmPassword,
  //           showConfirmPassword,
  //           (v) => setState(() => confirmPassword = v),
  //           () => setState(() => showConfirmPassword = !showConfirmPassword),
  //         ),
  //         if (error != null)
  //           Padding(
  //             padding: const EdgeInsets.only(top: 10),
  //             child: Text(error!, style: const TextStyle(color: Colors.red)),
  //           ),
  //       ],
  //     ),
  //     onConfirm: changePassword,
  //   );
  // }

  Widget _passwordField(
    String hint,
    String value,
    bool visible,
    ValueChanged<String> onChanged,
    VoidCallback toggle,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
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

  Widget _modal({
    required String title,
    required String message,
    required Color buttonColor,
    required VoidCallback onConfirm,
    Widget? content,
  }) {
    return GestureDetector(
      onTap: () => setState(() {
        logout = false;
        pass = false;
      }),
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
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: buttonColor,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(message, textAlign: TextAlign.center),
                  const SizedBox(height: 15),
                  if (content != null) content,
                  loading
                      ? const CircularProgressIndicator()
                      : ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: buttonColor,
                          ),
                          onPressed: onConfirm,
                          child: const Text(
                            'Confirm',
                            style: TextStyle(color: Color(0xffffffff)),
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
}
