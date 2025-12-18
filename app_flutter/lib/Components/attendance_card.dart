import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AttendanceCard extends StatefulWidget {
  final Map<String, dynamic> data;
  final List<String> present;
  final Function(String id) onToggle;

  const AttendanceCard({
    super.key,
    required this.data,
    required this.present,
    required this.onToggle,
  });

  @override
  State<AttendanceCard> createState() => _AttendanceCardState();
}

class _AttendanceCardState extends State<AttendanceCard> {
  bool isSelected = false;

  @override
  void initState() {
    super.initState();
    _checkInitialSelection();
  }

  void _checkInitialSelection() {
    final String id = widget.data['_id'];

    // 1️⃣ If already in present list
    if (widget.present.contains(id)) {
      isSelected = true;
      return;
    }

    // 2️⃣ If present today (Asia/Kolkata)
    final today = DateFormat('yyyy-MM-dd')
        .format(DateTime.now().toUtc().add(const Duration(hours: 5, minutes: 30)));

    final List<dynamic> presentOn = widget.data['present_on'] ?? [];

    for (final date in presentOn) {
      if (date.toString().split('T')[0] == today) {
        isSelected = true;
        break;
      }
    }
  }

  void _handleTap() {
    setState(() => isSelected = !isSelected);
    widget.onToggle(widget.data['_id']);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 10),
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xff2cb5a0) : Colors.white,
          borderRadius: BorderRadius.circular(10),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 5,
              offset: Offset(0, 3),
            ),
          ],
          border: const Border(
            left: BorderSide(
              color: Color(0xff2cb5a0),
              width: 5,
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.data['name'] ?? '',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : const Color(0xff2cb5a0),
              ),
            ),
            const SizedBox(height: 5),
            Text(
              'Room: ${widget.data['room_no'] ?? ''}',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : const Color(0xff2cb5a0),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
