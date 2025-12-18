import 'package:flutter/material.dart';

class Nav extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final bool showBack;

  const Nav({super.key, required this.title, this.showBack = true});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      elevation: 6,
      centerTitle: true,
      backgroundColor: const Color(0xff2cb5a0),
      leading: showBack
          ? IconButton(
              icon: const Icon(Icons.arrow_back_ios),
              onPressed: () => Navigator.pop(context),
            )
          : null,
      title: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1),
      ),
      flexibleSpace: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xff2cb5a0), Color(0xff1e9f8b)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
