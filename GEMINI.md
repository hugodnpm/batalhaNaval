# Project Overview

This project is a browser-based interactive Battleship game. The user plays against an AI opponent. The core gameplay is a classic Battleship game, with an added twist: to successfully land a hit on the opponent's board, the player must correctly answer a multiple-choice question.

The application is structured with separate files for HTML, CSS, and JavaScript, located in the `public` directory.

## Key Features

*   **Classic Battleship Gameplay:** Players place their ships and take turns firing at the opponent's grid.
*   **Interactive Questions:** Each attack prompts a multiple-choice question. A correct answer results in a hit, while an incorrect answer results in a miss.
*   **AI Opponent:** The game includes a simple AI that randomly fires at the player's board.
*   **Responsive Design:** The game interface is designed to work on different screen sizes.
*   **Dynamic UI:** The game board and status messages are updated in real-time using JavaScript.

# Building and Running

This is a simple HTML/CSS/JavaScript application. No build process is required.

To run the game, you can open the `public/index.html` file in a web browser, or start a simple web server in the project's root directory.

```bash
# On most systems, you can open the file directly
open public/index.html
# Or, you can start a simple web server in this directory
python3 -m http.server
```

Then, navigate to `http://localhost:8000/public/` in your web browser.

# Development Conventions

*   **Code Style:** The code is written in plain JavaScript, HTML, and CSS. The JavaScript code is well-structured, with a central `gameState` object managing the application's state.
*   **File Structure:**
    *   `public/index.html`: The main HTML file.
    *   `public/css/style.css`: Contains all the styles for the application.
    *   `public/js/main.js`: Contains all the game logic.
    *   The `docs` directory contains a `prompt_initial.md` file, which is currently empty.
*   **No Dependencies:** The project uses no external libraries or frameworks.
