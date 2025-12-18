import 'package:app_flutter/Components/nav.dart';
import 'package:app_flutter/Pages/Hostler/hostler.dart';
import 'package:app_flutter/Pages/Hostler/hostler_login.dart';
import 'package:app_flutter/Pages/Warden/warden_dashboard.dart';
import 'package:app_flutter/Pages/Warden/warden_login.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../Store/app_state.dart';
import '../Components/card_item.dart';

class Landing extends StatelessWidget {
  const Landing({super.key});

  void navigateToWarden(BuildContext context) {
    final appState = context.read<AppState>();

    if (appState.isLoggedIn && appState.user == 'Warden') {
      // Navigator.pushReplacementNamed(context, '/warden-dashboard');
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const WardenDashboard()),
      );
    } else {
      // Navigator.pushNamed(context, '/warden-login');
      // Navigator.pushReplacementNamed(context, MaterialPageRoute(builder: (context) => const WardenLogin()));
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const WardenLogin()),
      );
    }
  }

  void navigateToHosteller(BuildContext context) {
    final appState = context.read<AppState>();

    if (appState.isLoggedIn && appState.user == 'Hosteller') {
      // Navigator.pushReplacementNamed(context, '/home-dashboard');
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const Hostler()),
      );
    } else {
      // Navigator.pushNamed(context, '/hosteller-login');
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const HostlerLogin()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: Nav(title: 'Hostel ERP', showBack: false),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color.fromARGB(255, 11, 11, 11),
              Color.fromARGB(255, 26, 27, 28),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              children: [
                const Text(
                  'Welcome !!',
                  style: TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                    color: Color(0xff2cd5a0),
                    shadows: [
                      Shadow(
                        offset: Offset(2, 2),
                        blurRadius: 5,
                        color: Colors.black26,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),

                CardItem(
                  title: 'Warden',
                  icon: Icons.security,
                  onTap: () => navigateToWarden(context),
                ),

                CardItem(
                  title: 'Hosteller',
                  icon: Icons.group,
                  onTap: () => navigateToHosteller(context),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
