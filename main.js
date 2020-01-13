const TicTacToe = {
    board: ['', '', '', '', '', '', '', '', ''],
    player: {
        options: ['X', 'O'],
        currentIndex: 0,
        changePlayer: function(){
            this.currentIndex = (this.currentIndex + 1) % this.options.length
        }
    },
    boardContainer: null,
    scoreContainer: null,
    messageContainer: null,
    gameOver: false,
    score: {},

    init: function(board, score, message){
        this.boardContainer = board
        this.scoreContainer = score
        this.messageContainer = message
        this.initScore()
        this.draw()
    },

    initScore: function(){
        for(const option of this.player.options){
            this.score[option] = 0
        }
        this.score['Tie'] = 0
    },

    increasePlayerPoints(player){
        this.score[player] += 1
    },

    makePlay: function(position){
        if(this.gameOver) return false
        if(this.board[position] === ''){
            this.board[position] = this.player.options[this.player.currentIndex]
            const { winner, winningSequence} = this.checkWinner()
            if(winner != null){
                this.increasePlayerPoints(winner)
                this.draw()
                this.message(`<strong>${winner}</strong> wins!`)
                this.finishGame(winningSequence)
            } else {
                this.player.changePlayer()
                this.draw()
            }
        }
    },

    checkWinner: function(){
        let winning = { winner: null, winningSequence: [] }

        // horizontal
        for(let i = 0; i < 3; i++){
            const index = i * 3
            if(isEquals(this.board[index], this.board[index + 1], this.board[index + 2])){
                winning.winningSequence = [index, index + 1, index + 2]
                winning.winner = this.board[index]
                return winning
            }
        }

        // vertical 
        for(let i = 0; i < 3; i++){
            if(isEquals(this.board[i], this.board[i + 3], this.board[i + 6])){
                winning.winningSequence = [i, i + 3, i + 6]
                winning.winner = this.board[i]
                return winning
            }
        }

        // diagonals
        if(isEquals(this.board[0], this.board[4], this.board[8])){
            winning.winningSequence = [0, 4, 8]
            winning.winner = this.board[0]
            return winning
        }
        if(isEquals(this.board[2], this.board[4], this.board[6])){
            winning.winningSequence = [2, 4, 6]
            winning.winner = this.board[2]
            return winning
        }

        if(isBoardFull(this.board) && winning.winner == null){
            winning.winningSequence = [0, 1, 2, 3, 4, 5, 6, 7, 8]
            winning.winner = 'Tie'
            return winning
        }

        return winning

        function isBoardFull(board){
            for(i of board){
                if(i == ''){
                    return false
                }
            }
            return true
        }

        function isEquals(a, b, c){
            return (a == b && b == c && a != '')
        }
    },

    finishGame: function(winnerSequence){
        this.gameOver = true
        for(const i of winnerSequence){
            const div = this.boardContainer.children[i]
            div.classList.add('winning')
        }
        for(i in this.board){
            this.boardContainer.children[i].classList.add('no-pointer')
        }
    },

    restartGame: function(){
        this.board = ['', '', '', '', '', '', '', '', '']
        this.gameOver = false
        this.draw()
    },

    message: function(message){
        this.messageContainer.innerHTML = message
    },

    draw: function(){
        this.boardContainer.innerHTML = ''
        for(const i in this.board){
            const div = document.createElement('div')
            div.onclick = () => {
                this.makePlay(i)
            }
            div.innerHTML = this.board[i]
            this.boardContainer.appendChild(div)
        }

        this.scoreContainer.innerHTML = ''
        for(option of Object.keys(this.score)){
            const label = document.createElement('div')
            label.classList.add('score-label')
            label.innerHTML = option
            console.log
            this.scoreContainer.appendChild(label)
        }

        for(option of Object.keys(this.score)){
            const value = document.createElement('div')
            value.classList.add('score-value')
            value.innerHTML = this.score[option]

            this.scoreContainer.appendChild(value)
        }

        const currentPlayer = this.player.options[this.player.currentIndex]
        this.message(`Now it's <strong>${currentPlayer}</strong> turn`)
    }
}