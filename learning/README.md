# Quadri’s reference library

Start with [START_HERE.md](../START_HERE.md). Keep one Flutter project, open its own folder in VS Code, and complete the small checkpoints before the full missions.

Dart reference files end in .dart.txt intentionally. They are readable examples rather than files to run in this folder. Copy only the required contents into the destination named by the mission, using a real .dart filename there. This prevents missing Flutter imports in a reference directory that has no Flutter pubspec.yaml. Do not install Flutter dependencies in learning/.

first_checkpoint.dart.txt goes into your existing lib/main.dart only after backing it up. first_screen.dart.txt is the alternative mission 01 greeting screen; choose one route, not both. Later, pet.dart.txt goes into lib/models/pet.dart, adoption_screen.dart.txt and game_screen.dart.txt into lib/screens/, pet_stat.dart.txt into lib/widgets/, and storage/clock examples into lib/services/. pet_test.dart.txt goes into test/pet_test.dart after the model exists.

The guide uses app/ as the project folder; if yours is flutter_application_1/, use that folder. Read name: in its pubspec.yaml before copying package:pocket_pal/... imports in tests and adapt those to your actual package name. Keep package:flutter/... imports unchanged. launch.json belongs in the actual project’s .vscode/ folder and firebase.json beside its pubspec.yaml during deployment.

Edit guide/workshop.js and rebuild to update these generated references. Your own application code belongs in your Flutter project and keeps its normal analysis enabled.
