import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';

class PublishNotice extends StatefulWidget {
  const PublishNotice({super.key});

  @override
  State<PublishNotice> createState() => _PublishNoticeState();
}

class _PublishNoticeState extends State<PublishNotice> {
  final TextEditingController titleCtrl = TextEditingController();
  final TextEditingController descCtrl = TextEditingController();

  File? pdfFile;

  bool loading = false;
  bool alert = false;
  bool success = false;

  String alertMessage = '';
  String successMessage = '';

  // ---------------- PICK PDF ----------------
  Future<void> pickFile() async {
    try {
      final picker = ImagePicker();

      final XFile? file = await picker.pickImage(source: ImageSource.gallery);

      if (file == null) return;

      if (!file.path.toLowerCase().endsWith('.pdf')) {
        setState(() {
          alertMessage = 'Please select a PDF file only';
          alert = true;
        });
        return;
      }

      setState(() {
        pdfFile = File(file.path);
      });
    } catch (e) {
      setState(() {
        alertMessage = 'Failed to pick file';
        alert = true;
      });
    }
  }

  // ---------------- SUBMIT NOTICE ----------------
  Future<void> publishNotice() async {
    final appState = context.read<AppState>();

    if (titleCtrl.text.isEmpty || descCtrl.text.isEmpty || pdfFile == null) {
      setState(() {
        alertMessage = 'Please fill all fields and upload a file.';
        alert = true;
      });
      return;
    }

    setState(() => loading = true);

    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('${appState.localhost}/api/warden/uploadnotice'),
      );

      request.headers['Cookie'] = appState.cookie;

      request.fields['title'] = titleCtrl.text;
      request.fields['description'] = descCtrl.text;

      request.files.add(
        await http.MultipartFile.fromPath(
          'file',
          pdfFile!.path,
          filename: pdfFile!.path.split('/').last,
          contentType: MediaType('application', 'pdf'),
        ),
      );

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode != 200) {
        final err = jsonDecode(response.body);
        throw err['message'] ?? 'Upload failed';
      }

      setState(() {
        successMessage = 'Notice published successfully.';
        success = true;
        titleCtrl.clear();
        descCtrl.clear();
        pdfFile = null;
      });

      // Navigate back to notices
      Navigator.pushReplacementNamed(context, 'Notices');
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Publish Notice'),
      body: Stack(
        children: [
          if (loading)
            const Center(
              child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
            )
          else
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Publish Notice',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xff2cb5a0),
                    ),
                  ),
                  const SizedBox(height: 20),

                  TextField(
                    controller: titleCtrl,
                    decoration: InputDecoration(
                      hintText: 'Title',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                  const SizedBox(height: 15),

                  TextField(
                    controller: descCtrl,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: 'Description',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff2cb5a0),
                      minimumSize: const Size(double.infinity, 50),
                    ),
                    onPressed: pickFile,
                    child: Text(
                      pdfFile != null
                          ? pdfFile!.path.split('/').last
                          : 'Pick File',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),

                  const SizedBox(height: 15),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff2cb5a0),
                      minimumSize: const Size(double.infinity, 50),
                    ),
                    onPressed: publishNotice,
                    child: const Text(
                      'PUBLISH NOTICE',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
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
    );
  }
}
