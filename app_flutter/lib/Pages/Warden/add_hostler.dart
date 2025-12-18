import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/error_alert.dart';

class AddHostler extends StatefulWidget {
  const AddHostler({super.key});

  @override
  State<AddHostler> createState() => _AddHostlerState();
}

class _AddHostlerState extends State<AddHostler> {
  bool loading = false;
  bool alert = false;
  String alertMessage = '';

  final Map<String, TextEditingController> controllers = {
    'name': TextEditingController(),
    'roll_no': TextEditingController(),
    'aadhar': TextEditingController(),
    'fathers_name': TextEditingController(),
    'mothers_name': TextEditingController(),
    'phone_no': TextEditingController(),
    'email': TextEditingController(),
    'address': TextEditingController(),
    'college': TextEditingController(),
    'room_no': TextEditingController(),
  };

  String gender = '';
  String year = '';
  String hostel = '';

  late String password;

  // ---------------- PASSWORD GENERATOR ----------------
  String generatePassword() {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    final rand = Random();
    return List.generate(6, (_) => chars[rand.nextInt(chars.length)]).join();
  }

  @override
  void initState() {
    super.initState();
    password = generatePassword();
  }

  // ---------------- SUBMIT ----------------
  Future<void> handleSubmit() async {
    final appState = context.read<AppState>();

    if (controllers.values.any((c) => c.text.trim().isEmpty) ||
        gender.isEmpty ||
        year.isEmpty ||
        hostel.isEmpty) {
      setState(() {
        alertMessage = 'All required fields must be filled.';
        alert = true;
      });
      return;
    }

    final body = {
      'name': controllers['name']!.text.trim(),
      'roll_no': controllers['roll_no']!.text.trim(),
      'aadhar': controllers['aadhar']!.text.trim(),
      'gender': gender,
      'fathers_name': controllers['fathers_name']!.text.trim(),
      'mothers_name': controllers['mothers_name']!.text.trim(),
      'phone_no': controllers['phone_no']!.text.trim(),
      'email': controllers['email']!.text.trim(),
      'address': controllers['address']!.text.trim(),
      'year': year,
      'college': controllers['college']!.text.trim(),
      'hostel': hostel,
      'room_no': controllers['room_no']!.text.trim(),
      'password': password,
      'confirm_password': password,
    };

    setState(() => loading = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/warden/addhostler'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
        body: jsonEncode(body),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 200 || res.statusCode == 201) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => Scaffold(
              appBar: const Nav(title: 'Hosteller Added'),
              body: Center(
                child: Text(
                  'Hosteller added successfully!',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.green.shade700,
                  ),
                ),
              ),
            ),
          ),
        );
      } else {
        throw data['message'] ?? 'Failed to add hosteller';
      }
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  Widget _input(
    String key,
    String hint, {
    TextInputType type = TextInputType.text,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextField(
        controller: controllers[key],
        keyboardType: type,
        decoration: InputDecoration(
          hintText: hint,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          filled: true,
          fillColor: Colors.white,
        ),
      ),
    );
  }

  Widget _dropdown(
    String label,
    String value,
    List<String> items,
    void Function(String?) onChanged,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey)),
        const SizedBox(height: 5),
        DropdownButtonFormField<String>(
          value: value.isEmpty ? null : value,
          items: items
              .map((e) => DropdownMenuItem(value: e, child: Text(e)))
              .toList(),
          onChanged: onChanged,
          decoration: InputDecoration(
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            filled: true,
            fillColor: Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _genderSelector() {
    return Row(
      children: ['male', 'female'].map((g) {
        final selected = gender == g;
        return Expanded(
          child: GestureDetector(
            onTap: () => setState(() => gender = g),
            child: Container(
              margin: const EdgeInsets.all(5),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: selected ? const Color(0xff2cb5a0) : Colors.grey[300],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                g.toUpperCase(),
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: selected ? Colors.white : Colors.black54,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Add Hosteller'),
      backgroundColor: const Color(0xfff5f5f5),
      body: loading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  _input('name', 'Name'),
                  _input('roll_no', 'Roll Number'),
                  _input('aadhar', 'Aadhar Number', type: TextInputType.number),
                  _input('fathers_name', "Father's Name"),
                  _input('mothers_name', "Mother's Name"),
                  _input('phone_no', 'Phone Number', type: TextInputType.phone),
                  _input('email', 'Email', type: TextInputType.emailAddress),

                  const SizedBox(height: 10),
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text('Gender'),
                  ),
                  _genderSelector(),

                  _input('address', 'Address'),

                  _dropdown('Year', year, [
                    '1st',
                    '2nd',
                    '3rd',
                    '4th',
                  ], (v) => setState(() => year = v ?? '')),

                  _input('college', 'College'),

                  _dropdown('Hostel', hostel, [
                    'Aryabhatt',
                    'RN Tagore',
                    'Sarojni Naidu',
                  ], (v) => setState(() => hostel = v ?? '')),

                  _input('room_no', 'Room Number', type: TextInputType.number),

                  const SizedBox(height: 20),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff2cb5a0),
                      minimumSize: const Size(double.infinity, 50),
                    ),
                    onPressed: handleSubmit,
                    child: const Text(
                      'Add Hosteller',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),

                  ErrorAlert(
                    message: alertMessage,
                    alert: alert,
                    onClose: () => setState(() => alert = false),
                  ),
                ],
              ),
            ),
    );
  }
}
