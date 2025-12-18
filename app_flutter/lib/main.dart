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
  static const Color primaryColor = Color(0xff2cb5a0);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,

      title: 'Hostel ERP',

      /// 🌈 GLOBAL THEME
      theme: ThemeData(
        useMaterial3: true,

        colorScheme: ColorScheme.fromSeed(
          seedColor: primaryColor,
          primary: primaryColor,
        ),

        scaffoldBackgroundColor: const Color(0xfff5f5f5),

        appBarTheme: const AppBarTheme(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          centerTitle: true,
          elevation: 2,
        ),

        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: primaryColor,
            foregroundColor: Colors.white,
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ),

        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: primaryColor, width: 2),
          ),
        ),

        progressIndicatorTheme: const ProgressIndicatorThemeData(
          color: primaryColor,
        ),
      ),
      home: Splash(),
    );
  }
}
