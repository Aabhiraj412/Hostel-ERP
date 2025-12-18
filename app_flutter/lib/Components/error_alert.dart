import 'package:flutter/material.dart';

class ErrorAlert extends StatelessWidget {
  final String message;
  final bool alert;
  final VoidCallback onClose;

  const ErrorAlert({
    super.key,
    required this.message,
    required this.alert,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    if (!alert) return const SizedBox.shrink();

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
                  'Error',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xffe74c3c),
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
