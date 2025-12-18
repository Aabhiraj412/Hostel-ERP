import 'dart:convert';
import 'package:app_flutter/Pages/Warden/warden_dashboard.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;

import '../../Store/app_state.dart';
import '../../Components/success_alert.dart';
import '../../Components/error_alert.dart';
import '../../Components/nav.dart';

class WardenLogin extends StatefulWidget {
  const WardenLogin({super.key});

  @override
  State<WardenLogin> createState() => _WardenLoginState();
}

class _WardenLoginState extends State<WardenLogin> {
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

  Future<void> login() async {
    final appState = context.read<AppState>();

    setState(() => loading = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/auth/wardenlogin'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'user': userCtrl.text, 'password': passCtrl.text}),
      );

      if (res.statusCode != 200) {
        final err = jsonDecode(res.body);
        throw err['message'] ?? 'Login failed';
      }

      appState.setUser('Warden');
      appState.setCookie(res.headers['set-cookie'] ?? '');
      appState.setData(jsonDecode(res.body));

      // Navigator.pushReplacementNamed(context, '/warden-dashboard');
      // Navigator.pushReplacement(
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const WardenDashboard()),
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

  Future<void> forgetPassword() async {
    if (userCtrl.text.isEmpty) {
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
        Uri.parse('${appState.localhost}/api/warden/forgetpass'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'user': userCtrl.text}),
      );

      if (res.statusCode != 200) {
        throw 'Failed to send reset email';
      }

      setState(() {
        showForgetModal = false;
        successMessage = 'Temporary password has been sent to your email.';
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
      appBar: Nav(title: "Warden Login", showBack: true),
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
                  BoxShadow(blurRadius: 5, color: Colors.black26),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Warden Login',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xff2cb5a0),
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Enter your UserID & Password',
                    style: TextStyle(color: Colors.grey),
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
                            style: TextStyle(color: Colors.white),
                          ),
                  ),

                  const SizedBox(height: 10),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey.shade700,
                      minimumSize: const Size(double.infinity, 50),
                    ),
                    onPressed: () => setState(() => showForgetModal = true),
                    child: const Text('Forget Password', style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            ),
          ),

          /// Forget Password Modal
          // if (showForgetModal)
          //   _ForgetModal(
          //     loading: forgetting,
          //     onClose: () =>
          //         setState(() => showForgetModal = false),
          //     onSubmit: forgetPassword,
          //     controller: userCtrl,
          //   ),
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
