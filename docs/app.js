const vocabDefinitions = [
  {
    id: 'elated',
    text: 'Feeling extremely happy and excited',
  },
  {
    id: 'cautious',
    text: 'Acting with care to avoid danger or mistakes',
  },
  {
    id: 'resourceful',
    text: 'Able to solve problems with creative ideas and tools',
  },
  {
    id: 'obstacle',
    text: 'Something that blocks your path or progress',
  },
];

const figurativePrompts = [
  {
    id: 'clue1',
    clue: 'The classroom was a buzzing beehive as projects began.',
    answer: 'metaphor',
  },
  {
    id: 'clue2',
    clue: 'The wind whispered secrets through the tall grass.',
    answer: 'personification',
  },
  {
    id: 'clue3',
    clue: 'Her backpack felt as heavy as a mountain of books.',
    answer: 'simile',
  },
];

const defaultState = {
  currentRoom: 0,
  completed: false,
  answers: {},
};

const stateKey = 'lexicon-detective-state';

const feedbackBox = document.getElementById('feedback');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const progressHint = document.getElementById('progress-hint');

function loadState() {
  const stored = localStorage.getItem(stateKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Resetting state due to parse error');
    }
  }
  return { ...defaultState };
}

let state = loadState();

function saveState() {
  localStorage.setItem(stateKey, JSON.stringify(state));
}

function setFeedback(message, type = 'info') {
  feedbackBox.textContent = message;
  feedbackBox.classList.remove('feedback-error', 'feedback-success');
  if (type === 'error') {
    feedbackBox.classList.add('feedback-error');
  } else if (type === 'success') {
    feedbackBox.classList.add('feedback-success');
  }
}

function showRoom(index) {
  const rooms = document.querySelectorAll('.card');
  rooms.forEach((room, idx) => {
    if (idx === index) {
      room.classList.remove('hidden');
    } else {
      room.classList.add('hidden');
    }
  });
  const hints = [
    'Vocabulary Vault',
    'Grammar Detective Bureau',
    'Figurative Language Lab',
    'Synonym–Antonym Arena',
    'Executive Story Spin',
  ];
  if (index < hints.length) {
    progressHint.textContent = hints[index];
    progressText.textContent = `Room ${index + 1} of 5`;
    progressFill.style.width = `${((index + 1) / 5) * 100}%`;
  }
  saveState();
}

function populateVocabulary() {
  const optionContainer = document.getElementById('definition-options');
  optionContainer.innerHTML = '<strong>Word Bank</strong>: ' +
    vocabDefinitions.map((def) => def.text).join(' • ');

  const selects = document.querySelectorAll('#vocab-form select');
  selects.forEach((select) => {
    vocabDefinitions
      .sort(() => Math.random() - 0.5)
      .forEach((def) => {
        const opt = document.createElement('option');
        opt.value = def.id;
        opt.textContent = def.text;
        select.appendChild(opt);
      });
  });
}

function populateFigurative() {
  const list = document.getElementById('figurative-list');
  list.innerHTML = '';
  figurativePrompts.forEach((item) => {
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
  vocabDefinitions.forEach((def) => {
    const value = formData.get(def.id);
    if (!value) {
      missing.push(def.id);
    }
    answers[def.id] = value;
  });
  if (missing.length) {
    setFeedback('Choose a match for every word before checking.', 'error');
    return null;
  }
  const isCorrect = vocabDefinitions.every((def) => answers[def.id] === def.id);
  if (!isCorrect) {
    setFeedback('Some matches are off. Re-read the definitions and try again!', 'error');
    return null;
  }
  setFeedback('Vault unlocked! You matched every word correctly.', 'success');
  return answers;
}

function validateGrammar(value) {
  const cleaned = value.trim();
  if (!cleaned) {
    setFeedback('Write your corrected sentence to continue.', 'error');
    return null;
  }
  const lower = cleaned.toLowerCase();
  const hasStart = lower.startsWith('the dog waited');
  const hasDoor = lower.includes('by the door');
  const hasReason = lower.includes('because') || lower.includes('since');
  const hasPunctuation = /[.!?]$/.test(cleaned);
  if (hasStart && hasDoor && hasReason && hasPunctuation) {
    setFeedback('Case closed! Your sentence is clear and correct.', 'success');
    return cleaned;
  }
  setFeedback('Check capitalization, verb tense, and a connecting word like "because."', 'error');
  return null;
}

function validateFigurative() {
  const answers = {};
  for (const prompt of figurativePrompts) {
    const selected = document.querySelector(`.choice[data-clue="${prompt.id}"][data-selected="true"]`);
    if (!selected) {
      setFeedback('Choose an answer for every clue.', 'error');
      return null;
    }
    answers[prompt.id] = selected.dataset.value;
  }
  const allCorrect = figurativePrompts.every(
    (prompt) => answers[prompt.id] === prompt.answer,
  );
  if (!allCorrect) {
    setFeedback('Not quite. Remember: similes use "like" or "as," metaphors compare directly, and personification gives objects human traits.', 'error');
    return null;
  }
  setFeedback('Lab success! You spotted every figurative clue.', 'success');
  return answers;
}

function validateSynAnt(formData) {
  const pairs = [
    { word: 'brave', syn: formData.get('brave-syn'), ant: formData.get('brave-ant') },
    { word: 'tiny', syn: formData.get('tiny-syn'), ant: formData.get('tiny-ant') },
  ];
  for (const { word, syn, ant } of pairs) {
    if (!syn.trim() || !ant.trim()) {
      setFeedback('Add both a synonym and antonym for each word.', 'error');
      return null;
    }
    if (syn.toLowerCase() === ant.toLowerCase()) {
      setFeedback('Synonym and antonym should be different ideas.', 'error');
      return null;
    }
  }
  setFeedback('Arena cleared! Words can flex both ways.', 'success');
  return pairs;
}

function validateStory(text) {
  const cleaned = text.trim();
  if (!cleaned) {
    setFeedback('Write your story to finish the escape!', 'error');
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
    return cleaned;
  }
  const hints = [];
  if (!lengthOkay) hints.push('Aim for 4–5 sentences.');
  if (!hasForest) hints.push('Mention a forest.');
  if (!hasSound) hints.push('Include the phrase "mysterious sound."');
  if (!hasReluctant) hints.push('Use the word "reluctant."');
  if (!hasSimile) hints.push('Add a simile using "like" or "as."');
  setFeedback(hints.join(' '), 'error');
  return null;
}

function goToNextRoom() {
  if (state.currentRoom < 4) {
    state.currentRoom += 1;
    saveState();
    showRoom(state.currentRoom);
  } else {
    state.completed = true;
    showWin();
  }
}

function showWin() {
  document.querySelectorAll('.card').forEach((card) => card.classList.add('hidden'));
  document.getElementById('win-screen').classList.remove('hidden');
  progressHint.textContent = 'CLO Achieved';
  progressText.textContent = 'Completed';
  progressFill.style.width = '100%';
  renderSummary();
  saveState();
}

function renderSummary() {
  const summary = document.getElementById('summary');
  const { answers } = state;
  summary.innerHTML = '';
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

  [vocab, grammar, figurative, pairs, story].forEach((item) => summary.appendChild(item));
}

function restartGame() {
  state = { ...defaultState };
  localStorage.removeItem(stateKey);
  setFeedback('New game started! You are back at Room 1.', 'info');
  document.getElementById('win-screen').classList.add('hidden');
  showRoom(0);
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
      form.elements[`${pair.word}-syn`].value = pair.syn;
      form.elements[`${pair.word}-ant`].value = pair.ant;
    });
  }
  if (story) {
    document.getElementById('story-input').value = story;
  }
}

function init() {
  populateVocabulary();
  populateFigurative();
  setupChoiceHandlers();
  hydrateAnswers();
  if (state.completed) {
    showWin();
  } else {
    showRoom(state.currentRoom);
  }

  document.getElementById('vocab-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = validateVocabulary(formData);
    if (result) {
      state.answers.vocab = result;
      saveState();
      goToNextRoom();
    }
  });

  document.getElementById('grammar-check').addEventListener('click', () => {
    const value = document.getElementById('grammar-input').value;
    const result = validateGrammar(value);
    if (result) {
      state.answers.grammar = result;
      saveState();
      goToNextRoom();
    }
  });

  document.getElementById('figurative-check').addEventListener('click', () => {
    const result = validateFigurative();
    if (result) {
      state.answers.fig = result;
      saveState();
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
      goToNextRoom();
    }
  });

  document.getElementById('story-submit').addEventListener('click', () => {
    const text = document.getElementById('story-input').value;
    const result = validateStory(text);
    if (result) {
      state.answers.story = result;
      saveState();
      goToNextRoom();
    }
  });

  document.getElementById('restart').addEventListener('click', restartGame);
}

document.addEventListener('DOMContentLoaded', init);
