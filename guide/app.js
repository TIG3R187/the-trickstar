(() => {
  'use strict';
  const c = globalThis.POCKET_PAL;
  const $ = id => document.getElementById(id);
  const escape = text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const storageKey = 'pocket-pal-quadri-guide-v1';
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = motionQuery.matches;
  function applyMotionPreference() {
    document.body.classList.toggle('motion-paused', motionPaused);
    const button = $('motion-toggle');
    button.setAttribute('aria-pressed', String(motionPaused));
    button.setAttribute('aria-label', motionPaused ? 'Resume animation' : 'Pause animation');
    button.innerHTML = motionPaused ? '▶ <span class="hidden sm:inline">Resume animation</span>' : 'Ⅱ <span class="hidden sm:inline">Pause animation</span>';
    document.querySelectorAll('[data-motion-src]').forEach(img => { img.src = motionPaused ? img.dataset.staticSrc : img.dataset.motionSrc; });
    if (motionPaused) document.querySelectorAll('.confetti-bit').forEach(el => el.remove());
  }
  $('motion-toggle').addEventListener('click', () => { motionPaused = !motionPaused; applyMotionPreference(); });
  motionQuery.addEventListener('change', event => { motionPaused = event.matches; applyMotionPreference(); });
  function celebrate(anchor) {
    if (motionPaused) return;
    const box = anchor.getBoundingClientRect();
    for (let i = 0; i < 16; i++) {
      const bit = document.createElement('span');
      bit.className = 'confetti-bit';
      bit.style.cssText = `left:${box.left + box.width / 2}px;top:${box.top + 10}px;background:${['#79b98a', '#e7a269', '#d5bd69', '#a5c6d3'][i % 4]};--dx:${Math.cos(i / 16 * Math.PI * 2) * 100}px;--dy:${Math.sin(i / 16 * Math.PI * 2) * 90 - 70}px;--spin:${i * 47}deg;`;
      bit.addEventListener('animationend', () => bit.remove(), { once: true }); document.body.append(bit);
      setTimeout(() => bit.remove(), 1500);
    }
  }
  let progress = { missions: [], checks: [] };
  let storageAvailable = true;
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (raw && Array.isArray(raw.missions) && Array.isArray(raw.checks)) {
      progress.missions = [...new Set(raw.missions.filter(id => c.missions.some(m => m.id === id)))];
      progress.checks = [...new Set(raw.checks.filter(i => Number.isInteger(i) && i >= 0 && i < c.acceptance.length))];
    }
  } catch { storageAvailable = false; }
  let toastTimer;
  function toast(message) {
    $('toast').textContent = message;
    $('toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4000);
  }
  function saveProgress() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    updateStorageNote();
  }
  function updateStorageNote() {
    $('storage-note').textContent = storageAvailable
      ? 'Mission and checklist progress is saved in this browser only. The demo pet resets on reload.'
      : 'Browser storage is unavailable or could not be read. Progress works for this visit; export it before leaving.';
  }
  function updateProgress() {
    const n = progress.missions.length;
    $('progress-percent').textContent = `${Math.round(n / c.missions.length * 100)}%`;
    $('progress-text').textContent = n === c.missions.length ? '10 of 10 complete. Ready for the final checks!' : `${n} of 10 missions complete`;
    $('progress-xp').textContent = `${n * 100} XP`;
    $('progress-rank').textContent = n === 10 ? 'Ready to demonstrate' : n >= 5 ? 'World builder' : n > 0 ? 'On your way' : 'New adventurer';
    $('progress-fill').style.width = `${n / c.missions.length * 100}%`;
    $('mission-progress').setAttribute('aria-valuenow', n);
    c.missions.forEach(m => {
      const complete = progress.missions.includes(m.id);
      $(`mission-${m.id}`).classList.toggle('is-complete', complete);
      $(`complete-${m.id}`).checked = complete;
      $(`map-${m.id}`).classList.toggle('is-complete', complete);
      $(`map-${m.id}`).setAttribute('aria-label', `Mission ${c.missions.indexOf(m) + 1}: ${m.title}${complete ? ', complete' : ''}`);
    });
    c.acceptance.forEach((_, i) => { $(`acceptance-${i}`).checked = progress.checks.includes(i); });
  }

  $('goal-copy').textContent = c.goal;
  $('outcome-copy').textContent = c.outcome;
  $('scope-copy').textContent = c.scope;
  $('tools-copy').textContent = c.tools;
  const recovery = document.createElement('div');
  recovery.className = 'workshop-details';
  recovery.innerHTML = `<h3 class="font-bold">Start here: recover your existing Flutter project</h3><p>${escape(c.beginner.diagnosis)}</p><ol class="workbench-steps">${c.beginner.recovery.map(step => `<li>${escape(step)}</li>`).join('')}</ol><p>${escape(c.beginner.pathNote)}</p><h3 class="font-bold mt-5">One checkpoint at a time</h3><ul class="workbench-steps">${c.beginner.checkpoints.map(([title, text]) => `<li><strong>${escape(title)}</strong> — ${escape(text)}</li>`).join('')}</ul><p><a href="START_HERE.md" class="text-button">Open the one-file exercise and recovery instructions →</a></p><details class="workshop-details"><summary>Checkpoint 1: one file and one Feed button</summary><p>${escape(c.beginner.starterNote)}</p><div class="code-block"><div class="code-top"><span>LIB/MAIN.DART</span><button class="copy-button" data-copy-block="first-checkpoint">Copy</button></div><pre id="first-checkpoint"><code>${escape(c.beginner.starter)}</code></pre></div></details></div>`;
  $('workbench-content').innerHTML = `<p class="section-intro">${escape(c.workbench.intro)}</p><ol class="workbench-steps">${c.workbench.steps.map(x => `<li>${escape(x)}</li>`).join('')}</ol><details class="workshop-details"><summary>Open the folder map and code ownership guide</summary><pre>${escape(c.workbench.folderTree)}</pre><p>${escape(c.workbench.workflow)}</p><p>${escape(c.workbench.snippetNote)}</p><ul>${c.codebaseFiles.map(([file, role]) => `<li><code>${escape(file)}</code> — ${escape(role)}</li>`).join('')}</ul></details>`;
  $('workbench-content').prepend(recovery);
  $('question-list').innerHTML = c.commonQuestions.map(([q, a]) => `<details class="workshop-details"><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`).join('');
  $('help-template').textContent = c.helpTemplate;
  $('quest-map').innerHTML = c.missions.map((m, i) => `<button class="map-stop" id="map-${m.id}" data-jump="${m.id}"><span class="map-number">${String(i + 1).padStart(2, '0')}</span><span>${escape(m.skill)}</span></button>`).join('');
  $('mission-list').innerHTML = c.missions.map((m, i) => `
    <details class="mission" id="mission-${m.id}" ${i === 0 ? 'open' : ''}>
      <summary><span class="mission-number">${String(i + 1).padStart(2, '0')}</span><span><span class="mission-title">${escape(m.title)}</span><span class="mission-day block">${escape(m.day)} · ${escape(m.skill)}</span></span><span class="mission-arrow" aria-hidden="true">+</span></summary>
      <div class="mission-body"><p>${escape(m.what)}</p><h4>How to do it</h4><ol>${m.how.map(x => `<li>${escape(x)}</li>`).join('')}</ol>
      ${m.code ? `<div class="code-block"><div class="code-top"><span>${m.id === 'model' ? 'DART HELPER' : 'TERMINAL'}</span><button class="copy-button" data-copy="${m.id}" aria-label="Copy ${escape(m.title)} commands">Copy</button></div><pre id="code-${m.id}"><code>${escape(m.code)}</code></pre></div><p class="mt-2 text-xs">${m.id === 'setup' ? 'Run from the assignment root. After cd app, stay in app/ for Flutter commands.' : m.id === 'save' ? 'Run from the root, or skip cd app if already inside app/.' : m.id === 'model' ? 'A helper to write in your Dart code; not a terminal command.' : 'Run inside app/.'}</p>` : ''}
      <h4>In VS Code</h4><ol>${m.editor.map(x => `<li>${escape(x)}</li>`).join('')}</ol><h4>Files you will edit</h4><ul>${m.files.map(x => `<li><code>${escape(x)}</code></li>`).join('')}</ul>
      ${m.snippets.map(s => `<details class="workshop-details snippet"><summary>${escape(s.title)}</summary><p><strong>${escape(s.file)}</strong><br>${escape(s.placement)}</p><div class="code-block"><div class="code-top"><span>${escape(s.language.toUpperCase())}</span><button class="copy-button" data-copy-block="snippet-${s.id}" aria-label="Copy ${escape(s.title)}">Copy</button></div><pre id="snippet-${s.id}"><code>${escape(s.code)}</code></pre></div><p>${escape(s.explain)}</p></details>`).join('')}
      <h4>You’re done when</h4><ul>${m.done.map(x => `<li>${escape(x)}</li>`).join('')}</ul><p class="mission-hint"><strong>A little help:</strong> ${escape(m.hint)}</p>
      <label class="mission-check"><input type="checkbox" id="complete-${m.id}" data-mission="${m.id}"><span>I’ve built and checked this mission</span></label></div>
    </details>`).join('');
  $('rule-list').innerHTML = c.rules.map(r => `<article class="rule-card"><h3>${escape(r[0])}</h3><p>${escape(r[1])}</p></article>`).join('');
  $('acceptance-list').innerHTML = c.acceptance.map((x, i) => `<label class="acceptance-check"><input type="checkbox" id="acceptance-${i}" data-check="${i}"><span>${escape(x)}</span></label>`).join('');
  $('deliverables').innerHTML = c.deliverables.map((x, i) => `<li class="deliverable"><span>0${i + 1}</span><p>${escape(x)}</p></li>`).join('');
  $('rubric-list').innerHTML = c.rubric.map(r => `<div class="rubric-row"><div><h3>${escape(r[0])}</h3><p>${escape(r[2])}</p></div><span class="rubric-points">${r[1]}<span class="text-xs"> pts</span></span></div>`).join('');
  $('resource-list').innerHTML = c.resources.map(r => `<a class="resource-link" href="${escape(r[1])}" target="_blank" rel="noopener noreferrer">${escape(r[0])}<span aria-hidden="true">↗</span><span class="sr-only"> (opens a new tab)</span></a>`).join('');

  document.querySelectorAll('[data-mission]').forEach(input => input.addEventListener('change', () => {
    progress.missions = input.checked ? [...new Set([...progress.missions, input.dataset.mission])] : progress.missions.filter(id => id !== input.dataset.mission);
    saveProgress(); updateProgress();
    if (input.checked) { celebrate(input.closest('label')); toast(`Mission complete. +100 XP, Quadri!`); }
    if (progress.missions.length === c.missions.length) toast('All missions complete, Quadri. Check your live game and prepare your handoff!');
  }));
  document.querySelectorAll('[data-jump]').forEach(button => button.addEventListener('click', () => {
    const mission = $(`mission-${button.dataset.jump}`); mission.open = true;
    mission.scrollIntoView({ behavior: motionPaused ? 'instant' : 'smooth', block: 'start' });
    mission.querySelector('summary').focus({ preventScroll: true });
  }));
  document.querySelectorAll('[data-check]').forEach(input => input.addEventListener('change', () => {
    const i = Number(input.dataset.check);
    progress.checks = input.checked ? [...new Set([...progress.checks, i])] : progress.checks.filter(n => n !== i);
    saveProgress();
  }));
  document.querySelectorAll('[data-copy],[data-copy-block]').forEach(button => button.addEventListener('click', async () => {
    const pre = button.dataset.copyBlock ? $(button.dataset.copyBlock) : $(`code-${button.dataset.copy}`);
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(pre.textContent);
      toast('Copied. Check the working folder before running commands.');
    } catch {
      const range = document.createRange(); range.selectNodeContents(pre);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      toast('Text selected. Press Ctrl+C or use your browser’s Copy command.');
    }
  }));
  $('expand-all').addEventListener('click', () => {
    const allOpen = [...document.querySelectorAll('.mission')].every(el => el.open);
    document.querySelectorAll('.mission').forEach(el => { el.open = !allOpen; });
    $('expand-all').textContent = allOpen ? 'Expand all missions' : 'Collapse all missions';
  });
  $('mission-list').addEventListener('toggle', () => {
    $('expand-all').textContent = [...document.querySelectorAll('.mission')].every(el => el.open) ? 'Collapse all missions' : 'Expand all missions';
  }, true);
  $('export-progress').addEventListener('click', () => {
    const lines = ['# Quadri’s Pocket Pal progress', '', '## Missions', ...c.missions.map(m => `- [${progress.missions.includes(m.id) ? 'x' : ' '}] ${m.title}`), '', '## Acceptance checks', ...c.acceptance.map((x, i) => `- [${progress.checks.includes(i) ? 'x' : ' '}] ${x}`), '', 'Recorded by Quadri using the local assignment guide. Completion is self-reported.'];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'quadri-pocket-pal-progress.md'; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Your progress export is ready.');
  });
  $('clear-progress').addEventListener('click', () => {
    if (!window.confirm('Reset all mission and submission checkboxes in this guide? This does not affect your Flutter app.')) return;
    progress = { missions: [], checks: [] }; saveProgress(); updateProgress(); toast('Guide progress reset.');
  });

  // Rules playground: deliberately manual time and no saved pet. This is not the Flutter solution.
  const initialPet = () => ({ hunger: 30, happiness: 70, energy: 70, sleeping: false });
  let pet = initialPet();
  const clamp = n => Math.max(0, Math.min(100, n));
  function renderPet(message) {
    const mood = pet.sleeping ? 'sleeping' : pet.hunger >= 70 ? 'hungry' : pet.energy <= 20 ? 'tired' : pet.happiness <= 30 ? 'sad' : 'happy';
    $('pet-mood').textContent = mood === 'sleeping' ? 'Shh… sleeping' : `Feeling ${mood}`;
    $('pet-art').src = `assets/pal${mood === 'happy' ? '' : `-${mood}`}.svg`;
    $('pet-art').alt = `Sprout, a ${mood} mint creature`;
    $('pet-art').style.filter = mood === 'sad' ? 'saturate(.6)' : '';
    $('pet-art').dataset.sleeping = String(pet.sleeping);
    $('pet-prop').textContent = pet.sleeping ? 'z z' : mood === 'hungry' ? '◒' : mood === 'tired' ? '☾' : '';
    const stats = [['hunger', 'Hunger', '#cb9563'], ['happiness', 'Happy', '#8fa97a'], ['energy', 'Energy', '#d0b35f']];
    $('pet-stats').innerHTML = stats.map(([key, title, color]) => `<div><div class="stat-name"><span>${title}</span><span id="stat-${key}">${pet[key]}</span></div><div class="stat-track" role="progressbar" aria-label="${key === 'hunger' ? 'Hunger (lower means fuller)' : key}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pet[key]}"><span style="width:${pet[key]}%;background:${color}"></span></div></div>`).join('');
    $('feed').disabled = pet.sleeping || pet.hunger === 0;
    $('play').disabled = pet.sleeping || pet.energy < 10;
    $('feed').title = pet.sleeping ? 'Wake your pet before feeding.' : pet.hunger === 0 ? 'Your pet is full.' : 'Hunger −20';
    $('play').title = pet.sleeping ? 'Wake your pet before playing.' : pet.energy < 10 ? 'Your pet needs at least 10 energy.' : 'Happiness +15, energy −10, hunger +5';
    $('feed').setAttribute('aria-describedby', 'pet-message'); $('play').setAttribute('aria-describedby', 'pet-message');
    $('sleep-label').textContent = pet.sleeping ? 'Wake' : 'Sleep';
    $('pet-message').textContent = message + (pet.sleeping ? ' Feed and Play are off while sleeping.' : pet.energy < 10 ? ' Play needs at least 10 energy.' : pet.hunger === 0 ? ' Feed is off because Sprout is full.' : '');
  }
  function react(text, type) {
    $('pet-reaction').textContent = text;
    if (motionPaused) return;
    $('pet-reaction').getAnimations().forEach(animation => animation.cancel());
    $('pet-reaction').animate([{ opacity: 0, transform: 'translateY(15px) scale(.8)' }, { opacity: 1, transform: 'translateY(0) scale(1)', offset: .25 }, { opacity: 0, transform: 'translateY(-35px) scale(1.1)' }], { duration: 1200 });
    if (type === 'play') {
      $('pet-art').animate([{ transform: 'translateX(-50%) rotate(0deg)' }, { transform: 'translateX(-50%) translateY(-35px) rotate(-9deg)' }, { transform: 'translateX(-50%) translateY(-15px) rotate(9deg)' }, { transform: 'translateX(-50%) rotate(0deg)' }], { duration: 650, easing: 'ease-out' });
      celebrate($('play'));
    } else if (type === 'feed') {
      $('pet-art').animate([{ transform: 'translateX(-50%) scale(1)' }, { transform: 'translateX(-50%) scale(1.08,.94)' }, { transform: 'translateX(-50%) scale(1)' }], { duration: 450 });
    }
  }
  $('feed').addEventListener('click', () => { pet.hunger = clamp(pet.hunger - 20); renderPet('Snack time! Hunger −20.'); react('♥ NOM NOM', 'feed'); });
  $('play').addEventListener('click', () => { pet.happiness = clamp(pet.happiness + 15); pet.energy = clamp(pet.energy - 10); pet.hunger = clamp(pet.hunger + 5); renderPet('That was fun! Happy +15, energy −10, hunger +5.'); react('✦ LET’S GO!', 'play'); });
  $('sleep').addEventListener('click', () => { pet.sleeping = !pet.sleeping; renderPet(pet.sleeping ? 'Resting. Advance time to recover energy.' : 'Good morning! Ready for a little care.'); react(pet.sleeping ? 'SWEET DREAMS ☾' : 'GOOD MORNING ☀', 'sleep'); });
  $('tick').addEventListener('click', () => {
    pet.hunger = clamp(pet.hunger + (pet.sleeping ? 2 : 5));
    pet.energy = clamp(pet.energy + (pet.sleeping ? 10 : -2));
    if (!pet.sleeping) pet.happiness = clamp(pet.happiness - 3);
    renderPet('30 seconds of visible game time advanced.');
  });
  $('reset-demo').addEventListener('click', () => { pet = initialPet(); renderPet('Sprout is back to the starting values.'); });
  document.querySelectorAll('a[href="#missions"],a[href="#playground"]').forEach(link => link.addEventListener('click', () => {
    if (link.getAttribute('href') === '#missions') { $('mission-setup').open = true; toast('Mission 01 is ready. Your adventure starts here, Quadri.'); }
    else { react('HEY, QUADRI! ♥', 'play'); }
  }));
  renderPet('Try a care action. Higher hunger means hungrier.'); updateProgress(); updateStorageNote(); applyMotionPreference();
})();
