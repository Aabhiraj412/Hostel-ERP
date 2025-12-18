import 'package:app_flutter/Pages/splash.dart';
import 'package:app_flutter/Store/app_state.dart';
import 'package:flutter/material.dart';

import 'package:provider/provider.dart';

void main() {
  runApp(
    // const MyApp()
    ChangeNotifierProvider(
      create: (_) =>
          AppState()..setLocalhost('https://hostel-erp-9w6h.onrender.com'),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // final appState = context.read<AppState>();

  // AppState.setlocalhost("https://hostel-erp-9w6h.onrender.com")
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(debugShowCheckedModeBanner: false, home: Splash());
  }
}
