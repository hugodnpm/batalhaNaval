// Game state management
        const BOARD_SIZE = 5; // Define o tamanho do tabuleiro para 5x5

        const gameState = {
            opponentBoard: Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0)),
            opponentShips: [],
            gameOver: false,
            usedQuestions: [],
            userLives: 3,
            userScore: 0,
            cpuScore: 0,
            playerName: '',
        };

        // Ship definitions
        const ships = [
            { name: "Navio de Guerra", size: 3 },
            { name: "Destruidor", size: 2 },
            { name: "Submarino", size: 1 }
        ];

        // Inicia o jogo (chamado pelo botão "Começar Jogo")
        function startGame() {
            const playerNameInput = document.getElementById('playerName');
            gameState.playerName = playerNameInput.value.trim();

            if (gameState.playerName === '') {
                alert('Por favor, digite seu nome para começar o jogo!');
                return;
            }

            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
            
            restartGame();
        }

        // Reinicia o jogo (chamado pelo botão "Reiniciar Jogo" ou após startGame)
        function restartGame() {
            initializeBoard();
            placeShipsRandomly(gameState.opponentBoard, gameState.opponentShips);
            renderBoard();
            
            document.getElementById('status').textContent = 'Sua vez - Clique no tabuleiro do oponente para atirar!';
            document.getElementById('userName').textContent = gameState.playerName;
        }

        // Inicializa o tabuleiro e o estado do jogo
        function initializeBoard() {
            // Limpa dados existentes
            gameState.opponentBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
            gameState.opponentShips = [];
            gameState.gameOver = false;
            gameState.usedQuestions = [];
            gameState.userLives = 3;
            gameState.userScore = 0;
            gameState.cpuScore = 0;

            document.getElementById('userLives').textContent = gameState.userLives;
            document.getElementById('userScore').textContent = gameState.userScore;
            document.getElementById('cpuScore').textContent = gameState.cpuScore;
        }

        // Posiciona os navios aleatoriamente no tabuleiro
        function placeShipsRandomly(board, shipsArray) {
            shipsArray.length = 0; // Limpa os navios existentes
            ships.forEach(ship => {
                let placed = false;
                while (!placed) {
                    const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                    const row = Math.floor(Math.random() * BOARD_SIZE);
                    const col = Math.floor(Math.random() * BOARD_SIZE);

                    if (canPlaceShip(board, row, col, ship.size, direction)) {
                        const shipPositions = [];
                        for (let i = 0; i < ship.size; i++) {
                            const r = direction === 'horizontal' ? row : row + i;
                            const c = direction === 'horizontal' ? col + i : col;
                            board[r][c] = 1; // 1 representa um navio
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

        // Verifica se um navio pode ser posicionado na posição dada
        function canPlaceShip(board, row, col, size, direction) {
            if (direction === 'horizontal') {
                if (col + size > BOARD_SIZE) return false;
                for (let i = 0; i < size; i++) {
                    if (board[row][col + i] !== 0) return false;
                }
            } else {
                if (row + size > BOARD_SIZE) return false;
                for (let i = 0; i < size; i++) {
                    if (board[row + i][col] !== 0) return false;
                }
            }
            return true;
        }

        // Renderiza o tabuleiro
        function renderBoard() {
            const boardElement = document.getElementById('opponentBoard');
            boardElement.innerHTML = '';

            for (let row = 0; row < BOARD_SIZE; row++) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.dataset.row = row;
                    cell.dataset.col = col;

                    if (gameState.opponentBoard[row][col] === 2) { // Acertou
                        cell.classList.add('hit');
                    } else if (gameState.opponentBoard[row][col] === 3) { // Errou
                        cell.classList.add('miss');
                    } else if (gameState.opponentBoard[row][col] === 4) { // Navio Afundado
                        cell.classList.add('sunk');
                    } else {
                        cell.addEventListener('click', () => handleCellClick(row, col));
                    }

                    boardElement.appendChild(cell);
                }
            }
        }

        // Lida com o clique na célula do tabuleiro do oponente
        function handleCellClick(row, col) {
            if (gameState.gameOver) return;
            if (gameState.opponentBoard[row][col] === 2 || gameState.opponentBoard[row][col] === 3 || gameState.opponentBoard[row][col] === 4) return;

            if (gameState.opponentBoard[row][col] === 1) { // É um navio
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
            } else { // É água (erro)
                gameState.opponentBoard[row][col] = 3; // 3 representa um erro
                document.getElementById('status').textContent = 'Errou! Tente novamente.';
                renderBoard();
            }
        }

        // Mostra o modal da pergunta
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

        // Verifica se a resposta está correta
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
                    // Resposta correta - é um acerto
                    gameState.userScore++;
                    document.getElementById('userScore').textContent = gameState.userScore;
                    gameState.opponentBoard[row][col] = 2; // 2 representa um acerto
                    checkShipSunk(gameState.opponentShips, row, col);
                    document.getElementById('status').textContent = 'Acertou! Ótimo tiro!';
                } else {
                    // Resposta errada
                    gameState.userLives--;
                    gameState.cpuScore++;
                    document.getElementById('userLives').textContent = gameState.userLives;
                    document.getElementById('cpuScore').textContent = gameState.cpuScore;
                    document.getElementById('status').textContent = 'Errou a pergunta! Menos uma vida.';

                    if (gameState.userLives <= 0) {
                        gameState.gameOver = true;
                        showGameOverModal();
                    }
                }

                renderBoard();
                
            }, 1500);
        }

        function showGameOverModal() {
            const gameOverModal = document.getElementById('gameOverModal');
            gameOverModal.style.display = 'flex';

            document.getElementById('tryAgainBtn').onclick = playAgainSamePlayer;
            document.getElementById('newGameBtn').onclick = newGameNewPlayer;
        }

        function playAgainSamePlayer() {
            const gameOverModal = document.getElementById('gameOverModal');
            const winModal = document.getElementById('winModal');
            if (gameOverModal) gameOverModal.style.display = 'none';
            if (winModal) winModal.style.display = 'none';
            
            // Reset game state but keep player name
            gameState.opponentBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
            gameState.opponentShips = [];
            gameState.gameOver = false;
            gameState.usedQuestions = [];
            gameState.userLives = 3;
            gameState.userScore = 0;
            gameState.cpuScore = 0;

            document.getElementById('userLives').textContent = gameState.userLives;
            document.getElementById('userScore').textContent = gameState.userScore;
            document.getElementById('cpuScore').textContent = gameState.cpuScore;

            restartGame(); // This will re-place ships and render the board
        }

        function newGameNewPlayer() {
            const gameOverModal = document.getElementById('gameOverModal');
            const winModal = document.getElementById('winModal');
            if (gameOverModal) gameOverModal.style.display = 'none';
            if (winModal) winModal.style.display = 'none';

            // Reset everything, including player name
            gameState.playerName = '';
            document.getElementById('playerName').value = ''; // Clear the input field
            
            document.getElementById('gameContainer').style.display = 'none';
            document.getElementById('startScreen').style.display = 'flex'; // Show start screen
            
            initializeBoard(); // Reset board and scores
        }

        function showSunkMessage(shipName) {
            const messageElement = document.getElementById('sunkMessage');
            messageElement.textContent = `Você afundou o ${shipName}!`;
            messageElement.style.display = 'block';
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
        }

        // Verifica se um navio foi afundado
        function checkShipSunk(shipsArray, row, col) {
            for (let ship of shipsArray) {
                const posIndex = ship.positions.findIndex(pos => pos[0] === row && pos[1] === col);
                if (posIndex !== -1) {
                    ship.hits++;
                    
                    if (ship.hits === ship.size) {
                        gameState.userScore += 5; // Pontos extras por afundar um navio
                        document.getElementById('userScore').textContent = gameState.userScore;
                        
                        ship.positions.forEach(pos => {
                            const cell = document.querySelector(`.cell[data-row='${pos[0]}'][data-col='${pos[1]}']`);
                            if (cell) {
                                cell.classList.add('sunk');
                                gameState.opponentBoard[pos[0]][pos[1]] = 4; // 4 representa um navio afundado
                            }
                        });

                        showSunkMessage(ship.name);
                        
                        // Verifica se todos os navios foram afundados
                        const allSunk = shipsArray.every(s => s.hits === s.size);
                        if (allSunk) {
                            gameState.gameOver = true;
                            document.getElementById('status').textContent = 'Você Venceu! 🎉';
                            showWinModal(); // Call the new win modal
                        }
                    }
                    break;
                }
            }
        }

        function showWinModal() {
            const winModal = document.getElementById('winModal');
            winModal.style.display = 'flex';

            document.getElementById('playAgainSamePlayerBtn').onclick = playAgainSamePlayer;
            document.getElementById('newGameNewPlayerBtn').onclick = newGameNewPlayer;
        }

        function goToStartScreen() {
            document.getElementById('gameContainer').style.display = 'none';
            document.getElementById('startScreen').style.display = 'flex';
            gameState.playerName = '';
            document.getElementById('playerName').value = '';
            initializeBoard(); // Reset board and scores
        }