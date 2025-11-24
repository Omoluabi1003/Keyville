const telemetryKey = 'lexicon-detective-telemetry';
const stateKey = 'lexicon-detective-state-v2';
const stateVersion = '2.0.0';

const defaultState = {
  version: stateVersion,
  currentRoom: 0,
  completed: false,
  stage: 1,
  answers: {},
  player: { name: '', team: '' },
  badges: [],
  stageAwards: [],
  caseSeed: null,
  caseData: null,
  telemetry: {
    attempts: {},
    durations: {},
    misses: {},
    clearTimes: {},
    hints: {},
    wrongCodes: {},
    timeOnTask: {},
  },
  unlockedRooms: [],
  mastery: {},
  practiceMode: false,
  audioEnabled: true,
};

const feedbackBox = document.getElementById('feedback');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const progressHint = document.getElementById('progress-hint');
const roomStatus = document.getElementById('room-status');
const statusLine = document.getElementById('status-line');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-progress');
const playerNameField = document.getElementById('player-name');
const playerTeamField = document.getElementById('player-team');
const badgeShelf = document.getElementById('badge-shelf');
const teacherToggle = document.getElementById('teacher-toggle');
const telemetryReadout = document.getElementById('telemetry-readout');
const exportTelemetryButton = document.getElementById('export-telemetry');
const newCaseButton = document.getElementById('new-case');
const transitionOverlay = document.getElementById('transition-overlay');
const transitionTitle = document.getElementById('transition-title');
const transitionBody = document.getElementById('transition-body');
const transitionProgress = document.getElementById('transition-progress');
const transitionLabel = document.getElementById('transition-label');
const transitionClose = document.getElementById('transition-close');
const toastContainer = document.getElementById('toast-container');
const progressPercent = document.getElementById('progress-percent');
const roomMapList = document.getElementById('room-map');
const nextStageButton = document.getElementById('next-stage');
const highContrastToggle = document.getElementById('contrast-toggle');
const audioToggle = document.getElementById('audio-toggle');
const grammarExample = document.getElementById('grammar-example');
const grammarHintButton = document.getElementById('grammar-hint');
const teacherDashboard = document.getElementById('teacher-dashboard');
const teacherRoster = document.getElementById('teacher-roster');
const unlockControls = document.getElementById('unlock-controls');
const roomMapSummary = document.getElementById('room-map-summary');
const masteryLabel = document.getElementById('mastery-label');
const masteryCopy = document.getElementById('mastery-copy');
const accordionBody = document.getElementById('accordion-body');
const mapAccordion = document.getElementById('map-accordion');
const practiceButton = document.getElementById('practice-mode');
const filterSquad = document.getElementById('filter-squad');
const filterRoom = document.getElementById('filter-room');
const filterDate = document.getElementById('filter-date');
const classSummary = document.getElementById('class-summary');
const summaryReadout = document.getElementById('summary-readout');
const resetRoomButton = document.getElementById('reset-room');
const vocabMicrocopy = document.getElementById('vocab-microcopy');
const figMicrocopy = document.getElementById('fig-microcopy');
const synMicrocopy = document.getElementById('syn-microcopy');
const storyChecklist = document.getElementById('story-checklist');
const storyMicrocopy = document.getElementById('story-microcopy');
const grammarChecklist = document.getElementById('grammar-checklist');

const answerKeys = ['vocab', 'grammar', 'fig', 'synAnt', 'story'];
const roomsPerStage = answerKeys.length;
let currentCase = null;
let roomMeta = [];
let roomMap = {};
let state = loadState();
let roomStartTime = null;
let audioContext = null;
let grammarHintSpent = false;
let soundtrackInterval = null;
let soundtrackStep = 0;
let transitionHideTimeout = null;

function loadState() {
  const stored = localStorage.getItem(stateKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.version !== stateVersion) {
        return { ...defaultState, player: parsed.player || defaultState.player };
      }
      return {
        ...defaultState,
        ...parsed,
        answers: parsed.answers || {},
        player: { ...defaultState.player, ...(parsed.player || {}) },
        badges: parsed.badges || [],
        stage: parsed.stage || defaultState.stage,
        stageAwards: parsed.stageAwards || [],
        caseData: parsed.caseData || null,
        telemetry: { ...defaultState.telemetry, ...(parsed.telemetry || {}) },
        mastery: parsed.mastery || {},
      };
    } catch (e) {
      console.warn('Resetting state due to parse error');
    }
  }
  return { ...defaultState };
}

function saveState() {
  if (state.practiceMode) return;
  state.version = stateVersion;
  localStorage.setItem(stateKey, JSON.stringify(state));
  localStorage.setItem(telemetryKey, JSON.stringify(state.telemetry));
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function deepCopy(data) {
  return JSON.parse(JSON.stringify(data));
}

function composeRooms(randomize = false) {
  const rooms = deepCopy(gameData.rooms);
  if (!randomize) return rooms;

  const vocabSet = randomChoice(gameData.pools.vocabularySets);
  const grammarSet = randomChoice(gameData.pools.grammarPrompts);
  const figSet = randomChoice(gameData.pools.figurativeSets);
  const synSet = randomChoice(gameData.pools.synonymTargets);
  rooms.find((r) => r.id === 'vocab').dataset.words = vocabSet.words;
  rooms.find((r) => r.id === 'grammar').dataset = grammarSet;
  rooms.find((r) => r.id === 'fig').dataset.prompts = figSet.prompts;
  rooms.find((r) => r.id === 'synAnt').dataset.targets = synSet.targets;
  rooms.find((r) => r.id === 'vocab').dataset.tier = vocabSet.tier;
  rooms.find((r) => r.id === 'fig').dataset.tier = figSet.tier;
  rooms.find((r) => r.id === 'synAnt').dataset.tier = synSet.tier;
  const storyRoom = rooms.find((r) => r.id === 'story');
  storyRoom.dataset.simileBank = [
    ...new Set([...storyRoom.dataset.simileBank, ...gameData.pools.simileBank]),
  ];
  return rooms;
}

function buildCase({ randomize = false } = {}) {
  if (!state.caseData) {
    state.caseData = composeRooms(randomize);
    state.caseSeed = Date.now();
  } else if (randomize) {
    state.caseData = composeRooms(true);
    state.caseSeed = Date.now();
  }

  const rooms = deepCopy(state.caseData);
  roomMeta = rooms.map((room) => ({ title: room.title, tag: room.tag }));
  roomMap = rooms.reduce((acc, room) => ({ ...acc, [room.id]: room }), {});
  currentCase = rooms;
}

function playerGreeting() {
  const { name, team } = state.player || {};
  if (name && team) return `${name} (${team})`;
  if (name) return name;
  return 'Detective';
}

function updateStartButtonLabel() {
  if (!startButton) return;
  const roomLabel = state.completed
    ? `Begin Stage ${state.stage + 1}`
    : `Stage ${state.stage} · Room ${state.currentRoom + 1}`;
  startButton.textContent = state.completed ? roomLabel : `Start / Resume: ${roomLabel}`;
  startButton.ariaLabel = `${startButton.textContent} as ${playerGreeting()}`;
}

function setFeedback(message, type = 'info') {
  feedbackBox.textContent = message;
  feedbackBox.classList.remove('feedback-error', 'feedback-success');
  if (type === 'error') {
    feedbackBox.classList.add('feedback-error');
  } else if (type === 'success') {
    feedbackBox.classList.add('feedback-success');
  }
  if (type === 'success') {
    playTone(640);
  } else if (type === 'error') {
    playTone(260);
  }
}

function playTone(freq = 440) {
  if (!state.audioEnabled) return;
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 0.15;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.02, audioContext.currentTime);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (err) {
    console.warn('Tone skipped', err);
  }
}

function startAmbient() {
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    stopAmbient();
    soundtrackStep = 0;
    audioContext.resume().catch(() => {});
    const tempo = 108;
    const motif = [0, 4, 7, 9, 12, 7];
    soundtrackInterval = setInterval(() => {
      const now = audioContext.currentTime;
      const note = motif[soundtrackStep % motif.length];
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = soundtrackStep % 4 === 0 ? 'triangle' : 'square';
      osc.frequency.value = 196 * 2 ** (note / 12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.connect(gain).connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.68);

      if (soundtrackStep % 3 === 0) {
        const sparkle = audioContext.createOscillator();
        const sparkleGain = audioContext.createGain();
        sparkle.type = 'sawtooth';
        sparkle.frequency.value = 392 * 2 ** (((soundtrackStep % motif.length) - 2) / 12);
        sparkleGain.gain.setValueAtTime(0.02, now + 0.12);
        sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        sparkle.connect(sparkleGain).connect(audioContext.destination);
        sparkle.start(now + 0.12);
        sparkle.stop(now + 0.42);
      }

      soundtrackStep += 1;
    }, Math.round((60 / tempo) * 1000));
  } catch (err) {
    console.warn('Ambient soundtrack skipped', err);
  }
}

function stopAmbient() {
  try {
    if (soundtrackInterval) {
      clearInterval(soundtrackInterval);
      soundtrackInterval = null;
    }
  } catch (err) {
    console.warn('Ambient stop error', err);
  }
}

function confetti() {
  const colors = ['#ff7ac2', '#22c55e', '#facc15', '#38bdf8'];
  for (let i = 0; i < 18; i += 1) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1900);
  }
}

function playCelebrationJingle() {
  if (!state.audioEnabled) return;
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    const pattern = [0, 7, 12, 19];
    pattern.forEach((offset, idx) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 340 * 2 ** (offset / 12);
      const startTime = now + idx * 0.06;
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      osc.connect(gain).connect(audioContext.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.42);
    });
  } catch (err) {
    console.warn('Celebration jingle skipped', err);
  }
}

function celebrateRoom(roomId) {
  confetti();
  playCelebrationJingle();
  const label = roomMap[roomId]?.title || 'Room cleared';
  showToast(`${label} cleared! Confetti keys collected.`);
}

function showToast(message) {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

function stageAwardLabel(stageNumber) {
  if (stageNumber % 10 !== 0) return null;
  const milestoneBadges = [
    'Courage Collector',
    'Word Wonder',
    'Grammar Guardian',
    'Figurative Flame',
    'Story Superstar',
  ];
  const index = ((stageNumber / 10 - 1) % milestoneBadges.length + milestoneBadges.length) % milestoneBadges.length;
  return `Stage ${stageNumber} ${milestoneBadges[index]}`;
}

function showRoom(index) {
  hideTransition();
  const allowedIndex = Math.min(index, state.currentRoom);
  document.querySelectorAll('.card').forEach((room) => {
    if (room.id.startsWith('room-')) {
      if (room.id === `room-${allowedIndex}`) {
        room.classList.remove('hidden');
      } else {
        room.classList.add('hidden');
      }
    } else if (room.id === 'win-screen') {
      room.classList.add('hidden');
    }
  });
  const progressRatio = computeProgress(allowedIndex);
  progressHint.textContent = roomMeta[allowedIndex]?.title || 'CLO Achieved';
  progressText.textContent = `Stage ${state.stage} · Room ${allowedIndex + 1} of ${roomsPerStage}`;
  progressFill.style.width = `${progressRatio * 100}%`;
  if (progressPercent) {
    progressPercent.textContent = `${Math.round(progressRatio * 100)}% complete`;
  }
  refreshRoomStatus();
  updateStartButtonLabel();
  updateMasteryUI();
  renderRoomMap();
  roomStartTime = Date.now();
  saveState();
}

function computeProgress(activeIndex) {
  const masteryScores = answerKeys.map((key, idx) => {
    if (idx < activeIndex) return state.mastery[key] || 1;
    if (idx === activeIndex) return Math.max(state.mastery[key] || 0, 0.2);
    return state.mastery[key] || 0;
  });
  if (state.completed) return 1;
  const total = masteryScores.reduce((a, b) => a + b, 0);
  return total / masteryScores.length;
}

function setMastery(roomId, ratio, copyText = '') {
  const clamped = Math.max(0, Math.min(1, ratio));
  state.mastery[roomId] = clamped;
  if (masteryLabel) masteryLabel.textContent = `Room mastery: ${Math.round(clamped * 100)}%`;
  if (masteryCopy && copyText) masteryCopy.textContent = copyText;
  progressFill.style.width = `${computeProgress(state.currentRoom) * 100}%`;
  saveState();
}

function updateMasteryUI() {
  const key = answerKeys[state.currentRoom];
  const value = Math.round((state.mastery[key] || 0) * 100);
  if (masteryLabel) masteryLabel.textContent = `Room mastery: ${value}%`;
  if (!state.mastery[key] && masteryCopy) {
    masteryCopy.textContent = 'Start a task to see live mastery feedback.';
  }
}

function populateVocabulary() {
  const optionContainer = document.getElementById('definition-options');
  const rows = document.getElementById('vocab-rows');
  rows.innerHTML = '';
  optionContainer.innerHTML = '<strong>Word Bank</strong>: ' +
    roomMap.vocab.dataset.words.map((def) => def.definition).join(' • ');

  roomMap.vocab.dataset.words.forEach((def, idx) => {
    const row = document.createElement('div');
    row.className = 'match-row';
    row.innerHTML = `
      <div class="definition">${idx + 1}. ${def.label}</div>
      <select name="${def.id}" aria-label="Definition for ${def.label}">
        <option value="">Choose the match</option>
      </select>
    `;
    rows.appendChild(row);
  });

  const selects = document.querySelectorAll('#vocab-form select');
  selects.forEach((select) => {
    roomMap.vocab.dataset.words
      .slice()
      .sort(() => Math.random() - 0.5)
      .forEach((def) => {
        const opt = document.createElement('option');
        opt.value = def.id;
        opt.textContent = def.definition;
        select.appendChild(opt);
      });
  });
  document.getElementById('vocab-inline-hint').textContent = roomMap.vocab.objective;
  if (vocabMicrocopy) vocabMicrocopy.textContent = `Tier: ${roomMap.vocab.dataset.tier || 'core'} · Matches are randomized and locked for this run.`;
  updateVocabCheckState();
}

function updateVocabCheckState() {
  const button = document.querySelector('#vocab-form .primary');
  const selects = document.querySelectorAll('#vocab-form select');
  if (!button) return;
  const allChosen = Array.from(selects).every((sel) => sel.value);
  button.disabled = !allChosen;
  button.setAttribute('aria-disabled', (!allChosen).toString());
}

function populateFigurative() {
  const list = document.getElementById('figurative-list');
  list.innerHTML = '';
  roomMap.fig.dataset.prompts.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'summary-item';
    row.innerHTML = `
      <p class="definition">${item.clue}</p>
      <div class="choice-row" role="group" aria-label="Choose figurative type">
        ${['simile', 'metaphor', 'personification']
          .map(
            (choice) => `
            <button class="choice" data-clue="${item.id}" data-value="${choice}" type="button">
              ${choice.charAt(0).toUpperCase() + choice.slice(1)}
            </button>
          `,
          )
          .join('')}
      </div>
    `;
    list.appendChild(row);
  });
  if (figMicrocopy) figMicrocopy.textContent = `Tier: ${roomMap.fig.dataset.tier || 'core'} · Randomized set locked for replay.`;
}

function populateSynAnt() {
  const rows = document.getElementById('syn-rows');
  rows.innerHTML = '';
  roomMap.synAnt.dataset.targets.forEach((target) => {
    const field = document.createElement('div');
    field.className = 'field';
    field.innerHTML = `
      <label>Word: ${target.word}</label>
      <input type="text" name="${target.word}-syn" placeholder="Synonym (e.g., ${target.examples.syn})" />
      <input type="text" name="${target.word}-ant" placeholder="Antonym (e.g., ${target.examples.ant})" />
    `;
    rows.appendChild(field);
  });
  document.getElementById('syn-inline-hint').textContent = roomMap.synAnt.objective;
  if (synMicrocopy) synMicrocopy.textContent = `Tier: ${roomMap.synAnt.dataset.tier || 'core'} · Provide grade-appropriate pairs to boost mastery.`;
}

function populateStory() {
  const requirementList = document.getElementById('story-requirements');
  requirementList.innerHTML = '';
  roomMap.story.dataset.constraints.forEach((constraint) => {
    const chip = document.createElement('div');
    chip.className = 'requirement-chip';
    chip.dataset.key = constraint;
    chip.dataset.met = 'false';
    chip.innerHTML = `<span>⬜</span><span>${constraint}</span>`;
    requirementList.appendChild(chip);
  });
  document.getElementById('simile-bank').textContent = roomMap.story.dataset.simileBank.join(' • ');
  if (storyChecklist) storyChecklist.textContent = 'Rubric preview: cover all constraints and stay within 4–5 sentences.';
  if (storyMicrocopy) storyMicrocopy.textContent = 'Hints cost an attempt; rubric reveals activate in teacher mode.';
}

function populateTeacherCards() {
  document.querySelectorAll('.teacher-card').forEach((card) => {
    const roomId = card.dataset.room;
    const room = roomMap[roomId];
    if (!room) return;
    const { teacher } = room;
    const expectedList =
      teacher.expected && typeof teacher.expected === 'object'
        ? Object.values(teacher.expected).join('<br>')
        : teacher.expected;
    card.innerHTML = `
      <strong>Teacher mode: ${room.title}</strong><br>
      <em>Expected:</em> ${expectedList}<br>
      <em>Rationale:</em> ${teacher.rationale}
    `;
  });
}

function setChoiceSelection(clueId, value) {
  document
    .querySelectorAll(`.choice[data-clue="${clueId}"]`)
    .forEach((btn) => {
      btn.dataset.selected = btn.dataset.value === value ? 'true' : 'false';
    });
}

function setupChoiceHandlers() {
  document.querySelectorAll('.choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      setChoiceSelection(btn.dataset.clue, btn.dataset.value);
    });
  });
}

function validateVocabulary(formData) {
  const answers = {};
  const missing = [];
  roomMap.vocab.dataset.words.forEach((def) => {
    const value = formData.get(def.id);
    if (!value) missing.push(def.id);
    answers[def.id] = value;
  });
  if (missing.length) {
    setFeedback('Choose a match for every word before checking.', 'error');
    recordAttempt('vocab', 'incomplete');
    return null;
  }
  document.querySelectorAll('#vocab-rows .match-row').forEach((row) => {
    row.dataset.correct = '';
  });
  const correctCount = roomMap.vocab.dataset.words.filter((def) => answers[def.id] === def.id).length;
  const isCorrect = correctCount === roomMap.vocab.dataset.words.length;
  const mastery = correctCount / roomMap.vocab.dataset.words.length;
  setMastery('vocab', mastery, mastery === 1 ? 'Perfect match set.' : 'Keep refining the pairs.');
  if (!isCorrect) {
    document.querySelectorAll('#vocab-rows .match-row').forEach((row) => {
      const select = row.querySelector('select');
      const chosen = select?.value;
      const key = select?.name;
      if (!key) return;
      if (chosen !== key) {
        row.dataset.correct = 'false';
        const hint = roomMap.vocab.dataset.words.find((word) => word.id === key)?.definition || '';
        row.querySelector('.definition').setAttribute('aria-label', `Incorrect match. Hint: ${hint}`);
      } else {
        row.dataset.correct = 'true';
      }
    });
    setFeedback('Close! Re-read the bank—highlighted rows are mismatched. Use the hints to adjust.', 'error');
    recordMiss('vocab');
    recordWrongCode('vocab', 'mismatch');
    return null;
  }
  setFeedback('Vault unlocked! You matched every word correctly.', 'success');
  awardBadge('Vocabulary Pro');
  recordAttempt('vocab', 'success');
  return answers;
}

function validateGrammar(value) {
  const cleaned = value.trim();
  if (!cleaned) {
    setFeedback('Write your corrected sentence to continue.', 'error');
    recordAttempt('grammar', 'incomplete');
    return null;
  }
  const exemplar = roomMap.grammar.dataset.exemplar.toLowerCase();
  const lower = cleaned.toLowerCase();
  const hasBecause = lower.includes('because');
  const startsWithCap = /^[A-Z]/.test(cleaned.trim());
  const punctuation = /[.!?]$/.test(cleaned);
  const verbFixed = lower.includes('hurried') || lower.includes('did not');
  const clueFixed = lower.includes('was hidden') || lower.includes('was weak');
  const rubricHits = [startsWithCap, punctuation, verbFixed, clueFixed, hasBecause];
  const mastery = rubricHits.filter(Boolean).length / rubricHits.length;
  setMastery('grammar', mastery, `Rubric coverage: ${Math.round(mastery * 100)}%.`);
  updateGrammarChecklist({ startsWithCap, punctuation, verbFixed, clueFixed, hasBecause });

  if (hasBecause && startsWithCap && punctuation && verbFixed && clueFixed) {
    setFeedback('Case closed! Your sentence is clear and correct.', 'success');
    awardBadge('Grammar Fixer');
    recordAttempt('grammar', 'success');
    return cleaned;
  }
  const targeted = [];
  if (!startsWithCap) targeted.push('Capitalize the first word.');
  if (!punctuation) targeted.push('Add an ending period.');
  if (!verbFixed) targeted.push('Tense check: “hurried” / “was”.');
  if (!clueFixed) targeted.push('Keep the clue clause past tense.');
  if (!hasBecause) targeted.push('Keep “because” to show cause and effect.');
  const hint = grammarHintSpent
    ? targeted.join(' ')
    : `Hint: ${targeted.join(' ')} Exemplar: ${roomMap.grammar.dataset.exemplar}`;
  grammarHintSpent = true;
  recordWrongCode('grammar', targeted[0] || 'general');
  setFeedback(`Almost. ${hint}`, 'error');
  recordMiss('grammar');
  return null;
}

function validateFigurative() {
  const answers = {};
  for (const prompt of roomMap.fig.dataset.prompts) {
    const selected = document.querySelector(`.choice[data-clue="${prompt.id}"][data-selected="true"]`);
    if (!selected) {
      setFeedback('Choose an answer for every clue.', 'error');
      recordAttempt('fig', 'incomplete');
      return null;
    }
    answers[prompt.id] = selected.dataset.value;
  }
  const allCorrect = roomMap.fig.dataset.prompts.every(
    (prompt) => answers[prompt.id] === prompt.answer,
  );
  const mastery = Object.values(answers).filter((ans, idx) => ans === roomMap.fig.dataset.prompts[idx].answer).length /
    roomMap.fig.dataset.prompts.length;
  setMastery('fig', mastery, mastery === 1 ? 'All figurative types nailed.' : 'Revisit clue wording and figurative signals.');
  if (!allCorrect) {
    setFeedback('Not quite. Similes use "like"/"as," metaphors compare directly, personification gives human traits.', 'error');
    recordMiss('fig');
    recordWrongCode('fig', 'type-mismatch');
    return null;
  }
  setFeedback('Lab success! You spotted every figurative clue.', 'success');
  awardBadge('Figurative Sleuth');
  recordAttempt('fig', 'success');
  return answers;
}

function validateSynAnt(formData) {
  const pairs = [];
  let filled = 0;
  for (const { word } of roomMap.synAnt.dataset.targets) {
    const syn = formData.get(`${word}-syn`) || '';
    const ant = formData.get(`${word}-ant`) || '';
    if (!syn.trim() || !ant.trim()) {
      setFeedback('Add both a synonym and antonym for each word.', 'error');
      recordAttempt('synAnt', 'incomplete');
      setMastery('synAnt', filled / roomMap.synAnt.dataset.targets.length, 'Complete each pair to build mastery.');
      return null;
    }
    filled += 1;
    if (syn.toLowerCase() === ant.toLowerCase()) {
      setFeedback('Synonym and antonym should be different ideas.', 'error');
      recordMiss('synAnt');
      recordWrongCode('synAnt', 'same-word');
      return null;
    }
    if (syn.toLowerCase() === word.toLowerCase() || ant.toLowerCase() === word.toLowerCase()) {
      setFeedback('Avoid reusing the target word as the answer—reach for a true synonym/antonym.', 'error');
      recordMiss('synAnt');
      recordWrongCode('synAnt', 'reused-target');
      return null;
    }
    pairs.push({ word, syn: syn.trim(), ant: ant.trim() });
  }
  setFeedback('Arena cleared! Words can flex both ways.', 'success');
  awardBadge('Word Balancer');
  recordAttempt('synAnt', 'success');
  setMastery('synAnt', 1, 'Both synonym and antonym provided.');
  return pairs;
}

function updateStoryChecklist(text) {
  const lower = text.toLowerCase();
  const chips = document.querySelectorAll('.requirement-chip');
  chips.forEach((chip) => {
    const key = chip.dataset.key;
    let met = false;
    if (key === 'forest') met = lower.includes('forest');
    else if (key === 'mysterious sound') met = lower.includes('mysterious sound');
    else if (key === 'reluctant') met = lower.includes('reluctant');
    else if (key === 'simile') met = /\b(as [^.!?]{1,20} as|like [^.!?]{1,25})/i.test(text);
    chip.dataset.met = met.toString();
    chip.firstElementChild.textContent = met ? '✅' : '⬜';
  });
}

function updateGrammarChecklist(flags) {
  if (!grammarChecklist) return;
  const items = [
    { label: 'Capital letter', hit: flags.startsWithCap },
    { label: 'Ending punctuation', hit: flags.punctuation },
    { label: 'Past-tense verbs', hit: flags.verbFixed },
    { label: 'Clue clause past tense', hit: flags.clueFixed },
    { label: 'Because connector', hit: flags.hasBecause },
  ];
  grammarChecklist.innerHTML = items
    .map((item) => `<span class="micro-badge ${item.hit ? 'hit' : 'miss'}">${item.hit ? '✅' : '⬜'} ${item.label}</span>`)
    .join(' ');
}

function validateStory(text) {
  const cleaned = text.trim();
  updateStoryChecklist(cleaned);
  if (!cleaned) {
    setFeedback('Write your story to finish the escape!', 'error');
    recordAttempt('story', 'incomplete');
    return null;
  }
  const lower = cleaned.toLowerCase();
  const hasForest = lower.includes('forest');
  const hasSound = lower.includes('mysterious sound');
  const hasReluctant = lower.includes('reluctant');
  const hasSimile = /\b(as [^.!?]{1,20} as|like [^.!?]{1,25})/i.test(cleaned);
  const sentences = cleaned.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const lengthOkay = sentences.length >= 4 && sentences.length <= 5;
  const rubricHits = [hasForest, hasSound, hasReluctant, hasSimile, lengthOkay];
  const mastery = rubricHits.filter(Boolean).length / rubricHits.length;
  setMastery('story', mastery, mastery === 1 ? 'Ready for badge printing.' : 'Tighten the rubric items to progress.');

  if (hasForest && hasSound && hasReluctant && hasSimile && lengthOkay) {
    setFeedback('Story sealed! Every requirement is shining.', 'success');
    awardBadge('Story Closer');
    recordAttempt('story', 'success');
    confetti();
    return cleaned;
  }
  const hints = [];
  if (!lengthOkay) hints.push('Aim for 4–5 sentences.');
  if (!hasForest) hints.push('Mention a forest.');
  if (!hasSound) hints.push('Include the phrase "mysterious sound."');
  if (!hasReluctant) hints.push('Use the word "reluctant."');
  if (!hasSimile) hints.push('Add a simile using "like" or "as."');
  setFeedback(hints.join(' '), 'error');
  recordMiss('story');
  return null;
}

function completeStage() {
  const finishedStage = state.stage || 1;
  const stageBadge = `Stage ${finishedStage} Champion`;
  awardBadge(stageBadge);
  state.stageAwards = state.stageAwards || [];
  if (!state.stageAwards.includes(stageBadge)) state.stageAwards.push(stageBadge);
  const milestone = stageAwardLabel(finishedStage);
  if (milestone && !state.stageAwards.includes(milestone)) {
    state.stageAwards.push(milestone);
    awardBadge(milestone);
    showToast(`${milestone} earned! Ten stages of grit completed.`);
  }
  state.completed = true;
  saveState();
  showToast(`Stage ${finishedStage} cleared! You're unstoppable.`);
  showWin();
}

function goToNextRoom() {
  if (state.currentRoom < roomsPerStage - 1) {
    showTransition(state.currentRoom + 1);
    state.currentRoom += 1;
    saveState();
    showToast(`Next room unlocked: ${roomMeta[state.currentRoom].title}`);
    setTimeout(() => showRoom(state.currentRoom), 900);
  } else {
    completeStage();
  }
}

function hideTransition() {
  if (transitionHideTimeout) {
    clearTimeout(transitionHideTimeout);
    transitionHideTimeout = null;
  }
  transitionOverlay.classList.add('hidden');
  transitionOverlay.setAttribute('aria-hidden', 'true');
}

function showTransition(nextRoomIndex) {
  const nextRoom = currentCase[nextRoomIndex];
  transitionTitle.textContent = `${nextRoom.title} unlocked`;
  transitionBody.textContent = nextRoom.narrative;
  transitionLabel.textContent = `Moving to Room ${nextRoomIndex + 1}`;
  transitionProgress.style.width = '0%';
  hideTransition();
  transitionOverlay.classList.remove('hidden');
  transitionOverlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    transitionProgress.style.width = '100%';
  }, 80);
  transitionHideTimeout = setTimeout(hideTransition, 1200);
}

function showWin() {
  hideTransition();
  document.querySelectorAll('.card').forEach((card) => card.classList.add('hidden'));
  document.getElementById('win-screen').classList.remove('hidden');
  progressHint.textContent = `Stage ${state.stage} complete`;
  progressText.textContent = `Stage ${state.stage} victory`;
  progressFill.style.width = '100%';
  renderSummary();
  refreshRoomStatus();
  updateStartButtonLabel();
  saveState();
  confetti();
}

function printBadge() {
  window.print();
}

function renderSummary() {
  const summary = document.getElementById('summary');
  const { answers } = state;
  summary.innerHTML = '';
  const badge = document.createElement('div');
  badge.className = 'summary-item';
  const teamLabel = state.player?.team ? ` — Squad: ${state.player.team}` : '';
  badge.innerHTML = `<strong>Badge:</strong> ${state.player?.name || '—'}${teamLabel}`;
  const stage = document.createElement('div');
  stage.className = 'summary-item';
  stage.innerHTML = `<strong>Stage:</strong> ${state.stage} (rooms refresh for the next adventure)`;
  const vocab = document.createElement('div');
  vocab.className = 'summary-item';
  vocab.innerHTML = `<strong>Vocabulary Vault:</strong> ${Object.entries(answers.vocab || {})
    .map(([word, match]) => `${word} → ${match}`)
    .join(', ')}`;

  const grammar = document.createElement('div');
  grammar.className = 'summary-item';
  grammar.innerHTML = `<strong>Grammar Fix:</strong> ${answers.grammar || '—'}`;

  const figurative = document.createElement('div');
  figurative.className = 'summary-item';
  figurative.innerHTML = `<strong>Figurative Language:</strong> ${Object.entries(answers.fig || {})
    .map(([clue, choice]) => `${clue}: ${choice}`)
    .join(', ')}`;

  const pairs = document.createElement('div');
  pairs.className = 'summary-item';
  pairs.innerHTML = '<strong>Synonym–Antonym:</strong> ' +
    (answers.synAnt
      ? answers.synAnt
          .map((p) => `${p.word} (syn: ${p.syn}, ant: ${p.ant})`)
          .join(' | ')
      : '—');

  const story = document.createElement('div');
  story.className = 'summary-item';
  story.innerHTML = `<strong>Story:</strong> ${answers.story || '—'}`;

  [badge, stage, vocab, grammar, figurative, pairs, story].forEach((item) => summary.appendChild(item));
}

function restartGame({ keepPlayer = true, randomizeCase = true, keepStage = true } = {}) {
  const player = keepPlayer ? state.player : { ...defaultState.player };
  const stage = keepStage ? state.stage : defaultState.stage;
  state = {
    ...defaultState,
    player,
    badges: state.badges,
    stageAwards: state.stageAwards,
    stage,
    caseSeed: randomizeCase ? Date.now() : state.caseSeed,
    caseData: randomizeCase ? null : state.caseData,
  };
  buildCase({ randomize: randomizeCase });
  hydrateContent();
  setFeedback('Progress cleared. You are back at Room 1.', 'info');
  showRoom(0);
  saveState();
}

function startNextStage() {
  const nextStage = (state.stage || 1) + 1;
  restartGame({ keepPlayer: true, randomizeCase: true, keepStage: false });
  state.stage = nextStage;
  state.completed = false;
  saveState();
  showRoom(0);
  showToast(`Stage ${nextStage} loaded! Keep shining.`);
  setFeedback(`Stage ${nextStage} is ready. You've got this!`, 'success');
  updateStartButtonLabel();
  refreshRoomStatus();
}

function roomStateForIndex(index) {
  if (state.completed) return 'done';
  if (state.answers?.[answerKeys[index]]) return 'done';
  if (state.currentRoom === index) return 'active';
  if (state.unlockedRooms.includes(index)) return 'active';
  return state.currentRoom > index ? 'done' : 'locked';
}

function renderRoomStatus() {
  roomStatus.innerHTML = roomMeta
    .map((room, idx) => {
      const roomState = roomStateForIndex(idx);
      const label = roomState === 'done' ? 'Cleared' : roomState === 'active' ? 'In progress' : 'Locked';
      return `
        <div class="room-chip" data-state="${roomState}">
          <div class="chip-label">
            <span>${idx + 1}. ${room.title}</span>
          </div>
          <span class="chip-pill ${roomState}">${label}</span>
        </div>
      `;
    })
    .join('');
}

function refreshStatusLine() {
  if (state.completed) {
    statusLine.textContent = `${playerGreeting()}, Stage ${state.stage} is cleared! Claim your badge or launch Stage ${state.stage + 1}.`;
    statusLine.className = 'status-line';
    return;
  }
  const currentRoom = roomMeta[state.currentRoom];
  statusLine.textContent = `${playerGreeting()}, now playing Stage ${state.stage}, Room ${state.currentRoom + 1}: ${currentRoom.title} (${currentRoom.tag}).`;
  statusLine.className = 'status-line';
}

function renderRoomMap() {
  if (!roomMapList) return;
  const renderButton = (idx, room, includeCopy = false) => {
    const stateLabel = roomStateForIndex(idx);
    const disabled = stateLabel === 'locked';
    const ariaLock = disabled ? 'Locked' : 'Open';
    const mastery = Math.round((state.mastery[answerKeys[idx]] || 0) * 100);
    const copy = includeCopy
      ? `<p class="accordion-copy">${room.narrative}</p><p class="accordion-copy">Status: ${stateLabel === 'done' ? 'Cleared' : stateLabel === 'active' ? 'Active' : 'Locked'} · Mastery ${mastery}%</p>`
      : '';
    return `
      <button class="map-node" data-room-index="${idx}" ${disabled ? 'disabled' : ''} aria-label="${ariaLock} room ${idx + 1} ${room.title}">
        <span class="map-title">${idx + 1}. ${room.tag}</span>
        <span class="chip-pill ${stateLabel}">${stateLabel === 'done' ? 'Cleared' : stateLabel === 'active' ? 'Active' : 'Locked'}</span>
        ${includeCopy ? `<span class="chip-pill tier">${room.dataset?.tier || 'core'}</span>` : ''}
      </button>
      ${copy}
    `;
  };
  roomMapList.innerHTML = roomMeta.map((room, idx) => renderButton(idx, room)).join('');
  if (accordionBody) {
    accordionBody.innerHTML = roomMeta
      .map(
        (room, idx) => `
          <div class="accordion-row" data-state="${roomStateForIndex(idx)}">
            ${renderButton(idx, room, true)}
          </div>
        `,
      )
      .join('');
  }
  document.querySelectorAll('.map-node').forEach((node) => {
    node.addEventListener('click', () => {
      const idx = Number(node.dataset.roomIndex);
      if (roomStateForIndex(idx) === 'locked') return;
      const target = idx <= state.currentRoom ? idx : state.currentRoom;
      showRoom(target);
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function renderMapSummary() {
  if (!roomMapSummary) return;
  const cleared = answerKeys.filter((key) => state.answers?.[key]).length;
  const label = state.completed
    ? `Stage ${state.stage} cleared!`
    : `${cleared}/${roomsPerStage} rooms cleared in Stage ${state.stage}. Locked rooms stay hidden until you finish the current one.`;
  roomMapSummary.textContent = label;
}

function refreshRoomStatus() {
  renderRoomStatus();
  renderRoomMap();
  renderMapSummary();
  renderTeacherDashboard();
  refreshStatusLine();
}

function hydratePlayerForm() {
  if (!playerNameField || !playerTeamField) return;
  playerNameField.value = state.player?.name || '';
  playerTeamField.value = state.player?.team || '';
  updateStartButtonLabel();
}

function hydrateAnswers() {
  if (!state.answers) return;
  const { vocab, grammar, fig, synAnt, story } = state.answers;
  if (vocab) {
    const form = document.getElementById('vocab-form');
    Object.entries(vocab).forEach(([word, match]) => {
      const field = form.elements[word];
      if (field) field.value = match;
    });
  }
  if (grammar) {
    document.getElementById('grammar-input').value = grammar;
  }
  if (fig) {
    Object.entries(fig).forEach(([clue, choice]) => setChoiceSelection(clue, choice));
  }
  if (synAnt) {
    const form = document.getElementById('syn-ant-form');
    synAnt.forEach((pair) => {
      if (form.elements[`${pair.word}-syn`]) form.elements[`${pair.word}-syn`].value = pair.syn;
      if (form.elements[`${pair.word}-ant`]) form.elements[`${pair.word}-ant`].value = pair.ant;
    });
  }
  if (story) {
    document.getElementById('story-input').value = story;
    updateStoryChecklist(story);
  }
}

function awardBadge(label) {
  if (state.badges.includes(label)) return;
  state.badges.push(label);
  renderBadges();
  saveState();
}

function renderBadges() {
  badgeShelf.innerHTML = state.badges
    .map((badge) => `<span class="micro-badge">${badge}</span>`)
    .join('');
}

function recordHint(roomId, code = 'general') {
  state.telemetry.hints[roomId] = (state.telemetry.hints[roomId] || 0) + 1;
  recordWrongCode(roomId, `hint-${code}`);
}

function recordWrongCode(roomId, code) {
  state.telemetry.wrongCodes[roomId] = state.telemetry.wrongCodes[roomId] || [];
  state.telemetry.wrongCodes[roomId].push(code);
  saveState();
}

function recordAttempt(roomId, outcome) {
  const start = roomStartTime;
  const duration = start ? Math.round((Date.now() - start) / 1000) : null;
  state.telemetry.attempts[roomId] = (state.telemetry.attempts[roomId] || 0) + 1;
  if (duration !== null) {
    state.telemetry.durations[roomId] = state.telemetry.durations[roomId] || [];
    state.telemetry.durations[roomId].push(duration);
    state.telemetry.timeOnTask[roomId] = (state.telemetry.timeOnTask[roomId] || 0) + duration;
  }
  saveState();
  updateTelemetryReadout();
}

function recordMiss(roomId) {
  state.telemetry.misses[roomId] = (state.telemetry.misses[roomId] || 0) + 1;
  recordAttempt(roomId, 'miss');
}

function recordClear(roomId) {
  const start = roomStartTime;
  const duration = start ? Math.round((Date.now() - start) / 1000) : null;
  if (duration !== null) {
    state.telemetry.clearTimes[roomId] = state.telemetry.clearTimes[roomId] || [];
    state.telemetry.clearTimes[roomId].push(duration);
  }
  state.mastery[roomId] = 1;
  celebrateRoom(roomId);
  saveState();
  updateTelemetryReadout();
}

function updateTelemetryReadout() {
  const { attempts, durations, misses, clearTimes } = state.telemetry;
  const lines = Object.keys(attempts).map((roomId) => {
    const tries = attempts[roomId];
    const missCount = misses[roomId] || 0;
    const times = durations[roomId] || [];
    const avg = times.length ? `${Math.round(times.reduce((a, b) => a + b, 0) / times.length)}s avg` : '—';
    const clears = clearTimes[roomId] || [];
    const clearAvg = clears.length
      ? `${Math.round(clears.reduce((a, b) => a + b, 0) / clears.length)}s to clear`
      : '— to clear';
    const hintCount = state.telemetry.hints[roomId] || 0;
    const timeOnTask = state.telemetry.timeOnTask[roomId] || 0;
    return `${roomMap[roomId]?.title || roomId}: ${tries} attempts, ${missCount} misses, ${avg}, ${clearAvg}, hints: ${hintCount}, time: ${timeOnTask}s`;
  });
  telemetryReadout.textContent = lines.join('\n');
  renderSummaryPanel();
}


function renderSummaryPanel() {
  if (!summaryReadout) return;
  const filter = filterRoom?.value || 'all';
  const records = answerKeys
    .filter((key, idx) => filter === 'all' || Number(filter) === idx)
    .map((key, idx) => {
      const tries = state.telemetry.attempts[key] || 0;
      const misses = state.telemetry.misses[key] || 0;
      const hintCount = state.telemetry.hints[key] || 0;
      const wrong = (state.telemetry.wrongCodes[key] || []).slice(-2).join(', ');
      const time = state.telemetry.timeOnTask[key] || 0;
      const risk = misses > tries / 2 ? 'trend-red' : 'trend-green';
      return `<div class="roster-row ${risk}"><span>${idx + 1}. ${roomMeta[idx].title}</span><span>${tries} attempts · ${misses} misses · ${hintCount} hints · ${time}s · codes: ${wrong || '—'}</span></div>`;
    })
    .join('');
  summaryReadout.innerHTML = records || 'No attempts yet. Play to populate insights.';
}

function exportTelemetry() {
  const payload = {
    version: gameData.version,
    player: { team: state.player.team || 'anonymous', name: state.player.name || 'anonymous' },
    telemetry: state.telemetry,
    mastery: state.mastery,
    filters: {
      squad: filterSquad?.value || '',
      room: filterRoom?.value || 'all',
      date: filterDate?.value || new Date().toISOString().split('T')[0],
    },
    timestamp: new Date().toISOString(),
  };
  const text = JSON.stringify(payload, null, 2);
  navigator.clipboard?.writeText(text).catch(() => {});
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'keyville-telemetry.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  setFeedback('Telemetry exported. Clipboard + download ready.', 'success');
}

function exportTelemetryCsv() {
  const headers = ['room', 'attempts', 'misses', 'avg_duration_s', 'avg_clear_s', 'hints', 'time_on_task'];
  const lines = [headers.join(',')];
  answerKeys.forEach((key) => {
    const attempts = state.telemetry.attempts[key] || 0;
    const misses = state.telemetry.misses[key] || 0;
    const durations = state.telemetry.durations[key] || [];
    const clears = state.telemetry.clearTimes[key] || [];
    const hints = state.telemetry.hints[key] || 0;
    const timeOnTask = state.telemetry.timeOnTask[key] || 0;
    const avgDur = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : '';
    const avgClear = clears.length
      ? Math.round(clears.reduce((a, b) => a + b, 0) / clears.length)
      : '';
    lines.push([key, attempts, misses, avgDur, avgClear, hints, timeOnTask].join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'keyville-telemetry.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  setFeedback('CSV exported for teacher dashboard.', 'success');
}

function renderTeacherDashboard() {
  if (!teacherRoster) return;
  const rows = roomMeta
    .map((room, idx) => {
      const key = answerKeys[idx];
      const attempts = state.telemetry.attempts[key] || 0;
      const misses = state.telemetry.misses[key] || 0;
      const clears = state.telemetry.clearTimes[key] || [];
      const hintCount = state.telemetry.hints[key] || 0;
      const clearAvg = clears.length
        ? `${Math.round(clears.reduce((a, b) => a + b, 0) / clears.length)}s`
        : '—';
      return `<div class="roster-row"><span>${idx + 1}. ${room.title}</span><span>${attempts} tries · ${misses} misses · ${hintCount} hints · ${clearAvg} to clear</span></div>`;
    })
    .join('');
  const rosterLabel = state.player.team
    ? `${state.player.team} — ${state.player.name || 'Detective'}`
    : state.player.name || 'Detective';
  teacherRoster.innerHTML = `<p class="eyebrow">Current badge</p><p class="teacher-label">${rosterLabel || 'Not set'}</p>${rows}`;
}

function unlockRoomAt(index) {
  if (index < 0 || index > roomsPerStage - 1) return;
  state.unlockedRooms = Array.from(new Set([...state.unlockedRooms, index]));
  state.currentRoom = index;
  saveState();
  refreshRoomStatus();
  showRoom(index);
  setFeedback(`Teacher override: Room ${index + 1} unlocked.`, 'info');
}

function hydrateContent() {
  document.getElementById('vocab-objective').textContent = roomMap.vocab.objective;
  document.getElementById('grammar-objective').textContent = roomMap.grammar.objective;
  document.getElementById('grammar-flawed').textContent = roomMap.grammar.dataset.flawed;
  if (grammarExample) grammarExample.textContent = `Exemplar format: ${roomMap.grammar.dataset.exemplar}`;
  if (grammarChecklist) grammarChecklist.textContent = 'Rubric: capitalization, verb tense, cause-effect connector, end punctuation.';
  document.getElementById('fig-objective').textContent = roomMap.fig.objective;
  document.getElementById('syn-objective').textContent = roomMap.synAnt.objective;
  document.getElementById('story-objective').textContent = roomMap.story.objective;
  populateVocabulary();
  populateFigurative();
  populateSynAnt();
  populateStory();
  populateTeacherCards();
  setupChoiceHandlers();
  renderBadges();
  hydrateAnswers();
  updateTelemetryReadout();
}

function toggleTeacherMode() {
  document.body.classList.toggle('teacher-mode');
}

function setupEvents() {
  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = playerNameField.value.trim();
    const team = playerTeamField.value.trim();
    if (!name) {
      setFeedback('Add a code name to personalize your badge.', 'error');
      playerNameField.focus();
      return;
    }
    state.player = { name, team };
    setFeedback(`Badge saved! Welcome, ${playerGreeting()}.`, 'success');
    refreshStatusLine();
    updateStartButtonLabel();
    saveState();
  });

  if (practiceButton) {
    practiceButton.addEventListener('click', () => {
      state.practiceMode = true;
      showToast('Demo run enabled: progress will not overwrite roster data.');
    });
  }

  startButton.addEventListener('click', () => {
    if (state.audioEnabled) {
      startAmbient();
    }
    if (state.completed) {
      startNextStage();
    } else {
      showRoom(state.currentRoom);
      const targetId = `room-${state.currentRoom}`;
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  resetButton.addEventListener('click', () => {
    restartGame({ keepPlayer: true, randomizeCase: true });
    updateStartButtonLabel();
  });

  newCaseButton.addEventListener('click', () => {
    restartGame({ keepPlayer: true, randomizeCase: true });
  });

  document.getElementById('vocab-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = validateVocabulary(formData);
    if (result) {
      state.answers.vocab = result;
      saveState();
      recordClear('vocab');
      goToNextRoom();
    }
  });

  document.querySelectorAll('#vocab-form select').forEach((select) => {
    select.addEventListener('change', updateVocabCheckState);
  });

  document.getElementById('grammar-check').addEventListener('click', () => {
    const value = document.getElementById('grammar-input').value;
    const result = validateGrammar(value);
    if (result) {
      state.answers.grammar = result;
      saveState();
      recordClear('grammar');
      goToNextRoom();
    }
  });

  document.getElementById('grammar-input').addEventListener('input', () => {
    grammarHintSpent = false;
  });

  if (grammarHintButton) {
    grammarHintButton.addEventListener('click', () => {
      const exemplar = roomMap.grammar.dataset.exemplar;
      grammarHintSpent = true;
      setFeedback(`Hint unlocked: Start with a capital letter, keep the comma after the opener if needed, and match the exemplar style: ${exemplar}`, 'info');
      recordHint('grammar', 'general');
      recordAttempt('grammar', 'hint');
    });
  }

  document.getElementById('figurative-check').addEventListener('click', () => {
    const result = validateFigurative();
    if (result) {
      state.answers.fig = result;
      saveState();
      recordClear('fig');
      goToNextRoom();
    }
  });

  document.getElementById('syn-ant-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = validateSynAnt(formData);
    if (result) {
      state.answers.synAnt = result;
      saveState();
      recordClear('synAnt');
      goToNextRoom();
    }
  });

  document.getElementById('story-input').addEventListener('input', (e) => {
    updateStoryChecklist(e.target.value);
  });

  document.getElementById('story-submit').addEventListener('click', () => {
    const text = document.getElementById('story-input').value;
    const result = validateStory(text);
    if (result) {
      state.answers.story = result;
      saveState();
      recordClear('story');
      goToNextRoom();
    }
  });

  if (nextStageButton) {
    nextStageButton.addEventListener('click', startNextStage);
  }

  document.getElementById('restart').addEventListener('click', restartGame);
  document.getElementById('print-badge').addEventListener('click', printBadge);
  teacherToggle.addEventListener('click', toggleTeacherMode);
  exportTelemetryButton.addEventListener('click', exportTelemetry);
  document.getElementById('export-telemetry-csv')?.addEventListener('click', exportTelemetryCsv);
  if (classSummary) classSummary.addEventListener('click', renderSummaryPanel);
  if (filterRoom) filterRoom.addEventListener('change', renderSummaryPanel);
  if (filterSquad) filterSquad.addEventListener('input', renderSummaryPanel);
  if (filterDate) filterDate.addEventListener('change', renderSummaryPanel);

  if (highContrastToggle) {
    highContrastToggle.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      highContrastToggle.setAttribute(
        'aria-pressed',
        document.body.classList.contains('high-contrast').toString(),
      );
    });
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      state.audioEnabled = !state.audioEnabled;
      audioToggle.setAttribute('aria-pressed', state.audioEnabled.toString());
      if (state.audioEnabled) {
        startAmbient();
      } else {
        stopAmbient();
      }
      saveState();
      audioToggle.textContent = state.audioEnabled ? 'Ambient audio: On' : 'Ambient audio';
    });
  }

  if (unlockControls) {
    unlockControls.addEventListener('change', (e) => {
      const idx = Number(e.target.value);
      if (!Number.isNaN(idx)) unlockRoomAt(idx);
    });
  }

  if (resetRoomButton) {
    resetRoomButton.addEventListener('click', () => {
      const key = answerKeys[state.currentRoom];
      delete state.answers[key];
      state.mastery[key] = 0;
      saveState();
      hydrateContent();
      setFeedback('Active room reset for retake.', 'info');
    });
  }

  if (transitionOverlay) {
    transitionOverlay.addEventListener('click', (event) => {
      if (event.target === transitionOverlay) hideTransition();
    });
  }

  if (transitionClose) {
    transitionClose.addEventListener('click', hideTransition);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !transitionOverlay.classList.contains('hidden')) {
      hideTransition();
    }
  });
}

function init() {
  buildCase();
  hydrateContent();
  hydratePlayerForm();
  refreshRoomStatus();
  if (state.audioEnabled) {
    audioToggle?.setAttribute('aria-pressed', 'true');
    audioToggle.textContent = 'Ambient audio: On';
    startAmbient();
  }
  if (state.completed) {
    showWin();
  } else {
    showRoom(state.currentRoom);
  }
  setupEvents();
}

document.addEventListener('DOMContentLoaded', init);
