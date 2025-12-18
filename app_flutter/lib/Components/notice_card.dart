import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../Store/app_state.dart';

class NoticeCard extends StatelessWidget {
  final Map<String, dynamic> data;

  const NoticeCard({super.key, required this.data});

  Future<void> _downloadNotice(BuildContext context) async {
    final appState = context.read<AppState>();
    final url =
        '${appState.localhost}/api/warden/getnotice/${data['_id']}';

    final uri = Uri.parse(url);

    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      throw 'Could not open notice';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xff2cb5a0),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xff7cdacc), width: 4),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 6,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            'Title: ${data['title']}',
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),

          Text(
            'Description: ${data['description']}',
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 10),

          Text(
            'Published On: ${DateTime.parse(data['createdAt']).toLocal().toString().split(' ')[0]}',
            style: const TextStyle(
              color: Color(0xffe6f7f4),
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 20),

          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xff145b59),
              padding: const EdgeInsets.symmetric(
                horizontal: 24,
                vertical: 12,
              ),
            ),
            onPressed: () => _downloadNotice(context),
            child: const Text(
              'Download Notice',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
