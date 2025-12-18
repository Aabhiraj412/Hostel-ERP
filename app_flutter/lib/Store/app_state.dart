import 'package:flutter/material.dart';

class AppState extends ChangeNotifier {
  String cookie = '';
  String user = '';
  dynamic data;
  String? localhost;
  String? testlocalhost;

  void setCookie(String c) {
    cookie = c;
    notifyListeners();
  }

  void setUser(String u) {
    user = u;
    notifyListeners();
  }

  void setData(dynamic d) {
    data = d;
    notifyListeners();
  }

  void setLocalhost(String h) {
    localhost = h;
    notifyListeners();
  }

  void setTestLocalhost(String t) {
    testlocalhost = t;
    notifyListeners();
  }

  bool get isLoggedIn => cookie.isNotEmpty;
}
