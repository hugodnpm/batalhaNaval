
// Game state management
        const gameState = {
            opponentBoard: Array(10).fill().map(() => Array(10).fill(0)),
            opponentShips: [],
            gameOver: false,
            usedQuestions: [],
        };

        // Ship definitions
        const ships = [
            { name: "Porta-aviões", size: 5 },
            { name: "Navio de Guerra", size: 4 },
            { name: "Destruidor", size: 3 },
            { name: "Submarino", size: 3 },
            { name: "Patrulha", size: 2 }
        ];

        // Initialize the game
        function startGame() {
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
            
            initializeBoard();
            placeShipsRandomly(gameState.opponentBoard, gameState.opponentShips);
            renderBoard();
            
            document.getElementById('status').textContent = 'Sua vez - Clique no tabuleiro do oponente para atirar!';
        }

        // Initialize the board
        function initializeBoard() {
            // Clear existing data
            gameState.opponentBoard = Array(10).fill().map(() => Array(10).fill(0));
            gameState.opponentShips = [];
            gameState.gameOver = false;
            gameState.usedQuestions = [];
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

        // Render the board
        function renderBoard() {
            const boardElement = document.getElementById('opponentBoard');
            boardElement.innerHTML = '';

            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 10; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.dataset.row = row;
                    cell.dataset.col = col;

                    if (gameState.opponentBoard[row][col] === 2) { // Hit
                        cell.classList.add('hit');
                    } else if (gameState.opponentBoard[row][col] === 3) { // Miss
                        cell.classList.add('miss');
                    } else {
                        cell.addEventListener('click', () => handleCellClick(row, col));
                    }

                    boardElement.appendChild(cell);
                }
            }
        }

        // Handle cell click on opponent's board
        function handleCellClick(row, col) {
            if (gameState.gameOver) return;
            if (gameState.opponentBoard[row][col] === 2 || gameState.opponentBoard[row][col] === 3) return;

            if (gameState.opponentBoard[row][col] === 1) { // It's a ship
                let availableQuestions = questionData.filter((_, index) => !gameState.usedQuestions.includes(index));

                if (availableQuestions.length === 0) {
                    gameState.usedQuestions = [];
                    availableQuestions = questionData;
                }

                const randomIndex = Math.floor(Math.random() * availableQuestions.length);
                const randomQuestion = availableQuestions[randomIndex];
                const originalIndex = questionData.indexOf(randomQuestion);

                gameState.usedQuestions.push(originalIndex);
                
                showQuestionModal(randomQuestion, row, col);
            } else { // It's a miss
                gameState.opponentBoard[row][col] = 3; // 3 represents a miss
                document.getElementById('status').textContent = 'Errou! Tente novamente.';
                renderBoard();
            }
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
                    checkShipSunk(gameState.opponentShips, row, col);
                    document.getElementById('status').textContent = 'Acertou! Ótimo tiro!';
                } else {
                    // Wrong answer - it's a miss
                    gameState.opponentBoard[row][col] = 3; // 3 represents a miss
                    document.getElementById('status').textContent = 'Errou! Tente novamente na próxima vez.';
                }

                renderBoard();
                
            }, 1500);
        }

        // Check if a ship has been sunk
        function checkShipSunk(shipsArray, row, col) {
            for (let ship of shipsArray) {
                const posIndex = ship.positions.findIndex(pos => pos[0] === row && pos[1] === col);
                if (posIndex !== -1) {
                    ship.hits++;
                    
                    if (ship.hits === ship.size) {
                        document.getElementById('status').textContent = `Você afundou o ${ship.name}!`;
                        
                        // Check if all ships are sunk
                        const allSunk = shipsArray.every(s => s.hits === s.size);
                        if (allSunk) {
                            gameState.gameOver = true;
                            document.getElementById('status').textContent = 'Você Venceu! 🎉';
                            document.getElementById('turnInfo').textContent = 'Fim de Jogo';
                        }
                    }
                    break;
                }
            }
        }