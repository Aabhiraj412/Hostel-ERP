import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/notice_card.dart';

class HostlerNotices extends StatefulWidget {
  const HostlerNotices({super.key});

  @override
  State<HostlerNotices> createState() => _HostlerNoticesState();
}

class _HostlerNoticesState extends State<HostlerNotices> {
  bool loading = false;
  bool refreshing = false;
  String? error;

  List<dynamic> notices = [];

  // ---------------- FETCH NOTICES ----------------
  Future<void> fetchNotices() async {
    final appState = context.read<AppState>();

    setState(() {
      loading = true;
      error = null;
    });

    try {
      final res = await http.get(
        Uri.parse('${appState.localhost}/api/hostler/getnotices'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw data['message'] ?? 'Unable to fetch notices';
      }

      setState(() {
        notices = data['notices'] ?? [];
      });
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchNotices();
    setState(() => refreshing = false);
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
      backgroundColor: const Color(0xfff5f5f5),
      body: loading && !refreshing
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
                        'No notices found',
                        style: TextStyle(color: Colors.grey, fontSize: 16),
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
