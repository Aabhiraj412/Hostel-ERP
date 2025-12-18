import 'package:flutter/material.dart';

class MiniCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;

  const MiniCard({
    super.key,
    required this.title,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 150,
        padding: const EdgeInsets.all(20),
        margin: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: const Color(0xff2cb5a0),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: const Color(0xff7cdacc),
            width: 4,
          ),
          boxShadow: const [
            BoxShadow(
              color: Color(0xffcfd4de),
              offset: Offset(0, 6),
              blurRadius: 8,
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(
                  color: const Color(0xff7cdacc),
                  width: 4,
                ),
              ),
              child: Icon(
                icon,
                size: 40,
                color: const Color(0xff2cb5a0),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
