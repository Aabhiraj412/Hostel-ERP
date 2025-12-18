import 'package:app_flutter/Pages/Warden/hostler_details.dart';
import 'package:flutter/material.dart';

class HostlersCard extends StatelessWidget {
  final Map<String, dynamic> data;

  const HostlersCard({super.key, required this.data});

  void _onPress(BuildContext context) {
    // Navigator.pushNamed(
    //   context,
    //   'Hosteller Details',
    //   arguments: {'hostler': data},
    // );
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => HostlerDetails(hostler: data)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _onPress(context),
      child: Container(
        width: MediaQuery.of(context).size.width * 0.88,
        margin: const EdgeInsets.all(10),
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: const Color(0xff2cb5a0),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xff7cdacc), width: 3),
          boxShadow: const [
            BoxShadow(
              color: Color(0xffcfd4de),
              blurRadius: 6,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Name: ${data['name']}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 5),

            Text(
              'Room No: ${data['room_no']}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w500,
                fontSize: 14,
              ),
            ),

            Text(
              'Hostel: ${data['hostel']}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w500,
                fontSize: 14,
              ),
            ),

            Text(
              'College: ${data['college']}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w500,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
