import 'package:app_flutter/Pages/Warden/add_hostler.dart';
import 'package:app_flutter/Pages/Warden/hostler_details.dart';
import 'package:app_flutter/Pages/Warden/leaves.dart';
import 'package:app_flutter/Pages/Warden/mark_attendance.dart';
import 'package:app_flutter/Pages/Warden/mess_menu.dart';
import 'package:app_flutter/Pages/Warden/notice.dart';
import 'package:app_flutter/Pages/Warden/out_register.dart';
import 'package:app_flutter/Pages/Warden/private_grevances.dart';
import 'package:app_flutter/Pages/Warden/public_grevances.dart';
import 'package:app_flutter/Pages/Warden/publish_notice.dart';
import 'package:app_flutter/Pages/Warden/view_attendance.dart';
import 'package:app_flutter/Pages/Warden/view_hostler.dart';
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
                // onTap: () => navigateTo('/add-hosteller'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const AddHostler()),
                  );
                },
              ),
              MiniCard(
                title: 'View Hostellers',
                icon: Icons.people,
                // onTap: () => navigateTo('/hostellers'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ViewHostlers()),
                  );
                },
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
                // onTap: () => navigateTo('/mark-attendance'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const MarkAttendance()),
                  );
                },
              ),
              MiniCard(
                title: 'Attendance',
                icon: Icons.assignment,
                // onTap: () => navigateTo('/attendance'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ViewAttendance()),
                  );
                },
              ),
              MiniCard(
                title: 'Leaves',
                icon: Icons.calendar_month,
                // onTap: () => navigateTo('/leaves'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const Leaves()),
                  );
                },
              ),
              MiniCard(
                title: 'Public Grievances',
                icon: Icons.help,
                // onTap: () => navigateTo('/public-grievances'),
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const PublicGrievances()),
                ),
              ),
              MiniCard(
                title: 'Private Grievances',
                icon: Icons.lock,
                // onTap: () => navigateTo('/private-grievances'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const PrivateGrievances(),
                    ),
                  );
                },
              ),
              MiniCard(
                title: 'View Notices',
                icon: Icons.description,
                // onTap: () => navigateTo('/notices'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const Notices()),
                  );
                },
              ),
              MiniCard(
                title: 'Mess Menu',
                icon: Icons.restaurant,
                // onTap: () => navigateTo('/mess-menu'),
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const MessMenu()),
                ),
              ),
              MiniCard(
                title: 'Outdoor Register',
                icon: Icons.assignment_outlined,
                // onTap: () => navigateTo('/out-register'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const OutdoorRegister()),
                  );
                },
              ),
              MiniCard(
                title: 'Publish Notice',
                icon: Icons.campaign,
                // onTap: () => navigateTo('/publish-notice'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const PublishNotice()),
                  );
                },
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
