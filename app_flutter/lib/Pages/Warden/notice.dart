import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/notice_card.dart';

class Notices extends StatefulWidget {
  const Notices({super.key});

  @override
  State<Notices> createState() => _NoticesState();
}

class _NoticesState extends State<Notices> {
  bool loading = true;
  bool refreshing = false;
  String? error;

  List<dynamic> notices = [];

  // ---------------- FETCH NOTICES ----------------
  Future<void> fetchNotices({bool isRefresh = false}) async {
    final appState = context.read<AppState>();

    if (!isRefresh) {
      setState(() {
        loading = true;
        error = null;
      });
    }

    try {
      final response = await http.get(
        Uri.parse('${appState.localhost}/api/warden/getnotices'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode != 200) {
        throw data['message'] ?? 'Unable to fetch notices';
      }

      setState(() {
        notices = data['notices'] ?? [];
      });
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        loading = false;
        refreshing = false;
      });
    }
  }

  // ---------------- REFRESH ----------------
  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchNotices(isRefresh: true);
  }

  @override
  void initState() {
    super.initState();
    fetchNotices();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Notices'),
      body: loading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
            )
          : error != null
          ? Center(
              child: Text(
                error!,
                style: const TextStyle(color: Colors.red, fontSize: 16),
                textAlign: TextAlign.center,
              ),
            )
          : notices.isEmpty
          ? const Center(
              child: Text(
                'No notices found.',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            )
          : RefreshIndicator(
              onRefresh: onRefresh,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: notices.length,
                itemBuilder: (context, index) {
                  return NoticeCard(data: notices[index]);
                },
              ),
            ),
    );
  }
}
