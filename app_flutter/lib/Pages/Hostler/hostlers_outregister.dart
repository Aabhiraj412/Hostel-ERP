import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';

class HostlerOutRegister extends StatefulWidget {
  const HostlerOutRegister({super.key});

  @override
  State<HostlerOutRegister> createState() => _HostlerOutRegisterState();
}

class _HostlerOutRegisterState extends State<HostlerOutRegister> {
  List<dynamic> entries = [];
  bool loading = true;
  bool refreshing = false;

  bool opening = false;
  bool closing = false;

  bool showOpenModal = false;
  dynamic selectedEntry;

  final TextEditingController purposeCtrl = TextEditingController();

  bool alert = false;
  String alertMessage = '';

  bool success = false;
  String successMessage = '';

  // ---------------- FETCH ENTRIES ----------------
  Future<void> fetchEntries() async {
    final appState = context.read<AppState>();

    try {
      final res = await http.get(
        Uri.parse('${appState.localhost}/api/hostler/getentry'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(res.body);
      setState(() => entries = data);
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- OPEN ENTRY ----------------
  Future<void> openEntry() async {
    if (purposeCtrl.text.trim().isEmpty) {
      setState(() {
        alertMessage = 'Please provide a purpose.';
        alert = true;
      });
      return;
    }

    final appState = context.read<AppState>();
    setState(() => opening = true);

    try {
      final res = await http.post(
        Uri.parse('${appState.localhost}/api/hostler/openentry'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
        body: jsonEncode({'purpose': purposeCtrl.text.trim()}),
      );

      final data = jsonDecode(res.body);
      if (res.statusCode != 200) {
        throw data['message'] ?? 'Failed to open entry';
      }

      setState(() {
        entries.insert(0, data);
        successMessage = 'Entry opened successfully.';
        success = true;
        showOpenModal = false;
        purposeCtrl.clear();
      });
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => opening = false);
    }
  }

  // ---------------- CLOSE ENTRY ----------------
  Future<void> closeEntry() async {
    final appState = context.read<AppState>();
    setState(() => closing = true);

    try {
      final res = await http.get(
        Uri.parse('${appState.localhost}/api/hostler/closeentry'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': appState.cookie,
        },
      );

      final data = jsonDecode(res.body);
      if (res.statusCode != 200) {
        throw data['message'] ?? 'Failed to close entry';
      }

      setState(() {
        selectedEntry = null;
      });

      fetchEntries();
    } catch (e) {
      setState(() {
        alertMessage = e.toString();
        alert = true;
      });
    } finally {
      setState(() => closing = false);
    }
  }

  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchEntries();
    setState(() => refreshing = false);
  }

  @override
  void initState() {
    super.initState();
    fetchEntries();
  }

  @override
  void dispose() {
    purposeCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Out Register'),
      body: Stack(
        children: [
          loading
              ? const Center(
                  child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
                )
              : RefreshIndicator(
                  onRefresh: onRefresh,
                  child: entries.isEmpty
                      ? const Center(
                          child: Text(
                            'No entries found',
                            style: TextStyle(color: Colors.grey),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(10),
                          itemCount: entries.length,
                          itemBuilder: (_, i) {
                            final e = entries[i];
                            return GestureDetector(
                              onTap: () {
                                if (e['in_time'] == null) {
                                  setState(() => selectedEntry = e);
                                }
                              },
                              child: _entryCard(e),
                            );
                          },
                        ),
                ),

          /// FLOATING BUTTON
          Positioned(
            bottom: 20,
            right: 20,
            child: FloatingActionButton.extended(
              backgroundColor: const Color(0xff2cb5a0),
              onPressed: () => setState(() => showOpenModal = true),
              label: const Text(
                'Going Out',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),

          /// ALERTS
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

          if (showOpenModal) _openEntryModal(),
          if (selectedEntry != null) _closeEntryModal(),
        ],
      ),
    );
  }

  // ---------------- ENTRY CARD ----------------
  Widget _entryCard(dynamic e) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      elevation: 5,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Purpose: ${e['purpose']}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xff2cb5a0),
              ),
            ),
            const SizedBox(height: 5),
            Text('Out Time: ${DateTime.parse(e['out_time']).toLocal()}'),
            Text(
              e['in_time'] == null
                  ? 'In Time: Not Returned'
                  : 'In Time: ${DateTime.parse(e['in_time']).toLocal()}',
              style: TextStyle(
                color: e['in_time'] == null ? Colors.red : Colors.black,
                fontWeight: e['in_time'] == null
                    ? FontWeight.bold
                    : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------- OPEN MODAL ----------------
  Widget _openEntryModal() {
    return _modal(
      title: 'Open New Entry',
      child: Column(
        children: [
          TextField(
            controller: purposeCtrl,
            decoration: const InputDecoration(
              labelText: 'Purpose',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 20),
          opening
              ? const CircularProgressIndicator(color: Color(0xff2cb5a0))
              : ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xff2cb5a0),
                    minimumSize: const Size(double.infinity, 45),
                  ),
                  onPressed: openEntry,
                  child: const Text(
                    'Submit',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
        ],
      ),
      onClose: () => setState(() => showOpenModal = false),
    );
  }

  // ---------------- CLOSE MODAL ----------------
  Widget _closeEntryModal() {
    return _modal(
      title: 'Close Entry',
      child: Column(
        children: [
          Text(
            'Close entry for "${selectedEntry['purpose']}"?',
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          closing
              ? const CircularProgressIndicator(color: Color(0xff2cb5a0))
              : ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xff2cb5a0),
                    minimumSize: const Size(double.infinity, 45),
                  ),
                  onPressed: closeEntry,
                  child: const Text(
                    'Confirm',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
        ],
      ),
      onClose: () => setState(() => selectedEntry = null),
    );
  }

  // ---------------- COMMON MODAL ----------------
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
                borderRadius: BorderRadius.circular(12),
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
                  const SizedBox(height: 20),
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
