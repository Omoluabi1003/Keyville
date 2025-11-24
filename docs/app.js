const telemetryKey = 'lexicon-detective-telemetry';
const stateKey = 'lexicon-detective-state';

const defaultState = {
  currentRoom: 0,
  completed: false,
  answers: {},
  player: { name: '', team: '' },
  badges: [],
  caseSeed: null,
  caseData: null,
  telemetry: {
    attempts: {},
    durations: {},
    misses: {},
    clearTimes: {},
  },
  unlockedRooms: [],
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
const toastContainer = document.getElementById('toast-container');
const progressPercent = document.getElementById('progress-percent');
const roomMapList = document.getElementById('room-map');
const highContrastToggle = document.getElementById('contrast-toggle');
const grammarExample = document.getElementById('grammar-example');
const grammarHintButton = document.getElementById('grammar-hint');
const teacherDashboard = document.getElementById('teacher-dashboard');
const teacherRoster = document.getElementById('teacher-roster');
const unlockControls = document.getElementById('unlock-controls');
const roomMapSummary = document.getElementById('room-map-summary');

const answerKeys = ['vocab', 'grammar', 'fig', 'synAnt', 'story'];
let currentCase = null;
let roomMeta = [];
let roomMap = {};
let state = loadState();
let roomStartTime = null;
let audioContext = null;
let grammarHintSpent = false;

function loadState() {
  const stored = localStorage.getItem(stateKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        ...defaultState,
        ...parsed,
        answers: parsed.answers || {},
        player: { ...defaultState.player, ...(parsed.player || {}) },
        badges: parsed.badges || [],
        caseData: parsed.caseData || null,
        telemetry: { ...defaultState.telemetry, ...(parsed.telemetry || {}) },
      };
    } catch (e) {
      console.warn('Resetting state due to parse error');
    }
  }
  return { ...defaultState };
}

function saveState() {
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
  rooms.find((r) => r.id === 'vocab').dataset.words = vocabSet;
  rooms.find((r) => r.id === 'grammar').dataset = grammarSet;
  rooms.find((r) => r.id === 'fig').dataset.prompts = figSet;
  rooms.find((r) => r.id === 'synAnt').dataset.targets = synSet;
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
  const roomLabel = state.completed ? 'Replay from Room 1' : `Room ${state.currentRoom + 1}`;
  startButton.textContent = state.completed ? 'Replay the escape' : `Start / Resume: ${roomLabel}`;
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

function confetti() {
  const colors = ['#7c3aed', '#22c55e', '#facc15', '#38bdf8'];
  for (let i = 0; i < 18; i += 1) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1900);
  }
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

function showRoom(index) {
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
  const progressRatio = (state.completed
    ? 5
    : Math.max(allowedIndex, Object.keys(state.answers).length)) / 5;
  progressHint.textContent = roomMeta[allowedIndex]?.title || 'CLO Achieved';
  progressText.textContent = `Room ${allowedIndex + 1} of 5`;
  progressFill.style.width = `${progressRatio * 100}%`;
  if (progressPercent) {
    progressPercent.textContent = `${Math.round(progressRatio * 100)}% complete`;
  }
  refreshRoomStatus();
  updateStartButtonLabel();
  roomStartTime = Date.now();
  saveState();
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
  const isCorrect = roomMap.vocab.dataset.words.every((def) => answers[def.id] === def.id);
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

  if (hasBecause && startsWithCap && punctuation && verbFixed && clueFixed) {
    setFeedback('Case closed! Your sentence is clear and correct.', 'success');
    awardBadge('Grammar Fixer');
    recordAttempt('grammar', 'success');
    return cleaned;
  }
  const hint = grammarHintSpent
    ? ''
    : `Hint: Start with a capital letter, keep "because" for cause/effect, and finish with punctuation. Try: ${roomMap.grammar.dataset.exemplar}`;
  grammarHintSpent = true;
  setFeedback(`Almost. Check capitalization, verb tense, and the cause-and-effect connector. ${hint}`, 'error');
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
  if (!allCorrect) {
    setFeedback('Not quite. Similes use "like"/"as," metaphors compare directly, personification gives human traits.', 'error');
    recordMiss('fig');
    return null;
  }
  setFeedback('Lab success! You spotted every figurative clue.', 'success');
  awardBadge('Figurative Sleuth');
  recordAttempt('fig', 'success');
  return answers;
}

function validateSynAnt(formData) {
  const pairs = [];
  for (const { word } of roomMap.synAnt.dataset.targets) {
    const syn = formData.get(`${word}-syn`) || '';
    const ant = formData.get(`${word}-ant`) || '';
    if (!syn.trim() || !ant.trim()) {
      setFeedback('Add both a synonym and antonym for each word.', 'error');
      recordAttempt('synAnt', 'incomplete');
      return null;
    }
    if (syn.toLowerCase() === ant.toLowerCase()) {
      setFeedback('Synonym and antonym should be different ideas.', 'error');
      recordMiss('synAnt');
      return null;
    }
    if (syn.toLowerCase() === word.toLowerCase() || ant.toLowerCase() === word.toLowerCase()) {
      setFeedback('Avoid reusing the target word as the answer—reach for a true synonym/antonym.', 'error');
      recordMiss('synAnt');
      return null;
    }
    pairs.push({ word, syn: syn.trim(), ant: ant.trim() });
  }
  setFeedback('Arena cleared! Words can flex both ways.', 'success');
  awardBadge('Word Balancer');
  recordAttempt('synAnt', 'success');
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

function goToNextRoom() {
  if (state.currentRoom < 4) {
    showTransition(state.currentRoom + 1);
    state.currentRoom += 1;
    saveState();
    showToast(`Next room unlocked: ${roomMeta[state.currentRoom].title}`);
    setTimeout(() => showRoom(state.currentRoom), 900);
  } else {
    state.completed = true;
    showToast('All rooms cleared! Badge unlocked.');
    showWin();
  }
}

function showTransition(nextRoomIndex) {
  const nextRoom = currentCase[nextRoomIndex];
  transitionTitle.textContent = `${nextRoom.title} unlocked`;
  transitionBody.textContent = nextRoom.narrative;
  transitionLabel.textContent = `Moving to Room ${nextRoomIndex + 1}`;
  transitionProgress.style.width = '0%';
  transitionOverlay.classList.remove('hidden');
  setTimeout(() => {
    transitionProgress.style.width = '100%';
  }, 80);
  setTimeout(() => transitionOverlay.classList.add('hidden'), 1200);
}

function showWin() {
  document.querySelectorAll('.card').forEach((card) => card.classList.add('hidden'));
  document.getElementById('win-screen').classList.remove('hidden');
  progressHint.textContent = 'CLO Achieved';
  progressText.textContent = 'Completed';
  progressFill.style.width = '100%';
  renderSummary();
  refreshRoomStatus();
  updateStartButtonLabel();
  saveState();
  confetti();
}

function renderSummary() {
  const summary = document.getElementById('summary');
  const { answers } = state;
  summary.innerHTML = '';
  const badge = document.createElement('div');
  badge.className = 'summary-item';
  const teamLabel = state.player?.team ? ` — Squad: ${state.player.team}` : '';
  badge.innerHTML = `<strong>Badge:</strong> ${state.player?.name || '—'}${teamLabel}`;
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

  [badge, vocab, grammar, figurative, pairs, story].forEach((item) => summary.appendChild(item));
}

function restartGame({ keepPlayer = true, randomizeCase = true } = {}) {
  const player = keepPlayer ? state.player : { ...defaultState.player };
  state = {
    ...defaultState,
    player,
    caseSeed: randomizeCase ? Date.now() : state.caseSeed,
    caseData: randomizeCase ? null : state.caseData,
  };
  buildCase({ randomize: randomizeCase });
  hydrateContent();
  setFeedback('Progress cleared. You are back at Room 1.', 'info');
  showRoom(0);
  saveState();
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
    statusLine.textContent = `${playerGreeting()}, all rooms are cleared! Claim your CLO badge.`;
    statusLine.className = 'status-line';
    return;
  }
  const currentRoom = roomMeta[state.currentRoom];
  statusLine.textContent = `${playerGreeting()}, now playing Room ${state.currentRoom + 1}: ${currentRoom.title} (${currentRoom.tag}).`;
  statusLine.className = 'status-line';
}

function renderRoomMap() {
  if (!roomMapList) return;
  roomMapList.innerHTML = roomMeta
    .map((room, idx) => {
      const stateLabel = roomStateForIndex(idx);
      const disabled = stateLabel === 'locked';
      const ariaLock = disabled ? 'Locked' : 'Open';
      return `
        <button class="map-node" data-room-index="${idx}" ${disabled ? 'disabled' : ''} aria-label="${ariaLock} room ${idx + 1} ${room.title}">
          <span class="map-title">${idx + 1}. ${room.tag}</span>
          <span class="chip-pill ${stateLabel}">${stateLabel === 'done' ? 'Cleared' : stateLabel === 'active' ? 'Active' : 'Locked'}</span>
        </button>
      `;
    })
    .join('');
  roomMapList.querySelectorAll('.map-node').forEach((node) => {
    node.addEventListener('click', () => {
      const idx = Number(node.dataset.roomIndex);
      if (roomStateForIndex(idx) === 'locked') return;
      const target = idx <= state.currentRoom ? idx : state.currentRoom;
      showRoom(target);
    });
  });
}

function renderMapSummary() {
  if (!roomMapSummary) return;
  const cleared = answerKeys.filter((key) => state.answers?.[key]).length;
  const label = state.completed ? 'All rooms cleared!' : `${cleared}/5 rooms cleared. Locked rooms stay hidden until you finish the current one.`;
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

function recordAttempt(roomId, outcome) {
  const start = roomStartTime;
  const duration = start ? Math.round((Date.now() - start) / 1000) : null;
  state.telemetry.attempts[roomId] = (state.telemetry.attempts[roomId] || 0) + 1;
  if (duration !== null) {
    state.telemetry.durations[roomId] = state.telemetry.durations[roomId] || [];
    state.telemetry.durations[roomId].push(duration);
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
    return `${roomMap[roomId]?.title || roomId}: ${tries} attempts, ${missCount} misses, ${avg}, ${clearAvg}`;
  });
  telemetryReadout.textContent = lines.join('\n');
}

function exportTelemetry() {
  const payload = {
    version: gameData.version,
    player: { team: state.player.team || 'anonymous', name: 'redacted' },
    telemetry: state.telemetry,
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

function printBadge() {
  const badgeWindow = window.open('', '_blank', 'width=480,height=640');
  const playerLabel = playerGreeting();
  const template = `
    <style>
      body { font-family: 'Nunito', Arial, sans-serif; background: #0f172a; color: #e5e7eb; padding: 24px; }
      .badge-print { border: 2px solid #22c55e; border-radius: 16px; padding: 20px; text-align: center; background: linear-gradient(140deg, rgba(124,58,237,0.3), rgba(34,197,94,0.3)); }
      h1 { margin: 8px 0; }
      p { margin: 6px 0; }
    </style>
    <div class="badge-print">
      <p class="eyebrow">Chief Language Officer</p>
      <h1>${playerLabel}</h1>
      <p>Keyville Escape — ${new Date().toLocaleDateString()}</p>
      <p>Badge unlocked by clearing all rooms with academic fidelity.</p>
    </div>
  `;
  badgeWindow.document.write(template);
  badgeWindow.document.close();
  badgeWindow.focus();
  badgeWindow.print();
}

function exportTelemetryCsv() {
  const headers = ['room', 'attempts', 'misses', 'avg_duration_s', 'avg_clear_s'];
  const lines = [headers.join(',')];
  answerKeys.forEach((key) => {
    const attempts = state.telemetry.attempts[key] || 0;
    const misses = state.telemetry.misses[key] || 0;
    const durations = state.telemetry.durations[key] || [];
    const clears = state.telemetry.clearTimes[key] || [];
    const avgDur = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : '';
    const avgClear = clears.length
      ? Math.round(clears.reduce((a, b) => a + b, 0) / clears.length)
      : '';
    lines.push([key, attempts, misses, avgDur, avgClear].join(','));
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
      const clearAvg = clears.length
        ? `${Math.round(clears.reduce((a, b) => a + b, 0) / clears.length)}s`
        : '—';
      return `<div class="roster-row"><span>${idx + 1}. ${room.title}</span><span>${attempts} tries · ${misses} misses · ${clearAvg} to clear</span></div>`;
    })
    .join('');
  const rosterLabel = state.player.team
    ? `${state.player.team} — ${state.player.name || 'Detective'}`
    : state.player.name || 'Detective';
  teacherRoster.innerHTML = `<p class="eyebrow">Current badge</p><p class="teacher-label">${rosterLabel || 'Not set'}</p>${rows}`;
}

function unlockRoomAt(index) {
  if (index < 0 || index > 4) return;
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

  startButton.addEventListener('click', () => {
    if (state.completed) {
      showWin();
    } else {
      showRoom(state.currentRoom);
    }
    const targetId = state.completed ? 'win-screen' : `room-${state.currentRoom}`;
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  document.getElementById('restart').addEventListener('click', restartGame);
  document.getElementById('print-badge').addEventListener('click', printBadge);
  teacherToggle.addEventListener('click', toggleTeacherMode);
  exportTelemetryButton.addEventListener('click', exportTelemetry);
  document.getElementById('export-telemetry-csv')?.addEventListener('click', exportTelemetryCsv);
  if (highContrastToggle) {
    highContrastToggle.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      highContrastToggle.setAttribute(
        'aria-pressed',
        document.body.classList.contains('high-contrast').toString(),
      );
    });
  }

  if (unlockControls) {
    unlockControls.addEventListener('change', (e) => {
      const idx = Number(e.target.value);
      if (!Number.isNaN(idx)) unlockRoomAt(idx);
    });
  }
}

function init() {
  buildCase();
  hydrateContent();
  hydratePlayerForm();
  refreshRoomStatus();
  if (state.completed) {
    showWin();
  } else {
    showRoom(state.currentRoom);
  }
  setupEvents();
}

document.addEventListener('DOMContentLoaded', init);
