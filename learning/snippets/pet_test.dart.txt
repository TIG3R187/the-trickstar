import 'package:flutter_test/flutter_test.dart';
import 'package:pocket_pal/models/pet.dart';

void main() {
  test('feeding near zero clamps hunger', () {
    const pet = Pet(name: 'Sprout', style: 'mint', hunger: 10);
    expect(pet.feed().hunger, 0);
  });
  test('hungry has priority over tired', () {
    const pet = Pet(name: 'Sprout', style: 'mint', hunger: 80, energy: 10);
    expect(pet.mood, 'hungry');
  });
  test('saving and restoring preserves sleep state', () {
    const pet = Pet(name: 'Sprout', style: 'mango', isSleeping: true);
    final restored = Pet.fromJson(pet.toJson());
    expect(restored.style, 'mango');
    expect(restored.isSleeping, isTrue);
  });
  test('invalid saved numbers are rejected', () {
    final json = const Pet(name: 'Sprout', style: 'mint').toJson();
    json['energy'] = 999;
    expect(() => Pet.fromJson(json), throwsFormatException);
  });
}
