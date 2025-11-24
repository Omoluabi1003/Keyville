# Keyville

A lightweight, browser-based language game for 6th graders: **The Lexicon Detective Escape Room**. Solve five rooms of vocabulary, grammar, figurative language, synonyms/antonyms, and storytelling to earn the Chief Language Officer badge.

## Play locally

1. Open `docs/index.html` directly in your browser, or run a simple static server:
   ```bash
   cd docs
   python3 -m http.server 8000
   ```
2. Visit `http://localhost:8000` and continue your saved progress thanks to localStorage.

## GitHub Pages

The site is ready for GitHub Pages. Point your Pages configuration to the `docs/` folder in this repository. After enabling Pages, your game will be available at your repo's Pages URL.

## Notes

- The experience is a single-page app with built-in validation and friendly feedback for each room.
- No external build step or dependencies are required.
