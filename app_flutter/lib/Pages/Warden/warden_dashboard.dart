import 'package:flutter/material.dart';

import '../../Components/nav.dart';
import '../../Components/minicard.dart';
import '../../Components/error_alert.dart';
import '../../Components/success_alert.dart';

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
      appBar: const Nav(
        title: 'Warden Dashboard',
        showBack: false,
      ),
      backgroundColor: const Color(0xfff8f9fa),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: Stack(
          children: [
            SingleChildScrollView(
              padding: const EdgeInsets.all(10),
              child: Column(
                children: [
                  _row(
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
                  ),
                  _row(
                    MiniCard(
                      title: 'Profile',
                      icon: Icons.person,
                      onTap: () => navigateTo('/warden-profile'),
                    ),
                    MiniCard(
                      title: 'Mark Attendance',
                      icon: Icons.check_box,
                      onTap: () => navigateTo('/mark-attendance'),
                    ),
                  ),
                  _row(
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
                  ),
                  _row(
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
                  ),
                  _row(
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
                  ),
                  _row(
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
                  ),
                ],
              ),
            ),

            /// Alerts
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
          ],
        ),
      ),
    );
  }

  Widget _row(Widget left, Widget right) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [left, right],
    );
  }
}
