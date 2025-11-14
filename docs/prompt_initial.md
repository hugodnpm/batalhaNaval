Create a complete, responsive web application for an Interactive Battleship game using HTML, CSS, and Vanilla JavaScript. Instead of simply firing at coordinates, each "square" on the opponent's board will contain a multiple-choice question. The player must answer correctly for the "shot" to be considered a hit, revealing the ship's segment.

1. ⚙️ Tech Stack and Structure
Markup: Semantic HTML5 (index.html).

Styling: Pure CSS3 (styles.css) for layout, responsiveness, and visual design. Use CSS Grid for the board structure.

Interactivity/Logic: Vanilla JavaScript (script.js). All game logic, DOM manipulation, and state management must be handled directly in JavaScript.

Data: Ship placement, questions, and answers should be hardcoded within the JavaScript file or stored in a separate data.js file as JavaScript objects/arrays.

2. 🎮 Game Functionality (Business Logic - in script.js)
Boards:

Two 10x10 boards rendered as HTML elements (e.g., <div> or <table> elements styled with CSS Grid/Flexbox): My Board and Opponent's Board.

The game is player vs. simulated AI (simple "shot" logic).

Ships: Define a standard set of ships (e.g., 1 Carrier - 5 spaces, 1 Battleship - 4 spaces, 2 Destroyers - 3 spaces, 1 Submarine - 3 spaces, 1 Patrol - 2 spaces).

Fire and Question Mechanic:

Attach an event listener (click) to each cell of the Opponent's Board.

Upon clicking an un-hit cell, display a Question Modal (a dynamically created/hidden HTML <div> element) containing the question associated with that coordinate.

If the answer is correct, update the cell class to indicate a Hit and end the turn.

If the answer is incorrect, update the cell class to indicate a Miss (Water) and end the turn.

Rules: Alternating turns (Player -> AI -> Player...). The first player to sink all of the opponent's ships wins.

Game State Management: Use a global JavaScript object or class to manage the game state, including:

Ship positions (player and opponent).

Hit/Miss status of all cells on both boards.

Current turn.

Game messages/status.

3. ✨ UX/UI (User Experience and Interface)
3.1. Responsiveness and Layout
Mobile-First Design: The layout must be fully responsive. On small screens (Mobile/Tablet), the boards should stack vertically to ensure readability and easy tapping. Use CSS Media Queries extensively.

Desktop Layout: On large screens, the two boards should be displayed side-by-side (e.g., using CSS Flexbox or Grid).

Board Sizing: The board cells must maintain a perfect square aspect ratio and scale fluidly based on the screen size.

3.2. Visual Feedback and Accessibility (CSS)
Color Palette: Use distinct, high-contrast colors for game elements:

Water (Not Hit): A neutral/light background color.

Water (Miss): A Light Blue/Cyan indicator (e.g., a circle or 'X').

Hit: A prominent Red indicator (e.g., an icon or large dot).

Ship (My Board): A clear, distinct color (e.g., dark gray/green).

Interactivity:

Use the CSS cursor: pointer; property for clickable cells on the Opponent's Board.

Implement a visual hover effect (e.g., subtle color change or border) to indicate interactable cells.

Question Modal:

The modal must have a semi-transparent background overlay to dim the game board.

The answer options should be styled as large, tappable buttons (for mobile UX).

Provide immediate visual feedback when an answer button is clicked (e.g., change the button color to green for correct, red for incorrect) before closing the modal.

3.3. Game Flow (UX)
Game Setup: A simple start screen (or a setup section) with a "Start Game" button and clear instructions.

Status Display: A dedicated area (e.g., <h1> or <div>) to display clear and concise game messages (e.g., "Your Turn", "Opponent Sunk Your Cruiser!").

Error Handling: Ensure the game prevents clicking cells that have already been targeted.

4. 📂 Required Files
The agent must provide the complete code for the following files:

index.html: The main page structure, including all containers for the boards, the status area, and the modal structure.

styles.css: Complete CSS for styling and responsiveness (including all media queries).

script.js: All core game logic, data setup, event listeners, and DOM manipulation functions.

Final Instruction: The code must be clean, well-commented, and structured using functions (JS) and semantic classes (CSS) to reflect the best practices for a school project.


