import 'package:flutter/material.dart';
import '../../Components/nav.dart';
import '../../Components/minicard.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';
import '../Warden/warden.dart';

class WardenDashboard extends StatefulWidget {
  const WardenDashboard({super.key});

  @override
  State<WardenDashboard> createState() => _WardenDashboardState();
}

class _WardenDashboardState extends State<WardenDashboard> {
  bool alert = false;
  String alertMessage = '';

  bool success = false;
  String successMessage = '';

  void navigateTo(String route) {
    Navigator.pushNamed(context, route);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Nav(title: 'Warden Dashboard', showBack: false),
      backgroundColor: const Color(0xfff8f9fa),
      body: Stack(
        children: [
          /// 🔥 GRID DASHBOARD (NO LAYOUT ISSUES)
          GridView.count(
            padding: const EdgeInsets.all(16),
            crossAxisCount: 2,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            childAspectRatio: 1,
            children: [
              MiniCard(
                title: 'Add Hosteller',
                icon: Icons.person_add,
                onTap: () => navigateTo('/add-hosteller'),
              ),
              MiniCard(
                title: 'View Hostellers',
                icon: Icons.people,
                onTap: () => navigateTo('/hostellers'),
              ),
              MiniCard(
                title: 'Profile',
                icon: Icons.person,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const Warden()),
                  );
                },
              ),
              MiniCard(
                title: 'Mark Attendance',
                icon: Icons.check_box,
                onTap: () => navigateTo('/mark-attendance'),
              ),
              MiniCard(
                title: 'Attendance',
                icon: Icons.assignment,
                onTap: () => navigateTo('/attendance'),
              ),
              MiniCard(
                title: 'Leaves',
                icon: Icons.calendar_month,
                onTap: () => navigateTo('/leaves'),
              ),
              MiniCard(
                title: 'Public Grievances',
                icon: Icons.help,
                onTap: () => navigateTo('/public-grievances'),
              ),
              MiniCard(
                title: 'Private Grievances',
                icon: Icons.lock,
                onTap: () => navigateTo('/private-grievances'),
              ),
              MiniCard(
                title: 'View Notices',
                icon: Icons.description,
                onTap: () => navigateTo('/notices'),
              ),
              MiniCard(
                title: 'Mess Menu',
                icon: Icons.restaurant,
                onTap: () => navigateTo('/mess-menu'),
              ),
              MiniCard(
                title: 'Outdoor Register',
                icon: Icons.assignment_outlined,
                onTap: () => navigateTo('/out-register'),
              ),
              MiniCard(
                title: 'Publish Notice',
                icon: Icons.campaign,
                onTap: () => navigateTo('/publish-notice'),
              ),
            ],
          ),

          /// 🔔 ERROR ALERT
          ErrorAlert(
            message: alertMessage,
            alert: alert,
            onClose: () => setState(() => alert = false),
          ),

          /// ✅ SUCCESS ALERT
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
