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

        if(this.isEmptySymbol(this.board[position].symbol)){
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
        }
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
        for (cell of this.board) {
            if (cell.symbol == '') {
                return false
            }
        }

        return true
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
        this.initBoard()
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
            div.innerHTML = cell.symbol

            if(cell.isPartOfWinningSequence){
                div.className = 'winning'
            }

            div.onclick = () => {
                this.makePlay(i)
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

        const actions = document.createElement('div')
        actions.className = 'actions'
        actions.appendChild(restartBtn)

        return actions
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

    createScoreElement(){
        const scoreBoard = document.createElement('div')
        scoreBoard.className = 'score-board'
        
        for (option of Object.keys(this.score)) {
            const label = document.createElement('div')
            label.classList.add('score-label')
            label.innerHTML = option
            scoreBoard.appendChild(label)
        }
        
        for (option of Object.keys(this.score)) {
            const value = document.createElement('div')
            value.classList.add('score-value')
            value.innerHTML = this.score[option]
            
            scoreBoard.appendChild(value)
        }
        
        return scoreBoard
    },
    
    createControlsSection(){
        const messageElement = this.createMessageElement()

        const scoreTitle = document.createElement('h2')
        scoreTitle.innerHTML = 'Score:'

        const scoreBoard = this.createScoreElement()

        const section = document.createElement('section')
        section.appendChild(messageElement)
        section.appendChild(scoreTitle)
        section.appendChild(scoreBoard)

        return section
    },
}