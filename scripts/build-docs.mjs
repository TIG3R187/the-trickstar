import fs from 'node:fs/promises';
import vm from 'node:vm';

const sandbox = {};
vm.runInNewContext(await fs.readFile('guide/content.js', 'utf8'), sandbox);
vm.runInNewContext(await fs.readFile('guide/workshop.js', 'utf8'), sandbox);
const c = sandbox.POCKET_PAL;
const tick = String.fromCharCode(96);
const inline = value => tick + value + tick;
const fenced = (value, language = 'sh') => `${tick.repeat(3)}${language}\n${value}\n${tick.repeat(3)}`;
const bullets = xs => xs.map(x => `- ${x}`).join('\n');
const checks = xs => xs.map(x => `- [ ] ${x}`).join('\n');
const repo = 'https://github.com/TIG3R187/the-trickstar';
const hostedGuide = 'https://tig3r187.github.io/the-trickstar/';
const offlinePack = `${repo}/raw/refs/heads/main/Pocket-Pal-Quadri-Assignment.zip`;

const workbench = `## ${c.workbench.title}

${c.workbench.intro}

${c.workbench.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

### Files and responsibilities

${fenced(c.workbench.folderTree, 'text')}

| File | Responsibility |
| --- | --- |
${c.codebaseFiles.map(row => `| ${inline(row[0])} | ${row[1]} |`).join('\n')}

**How the pieces connect:** ${c.workbench.workflow}

**How to use the snippets:** ${c.workbench.snippetNote}
`;
const troubleshooting = `## Before you ask your mentor

${c.commonQuestions.map(([question, answer]) => `<details>\n<summary><strong>${question}</strong></summary>\n\n${answer}\n\n</details>`).join('\n\n')}

### Send a useful help request

${fenced(c.helpTemplate, 'text')}
`;

const snippetMarkdown = snippet => `#### ${snippet.title}

**Location:** ${inline(snippet.file)}

**Placement:** ${snippet.placement}

${fenced(snippet.code, snippet.language)}

${snippet.explain}
`;

const goal = `## The goal

${c.student}, ${c.goal.charAt(0).toLowerCase() + c.goal.slice(1)}

**What you will achieve:** ${c.outcome}

**Suggested duration:** 14 days from your agreed start date. Agree the calendar deadline with your mentor.

**Tools:** ${c.tools}

**Scope:** ${c.scope}

The Tailwind HTML guide is a reference and rules playground. Your submitted game must be written in Flutter and Dart, inside ${inline('app/')}. This pack gives you a route to follow; you create the Flutter implementation.
`;

const rules = `## Game rules

| Rule | Required behaviour |
| --- | --- |
${c.rules.map(r => `| **${r[0]}** | ${r[1]} |`).join('\n')}

**Worked check:** starting at 30 / 70 / 70 (hunger / happiness / energy), Feed gives 10 / 70 / 70; Play then gives 15 / 85 / 60. Sleep changes only the sleeping flag. The next sleeping tick gives 17 / 85 / 70.
`;

function missionBody(m) {
  const note = m.id === 'setup' ? 'Run from the assignment root. After cd app, stay in app/ for Flutter commands.'
    : m.id === 'save' ? 'Run from the root; skip cd app if already inside app/.'
    : m.id === 'model' ? 'Write this helper in your Dart code; it is not a terminal command.' : 'Run inside app/.';
  return `**Your task:** ${m.what}

**Your route:**

${m.how.map((x, i) => `${i + 1}. ${x}`).join('\n')}
${m.code ? '\n' + fenced(m.code, m.id === 'model' ? 'dart' : 'sh') + '\n\n' + note + '\n' : ''}
**In VS Code:**

${m.editor.map((step, i) => `${i + 1}. ${step}`).join('\n')}

**Files to work on:** ${m.files.map(inline).join(', ')}

${m.snippets.map(snippetMarkdown).join('\n')}
**Mission cleared when:**

${checks(m.done)}

> **Field note:** ${m.hint}
`;
}

const schedule = `## Your 14-day route

| When | Mission | Skill unlocked |
| --- | --- | --- |
${c.missions.map((m, i) => `| ${m.day} | ${String(i + 1).padStart(2, '0')}. ${m.title} | ${m.skill} |`).join('\n')}
`;

const acceptance = `## Definition of done

${checks(c.acceptance)}
`;

const rubric = `## How your work will be reviewed

| Area | Points | What your mentor will look for |
| --- | ---: | --- |
${c.rubric.map(r => `| ${r[0]} | ${r[1]} | ${r[2]} |`).join('\n')}
| **Total** | **100** | Core requirements come first. Bonus features do not replace them. |

Be ready to explain your code. Documentation, tutorials and AI assistance are allowed as learning aids; keep a short note of what you used and verify every change. Your mentor may ask you to change a rule live.
`;

const delivery = `## What to submit

${bullets(c.deliverables)}

**Daily check-in:** tell your mentor what you completed, what you will do next, and one blocker or question. Commit when a meaningful piece works.

**Bonus, after the core works:** add one small animation, a muteable sound effect, an accessory unlock, or an Android APK. Explain any extra permissions or packages you choose.
`;

const resources = `## Official learning resources

${c.resources.map(r => `- [${r[0]}](${r[1]})`).join('\n')}
`;

const assignment = `# Pocket Pal — Quadri’s Flutter assignment

<img src="assets/pocket-pal-icon.png" width="112" alt="Pocket Pal: a mint creature with a leafy sprout">

**Assigned to:** Quadri · **Level:** about one month of Flutter/Dart · **Deliverable:** a deployed virtual pet game

[Quest hub](README.md) · [How to launch the interactive guide](README.md#launch-the-interactive-guide)

${goal}
${workbench}
${rules}
${schedule}
## Step-by-step assignment

${c.missions.map((m, i) => `### ${String(i + 1).padStart(2, '0')}. ${m.title} — ${m.day}\n\n${missionBody(m)}`).join('\n')}
${acceptance}
${delivery}
${rubric}
${troubleshooting}
${resources}
---

The HTML demo and original animations illustrate the experience you will build. See [asset notes](assets/README.md) for reusable artwork. To open the interactive guide, use [the launch instructions](README.md#launch-the-interactive-guide); GitHub’s file viewer displays HTML source code.
`;

const folderTree = `pocket-pal-assignment/
├── assignment.md        # Complete game specification
├── README.md            # This animated quest hub
├── index.html           # Browser / GitHub Pages entry
├── README.html          # Interactive Tailwind guide
├── assets/              # Original icon, animation and artwork
├── guide/               # Guide content, styles and interactions
├── .github/workflows/   # GitHub Pages deployment
├── scripts/             # Build, preview and validation tools
└── app/                 # Quadri creates this in mission 01
    ├── lib/
    ├── test/
    ├── README.md        # Document the Flutter game here
    └── TESTING.md       # Record real test results here`;

const readme = `<p align="center">
  <img src="assets/quest-banner.gif" width="960" alt="Animated Pocket Pal quest banner: a leafy creature jumps, asks for a snack, plays and falls asleep inside a little game console">
</p>

<h1 align="center">Your first world starts with one tiny friend.</h1>

<p align="center"><strong>QUADRI’S FLUTTER QUEST</strong> · 14 days · 10 missions · One game on the internet</p>

<p align="center">
  <a href="#launch-the-interactive-guide"><img src="assets/button-launch.svg" width="220" alt="Start your quest — launch options"></a>
  <a href="assignment.md"><img src="assets/button-brief.svg" width="250" alt="Read the full assignment"></a>
  <a href="${offlinePack}"><img src="assets/button-download.svg" width="250" alt="Download the offline assignment ZIP"></a>
</p>

> **Hey Quadri. Meet Sprout.** A tiny creature with a big appetite, a short attention span and absolutely no idea what a widget is. Your job? Build its world with Flutter, keep it happy, and send your mentor a link that works.

| Player | Your toolkit | Your finish line |
| :--- | :--- | :--- |
| **Quadri** · junior Flutter developer | Flutter, Dart, local storage and Git | Adopt → feed → play → sleep → refresh → same pet |

## Launch the interactive guide

**Choose a launch route below.** This README is the animated GitHub edition. The interactive guide runs in a browser, where the pet reacts to your clicks and your mission progress is saved.

### Play locally now — no install needed

1. [Download the offline pack](${offlinePack}), or use **Code → Download ZIP** above.
2. **Extract the entire ZIP.** Keep the assets and guide folders beside the HTML files.
3. Double-click **index.html** in the extracted folder. It opens the guide in your browser.

If you already have this repository locally, open **index.html** from File Explorer, or run:

${fenced('npm run preview')}

Then open **[http://127.0.0.1:4173](http://127.0.0.1:4173)**. The preview uses Node.js built-ins; npm install is unnecessary for this command.

### Give Quadri a hosted launch link

The repository includes a GitHub Pages workflow. The owner needs to enable Pages once:

1. Push this updated pack to the repository’s **main** branch.
2. Open **[Settings → Pages](${repo}/settings/pages)**. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open **[Actions → Publish Pocket Pal guide](${repo}/actions/workflows/deploy-guide.yml)**, choose **Run workflow**, check **deploy_pages**, and run it. Wait for the deployment job to turn green.

Pushes and pull requests run build/check/package only, so they can pass before Pages is enabled. A run with deploy_pages left unchecked validates the guide and skips publishing. The repository owner controls Pages setup and chooses when to publish.

**After deployment, the browser launch address is [${hostedGuide}](${hostedGuide}).** This is the expected Pages address, not a claim that hosting has already been enabled. Use the local route immediately while publishing is pending.

GitHub’s ${inline('/blob/main/README.html')} URL shows source code. Use the Pages address or an extracted local HTML file to run the guide. [GitHub Pages setup reference](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

---

## What you’re bringing to life

<p align="center"><img src="assets/care-loop.gif" width="640" alt="Animated concept showing Sprout getting hungry, playing happily and sleeping"></p>

| Give it a home | Give it a personality | Give it a memory |
| :--- | :--- | :--- |
| Pick a style. Choose a name. Make it yours. | Feed it, play with it and watch its mood change. | Save its state. Refresh the page. Find your friend waiting. |

The GIFs are original concept animations. The interactive guide is a working rules playground. **The Flutter game is yours to build.**

${goal}
<details>
<summary><strong>🧰 Quadri: open your VS Code workbench, file map and first steps</strong></summary>

${workbench}
</details>

<p align="center"><img src="assets/quest-route.gif" width="960" alt="Animated route from adoption to care, saving and shipping"></p>

${schedule}
## Your missions

Click a mission to open its route, commands, field notes and completion checks. In the browser guide, you can tick off missions, earn progress and export your checklist.

${c.missions.map((m, i) => `<details>\n<summary><strong>${['🛠️', '🗺️', '🌱', '🧠', '🍎', '⏱️', '💾', '🎨', '🧪', '🚀'][i]} MISSION ${String(i + 1).padStart(2, '0')} · ${m.title}</strong> — ${m.day}</summary>\n\n${missionBody(m)}\n</details>\n`).join('\n')}
${troubleshooting}
<details>
<summary><strong>🎮 Open the complete game rules and worked example</strong></summary>

${rules}
</details>

${acceptance}
${delivery}
<details>
<summary><strong>🏆 Open your mentor’s scorecard — 100 points</strong></summary>

${rubric}
</details>

<details>
<summary><strong>📁 Where your work goes</strong></summary>

${fenced(folderTree, 'text')}

A simple Flutter structure is ${inline('lib/models/pet.dart')}, ${inline('lib/screens/')}, ${inline('lib/widgets/')} and ${inline('lib/services/pet_storage.dart')}. Start with setState and one clear owner of the pet state.

</details>

<details>
<summary><strong>🔧 Customise or rebuild this assignment pack</strong></summary>

Run these commands from the assignment root to install the guide’s development dependencies and regenerate content, animation and styles:

${fenced('npm ci\nnpm run assets\nnpm run build\nnpm run check\nnpm run site')}

Edit ${inline('guide/content.js')} for the brief and ${inline('guide/workshop.js')} for the VS Code walkthrough and snippets. ${inline('npm run build')} regenerates both Markdown documents, helper files in learning/snippets/ and compiled Tailwind CSS. Update this generator to change the README layout; direct edits to generated Markdown are overwritten.

${inline('npm run test:browser')} checks the guide’s rules, storage, links, animation and layouts. It uses an installed Playwright Chromium or Windows Edge. You can set ${inline('POCKET_PAL_BROWSER')} to another Chromium executable or install Chromium with ${inline('npx playwright install chromium')}.

The guide’s npm tools are separate from Quadri’s Flutter tools. The deployment workflow publishes only the guide and brief; Quadri deploys his Flutter game separately in mission 10.

</details>

<details>
<summary><strong>📚 Your official learning library</strong></summary>

${resources}
</details>

---

<p align="center"><img src="assets/pocket-pal-icon.png" width="64" alt="Pocket Pal icon"></p>
<p align="center"><strong>Build one small thing. Make it work. Give it a little life.</strong><br>Quadri, your finish line is a live game and code you can explain.</p>

[Back to the launch options ↑](#launch-the-interactive-guide) · [Full specification](assignment.md) · [Artwork you can reuse](assets/README.md)
`;

await fs.writeFile('assignment.md', assignment);
await fs.writeFile('README.md', readme);
await fs.mkdir('learning/snippets', { recursive: true });
for (const mission of c.missions) {
  for (const snippet of mission.snippets) {
    if (snippet.filename) await fs.writeFile(`learning/snippets/${snippet.filename}`, snippet.code + '\n');
  }
}
await fs.writeFile('learning/README.md', '# Quadri’s snippet library\n\nThese are complete helper examples from the assignment. Copy each file into the destination stated in its mission; filenames here are references, not an assembled Flutter app. Start with assignment.md → Quadri’s VS Code workbench, then follow the ten missions in order.\n\nfirst_screen.dart becomes app/lib/main.dart for mission 01. Copy pet.dart into app/lib/models/, adoption_screen.dart into app/lib/screens/, pet_stat.dart into app/lib/widgets/, and storage/clock helpers into app/lib/services/. Put pet_test.dart in app/test/. launch.json belongs in app/.vscode/; firebase.json belongs in app/ after Firebase initialization.\n\nQuadri still builds GameScreen, integrates adoption/loading/reset, implements Play and visual mood feedback, and writes the widget journey test. Imports and paths are intended for those destination folders. Edit guide/workshop.js and rebuild to change these generated examples.\n');
console.log('Generated the assignment and animated GitHub quest hub from shared content.');
