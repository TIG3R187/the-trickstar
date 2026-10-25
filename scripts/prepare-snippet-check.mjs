import fs from 'node:fs/promises';
import path from 'node:path';
// Validation harness only. Quadri's app/ remains his own project to build.
const root = path.resolve('artifacts/snippet-check');
const files = {
  'first_screen.dart': 'lib/main.dart',
  'pet.dart': 'lib/models/pet.dart',
  'adoption_screen.dart': 'lib/screens/adoption_screen.dart',
  'game_screen.dart': 'lib/screens/game_screen.dart',
  'pet_storage.dart': 'lib/services/pet_storage.dart',
  'visible_pet_clock.dart': 'lib/services/visible_pet_clock.dart',
  'pet_stat.dart': 'lib/widgets/pet_stat.dart',
  'pet_test.dart': 'test/pet_test.dart'
};
for (const [source, destination] of Object.entries(files)) {
  const target = path.join(root, destination);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const example = await fs.readFile(path.join('learning/snippets', source), 'utf8');
  await fs.writeFile(target, example.replaceAll('package:pocket_pal/', 'package:pocket_pal_snippet_check/'));
}
await fs.writeFile(path.join(root, 'test/widget_test.dart'), `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pocket_pal_snippet_check/screens/adoption_screen.dart';
import 'package:pocket_pal_snippet_check/widgets/pet_stat.dart';

void main() {
  testWidgets('invalid adoption can be corrected and submitted with a style', (tester) async {
    String? adoptedName;
    String? adoptedStyle;
    await tester.pumpWidget(MaterialApp(home: AdoptionScreen(onAdopt: (name, style) async {
      adoptedName = name;
      adoptedStyle = style;
    })));
    await tester.tap(find.byType(FilledButton));
    await tester.pumpAndSettle();
    expect(find.text('Use a name with 2–16 characters.'), findsOneWidget);
    expect(adoptedName, isNull);
    await tester.enterText(find.byType(TextFormField), ' Sprout ');
    await tester.tap(find.text('mango'));
    await tester.tap(find.byType(FilledButton));
    await tester.pumpAndSettle();
    expect(adoptedName, 'Sprout');
    expect(adoptedStyle, 'mango');
  });
  testWidgets('stat clamps its displayed and semantic value', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: Scaffold(body: PetStat(label: 'Hunger', value: 150))));
    expect(find.text('Hunger: 100/100'), findsOneWidget);
    final bar = tester.widget<LinearProgressIndicator>(find.byType(LinearProgressIndicator));
    expect(bar.value, 1);
    expect(bar.semanticsValue, '100');
  });
}
`);
console.log('Prepared Flutter helper and widget checks in ignored artifacts/snippet-check/.');
