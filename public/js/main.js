// Game state management
        const gameState = {
            myBoard: Array(10).fill().map(() => Array(10).fill(0)),
            opponentBoard: Array(10).fill().map(() => Array(10).fill(0)),
            myShips: [],
            opponentShips: [],
            currentTurn: 'player',
            gameOver: false,
            questionData: [
                {
                    question: "What is the capital of France?",
                    answers: ["London", "Berlin", "Paris", "Madrid"],
                    correct: 2
                },
                {
                    question: "What is 2 + 2?",
                    answers: ["3", "4", "5", "6"],
                    correct: 1
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
                    correct: 1
                },
                {
                    question: "What is the largest ocean on Earth?",
                    answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
                    correct: 3
                },
                {
                    question: "Who wrote 'Romeo and Juliet'?",
                    answers: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                    correct: 1
                },
                {
                    question: "What is the chemical symbol for water?",
                    answers: ["H2O", "CO2", "NaCl", "O2"],
                    correct: 0
                },
                {
                    question: "How many continents are there?",
                    answers: ["5", "6", "7", "8"],
                    correct: 2
                },
                {
                    question: "What is the square root of 16?",
                    answers: ["2", "4", "8", "16"],
                    correct: 1
                },
                {
                    question: "Which gas do plants absorb from the atmosphere?",
                    answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                    correct: 2
                },
                {
                    question: "What is the smallest prime number?",
                    answers: ["0", "1", "2", "3"],
                    correct: 2
                }
            ]
        };

        // Ship definitions
        const ships = [
            { name: "Carrier", size: 5 },
            { name: "Battleship", size: 4 },
            { name: "Destroyer", size: 3 },
            { name: "Submarine", size: 3 },
            { name: "Patrol", size: 2 }
        ];

        // Initialize the game
        function startGame() {
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
            
            initializeBoards();
            placeShipsRandomly(gameState.opponentBoard, gameState.opponentShips);
            renderBoards();
            
            document.getElementById('status').textContent = 'Your Turn - Click on opponent\'s board to fire!';
        }

        // Initialize both boards
        function initializeBoards() {
            // Clear existing data
            gameState.myBoard = Array(10).fill().map(() => Array(10).fill(0));
            gameState.opponentBoard = Array(10).fill().map(() => Array(10).fill(0));
            gameState.myShips = [];
            gameState.opponentShips = [];
            gameState.currentTurn = 'player';
            gameState.gameOver = false;

            // Place player ships randomly
            placeShipsRandomly(gameState.myBoard, gameState.myShips);
        }

        // Place ships randomly on the board
        function placeShipsRandomly(board, shipsArray) {
            ships.forEach(ship => {
                let placed = false;
                while (!placed) {
                    const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                    const row = Math.floor(Math.random() * 10);
                    const col = Math.floor(Math.random() * 10);

                    if (canPlaceShip(board, row, col, ship.size, direction)) {
                        const shipPositions = [];
                        for (let i = 0; i < ship.size; i++) {
                            const r = direction === 'horizontal' ? row : row + i;
                            const c = direction === 'horizontal' ? col + i : col;
                            board[r][c] = 1; // 1 represents a ship
                            shipPositions.push([r, c]);
                        }
                        
                        shipsArray.push({
                            name: ship.name,
                            size: ship.size,
                            positions: shipPositions,
                            hits: 0
                        });
                        
                        placed = true;
                    }
                }
            });
        }

        // Check if a ship can be placed at the given position
        function canPlaceShip(board, row, col, size, direction) {
            if (direction === 'horizontal') {
                if (col + size > 10) return false;
                for (let i = 0; i < size; i++) {
                    if (board[row][col + i] !== 0) return false;
                }
            } else {
                if (row + size > 10) return false;
                for (let i = 0; i < size; i++) {
                    if (board[row + i][col] !== 0) return false;
                }
            }
            return true;
        }

        // Render both boards
        function renderBoards() {
            renderBoard('myBoard', gameState.myBoard, true);
            renderBoard('opponentBoard', gameState.opponentBoard, false);
        }

        // Render a specific board
        function renderBoard(boardId, board, isMyBoard) {
            const boardElement = document.getElementById(boardId);
            boardElement.innerHTML = '';

            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 10; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.dataset.row = row;
                    cell.dataset.col = col;

                    if (isMyBoard) {
                        if (board[row][col] === 1) {
                            cell.classList.add('ship');
                        }
                    } else {
                        if (board[row][col] === 2) { // Hit
                            cell.classList.add('hit');
                        } else if (board[row][col] === 3) { // Miss
                            cell.classList.add('miss');
                        } else {
                            cell.addEventListener('click', () => handleCellClick(row, col));
                        }
                    }

                    boardElement.appendChild(cell);
                }
            }
        }

        // Handle cell click on opponent's board
        function handleCellClick(row, col) {
            if (gameState.currentTurn !== 'player' || gameState.gameOver) return;
            if (gameState.opponentBoard[row][col] !== 0 && gameState.opponentBoard[row][col] !== 1) return;

            // Get a random question for this cell
            const randomQuestion = gameState.questionData[Math.floor(Math.random() * gameState.questionData.length)];
            
            showQuestionModal(randomQuestion, row, col);
        }

        // Show question modal
        function showQuestionModal(question, row, col) {
            const modal = document.getElementById('questionModal');
            const questionText = document.getElementById('questionText');
            const answersContainer = document.getElementById('answersContainer');

            questionText.textContent = question.question;
            answersContainer.innerHTML = '';

            question.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.textContent = answer;
                button.onclick = () => checkAnswer(answer, index, question.correct, row, col, modal);
                answersContainer.appendChild(button);
            });

            modal.style.display = 'flex';
        }

        // Check if the answer is correct
        function checkAnswer(answer, selectedIndex, correctIndex, row, col, modal) {
            const buttons = document.querySelectorAll('#answersContainer .answer-btn');
            
            buttons.forEach((btn, index) => {
                if (index === correctIndex) {
                    btn.classList.add('correct');
                } else if (index === selectedIndex && index !== correctIndex) {
                    btn.classList.add('incorrect');
                }
                btn.disabled = true;
            });

            setTimeout(() => {
                modal.style.display = 'none';
                
                if (selectedIndex === correctIndex) {
                    // Correct answer - it's a hit
                    gameState.opponentBoard[row][col] = 2; // 2 represents a hit
                    checkShipSunk(gameState.opponentShips, row, col, 'opponent');
                    document.getElementById('status').textContent = 'Hit! Great shot!';
                } else {
                    // Wrong answer - it's a miss
                    gameState.opponentBoard[row][col] = 3; // 3 represents a miss
                    document.getElementById('status').textContent = 'Miss! Try again next turn.';
                }

                renderBoards();
                
                if (!gameState.gameOver) {
                    setTimeout(() => {
                        gameState.currentTurn = 'opponent';
                        document.getElementById('turnInfo').textContent = 'Opponent\'s Turn';
                        document.getElementById('status').textContent = 'Opponent is thinking...';
                        
                        setTimeout(opponentTurn, 1500);
                    }, 1000);
                }
            }, 1500);
        }

        // Check if a ship has been sunk
        function checkShipSunk(shipsArray, row, col, owner) {
            for (let ship of shipsArray) {
                const posIndex = ship.positions.findIndex(pos => pos[0] === row && pos[1] === col);
                if (posIndex !== -1) {
                    ship.hits++;
                    
                    if (ship.hits === ship.size) {
                        document.getElementById('status').textContent = `${owner === 'opponent' ? 'You' : 'Opponent'} sunk the ${ship.name}!`;
                        
                        // Check if all ships are sunk
                        const allSunk = shipsArray.every(s => s.hits === s.size);
                        if (allSunk) {
                            gameState.gameOver = true;
                            document.getElementById('status').textContent = owner === 'opponent' ? 'You Win! 🎉' : 'Opponent Wins! 😢';
                            document.getElementById('turnInfo').textContent = 'Game Over';
                        }
                    }
                    break;
                }
            }
        }

        // Opponent's turn (AI logic)
        function opponentTurn() {
            if (gameState.gameOver) return;
            
            let validMove = false;
            while (!validMove) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                
                if (gameState.myBoard[row][col] === 0 || gameState.myBoard[row][col] === 1) {
                    if (gameState.myBoard[row][col] === 1) {
                        // Hit
                        gameState.myBoard[row][col] = 2;
                        checkShipSunk(gameState.myShips, row, col, 'player');
                        document.getElementById('status').textContent = 'Opponent hit your ship!';
                    } else {
                        // Miss
                        gameState.myBoard[row][col] = 3;
                        document.getElementById('status').textContent = 'Opponent missed!';
                    }
                    
                    validMove = true;
                    renderBoards();
                    
                    if (!gameState.gameOver) {
                        gameState.currentTurn = 'player';
                        document.getElementById('turnInfo').textContent = 'Your Turn';
                        document.getElementById('status').textContent = 'Your Turn - Click on opponent\'s board!';
                    }
                }
            }
        }