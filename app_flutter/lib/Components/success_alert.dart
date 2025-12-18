import 'package:flutter/material.dart';

class SuccessAlert extends StatelessWidget {
  final String message;
  final bool success;
  final VoidCallback onClose;

  const SuccessAlert({
    super.key,
    required this.message,
    required this.success,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    if (!success) return const SizedBox.shrink();

    return GestureDetector(
      onTap: onClose,
      child: Container(
        color: Colors.black54,
        child: Center(
          child: Container(
            width: 300,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Success',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xff2cb5a0),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  message,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
