import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/success_alert.dart';
import '../../Components/error_alert.dart';
import 'hostler_dashboard.dart';

class HostlerLogin extends StatefulWidget {
  const HostlerLogin({super.key});

  @override
  State<HostlerLogin> createState() => _HostlerLoginState();
}

class _HostlerLoginState extends State<HostlerLogin> {
  final TextEditingController userCtrl = TextEditingController();
  final TextEditingController passCtrl = TextEditingController();

  bool loading = false;
  bool forgetting = false;
  bool showPassword = false;
  bool showForgetModal = false;

  bool success = false;
  String successMessage = '';

  bool errorAlert = false;
  String errorMessage = '';

  @override
  void dispose() {
    userCtrl.dispose();
    passCtrl.dispose();
    super.dispose();
  }

  // ---------------- LOGIN ----------------
  Future<void> login() async {
    final appState = context.read<AppState>();

    setState(() => loading = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/auth/hostlerlogin'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user': userCtrl.text.trim(),
          'password': passCtrl.text,
        }),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw data['message'] ?? 'Login failed';
      }

      final cookie = res.headers['set-cookie'];
      if (cookie != null) appState.setCookie(cookie);

      appState.setUser('Hosteller');
      appState.setData(data);

      if (!mounted) return;

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const HostlerDashboard()),
        (route) => false,
      );
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        errorAlert = true;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- FORGET PASSWORD ----------------
  Future<void> forgetPassword() async {
    if (userCtrl.text.trim().isEmpty) {
      setState(() {
        errorMessage = 'Please enter UserID';
        errorAlert = true;
      });
      return;
    }

    final appState = context.read<AppState>();
    setState(() => forgetting = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/hostler/forgetpass'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'user': userCtrl.text.trim()}),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw data['message'] ?? 'Failed to send email';
      }

      setState(() {
        showForgetModal = false;
        successMessage = 'Your temporary password has been sent to your email.';
        success = true;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        errorAlert = true;
      });
    } finally {
      setState(() => forgetting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Hosteller Login', showBack: true),
      backgroundColor: const Color(0xfff5f5f5),
      body: Stack(
        children: [
          Center(
            child: Container(
              width: 350,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                boxShadow: const [
                  BoxShadow(color: Colors.black12, blurRadius: 5),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Hosteller Login',
                    style: TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                      color: Color(0xff2cb5a0),
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Please enter your UserID and Password',
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),

                  TextField(
                    controller: userCtrl,
                    decoration: const InputDecoration(
                      labelText: 'UserID',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 15),

                  TextField(
                    controller: passCtrl,
                    obscureText: !showPassword,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      border: const OutlineInputBorder(),
                      suffixIcon: IconButton(
                        icon: Icon(
                          showPassword
                              ? Icons.visibility_off
                              : Icons.visibility,
                        ),
                        onPressed: () =>
                            setState(() => showPassword = !showPassword),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff2cb5a0),
                      minimumSize: const Size(double.infinity, 50),
                    ),
                    onPressed: loading ? null : login,
                    child: loading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text(
                            'Login',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                  ),

                  const SizedBox(height: 10),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey.shade700,
                      minimumSize: const Size(double.infinity, 50),
                    ),
                    onPressed: () => setState(() => showForgetModal = true),
                    child: const Text(
                      'Forget Password',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          /// Forget Password Modal
          if (showForgetModal)
            _ForgetModal(
              loading: forgetting,
              controller: userCtrl,
              onClose: () => setState(() => showForgetModal = false),
              onSubmit: forgetPassword,
            ),

          SuccessAlert(
            message: successMessage,
            success: success,
            onClose: () => setState(() => success = false),
          ),

          ErrorAlert(
            message: errorMessage,
            alert: errorAlert,
            onClose: () => setState(() => errorAlert = false),
          ),
        ],
      ),
    );
  }
}

class _ForgetModal extends StatelessWidget {
  final bool loading;
  final VoidCallback onClose;
  final VoidCallback onSubmit;
  final TextEditingController controller;

  const _ForgetModal({
    required this.loading,
    required this.onClose,
    required this.onSubmit,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
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
                  const Text(
                    'Forget Password',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xff2cb5a0),
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Enter your UserID to receive a temporary password.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 15),

                  TextField(
                    controller: controller,
                    decoration: const InputDecoration(
                      labelText: 'UserID',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 20),

                  loading
                      ? const CircularProgressIndicator(
                          color: Color(0xff2cb5a0),
                        )
                      : ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xff2cb5a0),
                            minimumSize: const Size(double.infinity, 45),
                          ),
                          onPressed: onSubmit,
                          child: const Text(
                            'Reset Password',
                            style: TextStyle(color: Colors.white),
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
