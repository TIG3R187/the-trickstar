import 'package:flutter/material.dart';
import '../models/pet.dart';
import 'adoption_screen.dart';

class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  Pet? _pet;

  Future<void> _adopt(String name, String style) async {
    setState(() => _pet = Pet(name: name, style: style));
    // Mission 06: start the clock after adoption.
    // Mission 07: save first, handle errors, then show the new pet.
  }

  @override
  Widget build(BuildContext context) {
    if (_pet == null) return AdoptionScreen(onAdopt: _adopt);
    final pet = _pet!;
    return Scaffold(
      appBar: AppBar(title: Text(pet.name)),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Style: ${pet.style}'),
            Text('Mood: ${pet.mood}'),
            Text('Hunger: ${pet.hunger}'),
            Text('Happiness: ${pet.happiness}'),
            Text('Energy: ${pet.energy}'),
            // Mission 05: add the care controls here.
            // Mission 08: replace repeated stat text with PetStat.
          ],
        ),
      ),
    );
  }
}
