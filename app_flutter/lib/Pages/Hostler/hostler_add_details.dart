import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';

class AddDetails extends StatefulWidget {
  const AddDetails({super.key});

  @override
  State<AddDetails> createState() => _AddDetailsState();
}

class _AddDetailsState extends State<AddDetails> {
  bool loading = false;
  bool alert = false;
  bool success = false;

  String alertMessage = '';
  String successMessage = '';

  DateTime selectedDate = DateTime.now();

  final Map<String, String> formData = {
    'date_of_birth': '',
    'blood_group': '',
    'local_guardian': '',
    'local_guardian_phone': '',
    'local_guardian_address': '',
    'fathers_no': '',
    'mothers_no': '',
    'fathers_email': '',
    'mothers_email': '',
    'course': '',
    'branch': '',
  };

  void handleChange(String key, String value) {
    setState(() => formData[key] = value);
  }

  Future<void> pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(1990),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      setState(() {
        selectedDate = picked;
        formData['date_of_birth'] =
            picked.toIso8601String().split('T')[0];
      });
    }
  }

  Future<void> submit() async {
    final appState = context.read<AppState>();

    if (formData.values.any((v) => v.isEmpty)) {
      setState(() {
        alertMessage = 'Please fill all required fields.';
        alert = true;
      });
      return;
    }

    setState(() => loading = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/hostler/adddetails'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
        body: jsonEncode(formData),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        setState(() {
          successMessage = 'Details added successfully!';
          success = true;
        });

        Navigator.pushReplacementNamed(context, 'Hosteller');
      } else {
        throw data['message'] ?? 'Failed to add details';
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

  Widget input(String hint, String key,
      {TextInputType type = TextInputType.text}) {
    return TextFormField(
      decoration: InputDecoration(
        hintText: hint,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
        filled: true,
        fillColor: Colors.white,
      ),
      keyboardType: type,
      onChanged: (v) => handleChange(key, v),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Details'),
        backgroundColor: const Color(0xff2cb5a0),
      ),
      body: loading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  /// DATE OF BIRTH
                  Align(
                    alignment: Alignment.centerLeft,
                    child: const Text(
                      'Date of Birth',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff2cb5a0),
                    ),
                    onPressed: pickDate,
                    child: Text(
                      formData['date_of_birth']!.isEmpty
                          ? 'Select Date'
                          : formData['date_of_birth']!,
                    ),
                  ),

                  const SizedBox(height: 15),

                  /// BLOOD GROUP
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      filled: true,
                      fillColor: Colors.white,
                      hintText: 'Blood Group',
                    ),
                    items: const [
                      'A+','B+','O+','AB+','A-','B-','O-','AB-'
                    ]
                        .map(
                          (e) => DropdownMenuItem(
                            value: e,
                            child: Text(e),
                          ),
                        )
                        .toList(),
                    onChanged: (v) => handleChange('blood_group', v ?? ''),
                  ),

                  const SizedBox(height: 15),

                  input('Local Guardian Name', 'local_guardian'),
                  input('Local Guardian Phone', 'local_guardian_phone',
                      type: TextInputType.phone),
                  input('Local Guardian Address', 'local_guardian_address'),

                  input('Father Phone', 'fathers_no',
                      type: TextInputType.phone),
                  input('Mother Phone', 'mothers_no',
                      type: TextInputType.phone),

                  input('Father Email', 'fathers_email',
                      type: TextInputType.emailAddress),
                  input('Mother Email', 'mothers_email',
                      type: TextInputType.emailAddress),

                  input('Course', 'course'),
                  input('Branch', 'branch'),

                  const SizedBox(height: 25),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xff2cb5a0),
                      ),
                      onPressed: submit,
                      child: const Text(
                        'Add Details',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
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
                ],
              ),
            ),
    );
  }
}
