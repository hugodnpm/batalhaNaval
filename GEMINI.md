# Project Overview

This project is a single-file, browser-based interactive Battleship game. The user plays against an AI opponent. The core gameplay is a classic Battleship game, with an added twist: to successfully land a hit on the opponent's board, the player must correctly answer a multiple-choice question.

The entire application is contained within the `index.html` file, which includes the HTML structure, CSS for styling, and JavaScript for all game logic.

## Key Features

*   **Classic Battleship Gameplay:** Players place their ships and take turns firing at the opponent's grid.
*   **Interactive Questions:** Each attack prompts a multiple-choice question. A correct answer results in a hit, while an incorrect answer results in a miss.
*   **AI Opponent:** The game includes a simple AI that randomly fires at the player's board.
*   **Responsive Design:** The game interface is designed to work on different screen sizes.
*   **Dynamic UI:** The game board and status messages are updated in real-time using JavaScript.

# Building and Running

This is a simple HTML/CSS/JavaScript application. No build process is required.

To run the game, simply open the `index.html` file in a web browser.

```bash
# On most systems, you can open the file directly
open index.html
# Or, you can start a simple web server in this directory
python3 -m http.server
```

Then, navigate to `http://localhost:8000` in your web browser.

# Development Conventions

*   **Code Style:** The code is written in plain JavaScript, HTML, and CSS. The JavaScript code is well-structured, with a central `gameState` object managing the application's state.
*   **File Structure:** All code is located in the `index.html` file. The `docs` directory contains a `prompt_initial.md` file, which is currently empty.
*   **No Dependencies:** The project uses no external libraries or frameworks.
