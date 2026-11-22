import 'package:flutter/material.dart';

class PetStat extends StatelessWidget {
  const PetStat({super.key, required this.label, required this.value});
  final String label;
  final int value;

  @override
  Widget build(BuildContext context) {
    final bounded = value.clamp(0, 100).toInt();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('$label: $bounded/100'),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: bounded / 100,
            semanticsLabel: label,
            semanticsValue: bounded.toString(),
          ),
        ],
      ),
    );
  }
}
