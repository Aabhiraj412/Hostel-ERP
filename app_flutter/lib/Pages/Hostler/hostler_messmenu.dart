import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:photo_manager/photo_manager.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';

class HostlerMessMenu extends StatefulWidget {
  const HostlerMessMenu({super.key});

  @override
  State<HostlerMessMenu> createState() => _MessMenuState();
}

class _MessMenuState extends State<HostlerMessMenu> {
  bool loading = true;
  bool refreshing = false;

  bool alert = false;
  String alertMessage = '';

  bool success = false;
  String successMessage = '';

  File? imageFile;

  // ---------------- FETCH MENU ----------------
  Future<void> fetchMessMenu() async {
    final appState = context.read<AppState>();

    try {
      setState(() => loading = true);

      final res = await http.get(
        Uri.parse('${appState.localhost}/api/hostler/getmessmenu'),
        headers: {'Cookie': appState.cookie},
      );

      if (res.statusCode != 200) {
        throw 'Failed to load mess menu';
      }

      final dir = await getTemporaryDirectory();
      final file = File('${dir.path}/mess_menu.png');
      await file.writeAsBytes(res.bodyBytes);

      setState(() => imageFile = file);
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- DOWNLOAD MENU ----------------
  Future<void> downloadMenu() async {
    if (imageFile == null) {
      setState(() {
        alertMessage = 'No menu available to download';
        alert = true;
      });
      return;
    }

    try {
      final permission = await PhotoManager.requestPermissionExtend();
      if (!permission.isAuth) {
        throw 'Storage permission denied';
      }

      await PhotoManager.editor.saveImageWithPath(
        imageFile!.path,
        title: 'Mess_Menu',
      );

      setState(() {
        successMessage = 'Mess menu saved to gallery';
        success = true;
      });
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    }
  }

  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchMessMenu();
    setState(() => refreshing = false);
  }

  @override
  void initState() {
    super.initState();
    fetchMessMenu();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Mess Menu'),
      body: Stack(
        children: [
          if (loading)
            const Center(
              child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
            )
          else
            RefreshIndicator(
              onRefresh: onRefresh,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: Column(
                  children: [
                    const SizedBox(height: 20),

                    if (imageFile != null)
                      Container(
                        margin: const EdgeInsets.all(16),
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xff2cb5a0), width: 3),
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black12,
                              blurRadius: 6,
                            )
                          ],
                        ),
                        child: Image.file(
                          imageFile!,
                          fit: BoxFit.contain,
                        ),
                      )
                    else
                      const Padding(
                        padding: EdgeInsets.only(top: 80),
                        child: Text(
                          'No menu available',
                          style: TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                      ),

                    const SizedBox(height: 20),

                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xff2cb5a0),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 30,
                          vertical: 12,
                        ),
                      ),
                      onPressed: downloadMenu,
                      child: const Text(
                        'Download Menu',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),

          /// ERROR ALERT
          ErrorAlert(
            message: alertMessage,
            alert: alert,
            onClose: () => setState(() => alert = false),
          ),

          /// SUCCESS ALERT
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
