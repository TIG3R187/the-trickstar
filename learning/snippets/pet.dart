class Pet {
  const Pet({
    required this.name,
    required this.style,
    this.hunger = 30,
    this.happiness = 70,
    this.energy = 70,
    this.isSleeping = false,
  });

  final String name;
  final String style;
  final int hunger;
  final int happiness;
  final int energy;
  final bool isSleeping;

  static int clampStat(int value) => value.clamp(0, 100).toInt();

  Pet copyWith({int? hunger, int? happiness, int? energy, bool? isSleeping}) {
    return Pet(
      name: name,
      style: style,
      hunger: clampStat(hunger ?? this.hunger),
      happiness: clampStat(happiness ?? this.happiness),
      energy: clampStat(energy ?? this.energy),
      isSleeping: isSleeping ?? this.isSleeping,
    );
  }

  Pet feed() => isSleeping ? this : copyWith(hunger: hunger - 20);

  String get mood {
    if (isSleeping) return 'sleeping';
    if (hunger >= 70) return 'hungry';
    if (energy <= 20) return 'tired';
    if (happiness <= 30) return 'sad';
    return 'happy';
  }

  Map<String, Object> toJson() => {
    'version': 1,
    'name': name,
    'style': style,
    'hunger': hunger,
    'happiness': happiness,
    'energy': energy,
    'isSleeping': isSleeping,
  };

  factory Pet.fromJson(Map<String, dynamic> json) {
    final name = json['name'];
    final style = json['style'];
    final sleeping = json['isSleeping'];
    if (json['version'] != 1 ||
        name is! String ||
        name.trim() != name || name.length < 2 || name.length > 16 ||
        (style != 'mint' && style != 'mango') || sleeping is! bool) {
      throw const FormatException('Invalid or unsupported pet save.');
    }
    int readStat(String key) {
      final value = json[key];
      if (value is! int || value < 0 || value > 100) {
        throw FormatException('Invalid stat: $key');
      }
      return value;
    }
    return Pet(
      name: name,
      style: style as String,
      hunger: readStat('hunger'),
      happiness: readStat('happiness'),
      energy: readStat('energy'),
      isSleeping: sleeping,
    );
  }
}
