import 'package:flutter/material.dart';

void main() => runApp(const PocketPalApp());

class PocketPalApp extends StatelessWidget {
  const PocketPalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Pocket Pal',
      theme: ThemeData(colorSchemeSeed: Colors.green),
      home: const Scaffold(
        body: Center(child: Text('Hello Quadri. Let’s build Pocket Pal!')),
      ),
    );
  }
}
