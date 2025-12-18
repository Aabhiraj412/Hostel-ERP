import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../Store/app_state.dart';
import '../../Components/nav.dart';
import '../../Components/hostlers_card.dart';

class ViewHostlers extends StatefulWidget {
  const ViewHostlers({super.key});

  @override
  State<ViewHostlers> createState() => _ViewHostlersState();
}

class _ViewHostlersState extends State<ViewHostlers> {
  List<dynamic> hostlers = [];
  String? selectedHostel;
  String searchQuery = '';

  bool loading = true;
  bool refreshing = false;
  String? error;

  // ---------------- FETCH HOSTLERS ----------------
  Future<void> fetchHostlers() async {
    final appState = context.read<AppState>();

    try {
      setState(() {
        loading = true;
        error = null;
      });

      final res = await http.get(
        Uri.parse('${appState.localhost}/api/warden/gethostlers'),
        headers: {'Cookie': appState.cookie},
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw data['message'] ?? 'Failed to fetch hostlers';
      }

      setState(() {
        hostlers = data;
      });
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => loading = false);
    }
  }

  // ---------------- REFRESH ----------------
  Future<void> onRefresh() async {
    setState(() => refreshing = true);
    await fetchHostlers();
    setState(() => refreshing = false);
  }

  @override
  void initState() {
    super.initState();
    fetchHostlers();
  }

  @override
  Widget build(BuildContext context) {
    /// HOSTEL OPTIONS
    final hostelOptions = <String?>[
      null,
      ...{
        for (var h in hostlers) h['hostel']
      }
    ];

    /// FILTER BY HOSTEL
    final filteredHostlers = hostlers.where((h) {
      return selectedHostel == null || h['hostel'] == selectedHostel;
    }).toList();

    /// SEARCH FILTER
    final searchedHostlers = filteredHostlers.where((h) {
      final name = h['name'].toString().toLowerCase();
      final room = h['room_no'].toString();
      final query = searchQuery.toLowerCase();

      return name.contains(query) || room.contains(query);
    }).toList();

    return Scaffold(
      appBar: const Nav(title: 'Hostlers'),
      body: loading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xff2cb5a0)),
            )
          : error != null
              ? Center(
                  child: Text(
                    'Error: $error',
                    style: const TextStyle(color: Colors.red),
                  ),
                )
              : RefreshIndicator(
                  onRefresh: onRefresh,
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      /// HOSTEL DROPDOWN
                      DropdownButtonFormField<String?>(
                        value: selectedHostel,
                        decoration: const InputDecoration(
                          labelText: 'Select Hostel',
                          border: OutlineInputBorder(),
                        ),
                        items: hostelOptions.map((hostel) {
                          return DropdownMenuItem<String?>(
                            value: hostel,
                            child: Text(hostel ?? 'All Hostels'),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() => selectedHostel = value);
                        },
                      ),

                      const SizedBox(height: 12),

                      /// SEARCH INPUT
                      TextField(
                        decoration: const InputDecoration(
                          hintText: 'Search by name or room number',
                          border: OutlineInputBorder(),
                          prefixIcon: Icon(Icons.search),
                        ),
                        onChanged: (val) {
                          setState(() => searchQuery = val);
                        },
                      ),

                      const SizedBox(height: 16),

                      /// HOSTLERS LIST
                      if (searchedHostlers.isEmpty)
                        const Padding(
                          padding: EdgeInsets.only(top: 40),
                          child: Center(
                            child: Text(
                              'No hostellers found for the selected criteria.',
                              style: TextStyle(color: Colors.grey),
                            ),
                          ),
                        )
                      else
                        ...searchedHostlers.map(
                          (hostler) => HostlersCard(data: hostler),
                        ),
                    ],
                  ),
                ),
    );
  }
}
