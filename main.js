const TicTacToe = {
    board: [],
    player: {
        options: ['X', 'O'],
        currentIndex: 0,
        changePlayer(){
            this.currentIndex = (this.currentIndex + 1) % this.options.length
        }
    },

    gameOver: false,
    score: {},
    containerElement: null,
    message: 'Welcome to Tic Tac Toe!',

    init(container){
        this.containerElement = container
        this.initBoard()
        this.initScore()
        this.makeMachinePlay()
        this.draw()
    },

    initBoard(){
        for(let i = 0; i < 9; i++){
            this.board[i] = {
                symbol: '',
                isPartOfWinningSequence: false
            }
        }
    },

    initScore(){
        for(const option of this.player.options){
            this.score[option] = 0
        }
        this.score['Tie'] = 0
    },

    increasePlayerPoints(player){
        this.score[player] += 1
    },

    makePlay(position){
        if(this.gameOver) return false

        if(!this.isEmptySymbol(this.board[position].symbol)) return false

        this.board[position].symbol = this.player.options[this.player.currentIndex]

        const { winner, winningSequence } = this.checkWinner()

        if(winner != null){
            this.finishGame(winningSequence)
            this.increasePlayerPoints(winner)
            this.messagePlayer(`<strong>${winner}</strong> wins!`)
        } else {
            this.player.changePlayer()
            this.draw()
        }

        return true
    },

    makeMachinePlay(){
        let bestScore = -Infinity
        let bestPlaceToMark

        const machinePlayerIndex = this.player.currentIndex
        const opponentIndex = (machinePlayerIndex + 1) % this.player.options.length

        const scores = {
            [this.player.options[machinePlayerIndex]]: 1, // X or O
            [this.player.options[opponentIndex]]: -1,     // O or X
            'Tie': 0,
        }

        this.board.forEach((item, index) => {
            if(!this.isEmptySymbol(item.symbol)){
                return
            }

            item.symbol = this.player.options[machinePlayerIndex]
            const score = this.minimax({ minimaxScore: scores })
            item.symbol = ''

            // resets the current player because minimax() changes the player 'n' times
            this.player.currentIndex = machinePlayerIndex

            if(score > bestScore){
                bestScore = score
                bestPlaceToMark = index
            }
        })

        this.makePlay(bestPlaceToMark)
    },

    minimax({ depth = 0, isMaximizing = false, minimaxScore }){
        const { winner } = this.checkWinner()
        if(winner !== null) {return minimaxScore[winner]}

        let bestScore = isMaximizing ? -Infinity : Infinity
        this.board.forEach(item => {
            if(!this.isEmptySymbol(item.symbol)) return

            this.player.changePlayer()

            item.symbol = this.player.options[this.player.currentIndex]
            let score = this.minimax({
                depth: depth + 1,
                isMaximizing: !isMaximizing,
                minimaxScore
            })
            item.symbol = ''

            bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore)
        })

        return bestScore;
    },

    randomInt(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    },

    checkWinner(){
        const  winning = { winner: null, winningSequence: [] }

        // horizontal
        for(let i = 0; i < 3; i++){
            const index = i * 3
            if(this.isEquals(this.board[index].symbol, this.board[index + 1].symbol, this.board[index + 2].symbol)){
                winning.winningSequence = [index, index + 1, index + 2]
                winning.winner = this.board[index].symbol

                return winning
            }
        }

        // vertical
        for(let i = 0; i < 3; i++){
            if(this.isEquals(this.board[i].symbol, this.board[i + 3].symbol, this.board[i + 6].symbol)){
                winning.winningSequence = [i, i + 3, i + 6]
                winning.winner = this.board[i].symbol

                return winning
            }
        }

        // diagonals
        if(this.isEquals(this.board[0].symbol, this.board[4].symbol, this.board[8].symbol)){
            winning.winningSequence = [0, 4, 8]
            winning.winner = this.board[0].symbol

            return winning
        }
        if(this.isEquals(this.board[2].symbol, this.board[4].symbol, this.board[6].symbol)){
            winning.winningSequence = [2, 4, 6]
            winning.winner = this.board[2].symbol

            return winning
        }

        // Tie
        if(this.isBoardFull() && winning.winner == null){
            winning.winningSequence = [0, 1, 2, 3, 4, 5, 6, 7, 8]
            winning.winner = 'Tie'

            return winning
        }

        return winning

    },

    isBoardFull() {
        return this.board.every(cell => cell.symbol != '')
    },

    isEquals(a, b, c) {
        return (a == b && b == c && !this.isEmptySymbol(a))
    },

    isEmptySymbol(symbol){
        return (symbol == '')
    },

    finishGame(winnerSequence){
        this.gameOver = true

        for(const i of winnerSequence){
            this.board[i].isPartOfWinningSequence = true
        }
    },

    restartGame(){
        this.gameOver = false
        this.player.currentIndex = 0
        this.initBoard()
        this.makeMachinePlay()
        this.draw()
    },

    messagePlayer(message){
        this.message = message
        this.draw()
    },

    draw(){
        const boardSection = this.createBoardSection()
        const controlsSection = this.createControlsSection()

        this.containerElement.innerHTML = ''
        this.containerElement.appendChild(boardSection)
        this.containerElement.appendChild(controlsSection)
    },

    createBoardElement(){
        const board = document.createElement('div')
        board.className = 'board'

        if(this.gameOver){
            board.classList.add('game-over')
        }

        this.board.forEach((cell, i) => {
            const div = document.createElement('div')
            if(cell.symbol) {
                div.appendChild(icon(cell.symbol))
            }

            if(cell.isPartOfWinningSequence){
                div.className = 'winning'
            }

            if(!cell.symbol) {
                div.addEventListener('click', () => {
                    this.makePlay(i)
                    setTimeout(() => this.makeMachinePlay(), 700)
                });
            }

            board.appendChild(div)
        })

        return board
    },

    createActionsElement(){
        const restartBtn = document.createElement('button')
        restartBtn.id = 'restart'
        restartBtn.innerHTML = 'Restart!'
        restartBtn.onclick = () => {
            this.restartGame()
        }

        return restartBtn
    },

    createBoardSection(){
        const section = document.createElement('section')
        section.appendChild(this.createBoardElement())
        section.appendChild(this.createActionsElement())

        return section
    },

    createMessageElement(){
        const p = document.createElement('p')
        p.className = 'message'
        p.innerHTML = this.message

        return p
    },

    createControlsSection(){
        const table = el('table');
        table.classList.add('score-table')

        table.appendChild(this.createScoreTitle());
        table.appendChild(this.createScoreLabelRow());
        table.appendChild(this.createScoreValueRow());

        const section = el('section');

        section.appendChild(this.createMessageElement());
        section.appendChild(table);

        return section;
    },

    createScoreTitle() {
        const tableTitle = el('th');

        tableTitle.colSpan = Object.keys(this.score).length;
        tableTitle.appendChild(text('SCORE'));

        return row(tableTitle);
    },

    createScoreLabelRow(){
        const labelCells = Object.keys(this.score).map(label => {
            const cell = el('th');
            const content = icon(label);
            cell.appendChild(content);

            return cell;
        });

        return row(...labelCells);
    },

    createScoreValueRow() {
        const scoreCells = Object.values(this.score).map(scoreValue => {
            const cell = el('td');
            const content = text(scoreValue);
            cell.appendChild(content);

            return cell;
        });

        return row(...scoreCells);
    },
}

function el(tagName) {
    return document.createElement(tagName);
}

function text(textContent) {
    return document.createTextNode(textContent);
}

function row(...cells) {
    const rowEl = document.createElement('tr');
    cells.forEach(cell => {
        rowEl.appendChild(cell);
    });
    return rowEl;
}

function icon(player) {
    const imgEl = el('img');
    imgEl.src = `./${player}.svg`;
    imgEl.width = 45;
    imgEl.height = 45;
    return imgEl
}
