const TicTacToe = {
    board: ['', '', '', '', '', '', '', '', ''],
    player: {
        options: ['X', 'O'],
        currentIndex: 0,
        changePlayer: function(){
            this.currentIndex = (this.currentIndex + 1) % this.options.length
        }
    },
    containerElement: null,
    gameOver: false,

    init: function(container){
        // this.board = ['', '', '', '', '', '', '', '', '']
        this.containerElement = container
    },

    makePlay: function(position){
        if(this.gameOver) return false
        if(this.board[position] === ''){
            this.board[position] = this.player.options[this.player.currentIndex]
            const { winner, winningSequence} = this.checkWinner()
            if(winner != null){
                console.log(winner)
                this.draw()
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
            const div = this.containerElement.children[i]
            div.classList.add('winning')
        }
    },

    draw: function(){
        this.containerElement.innerHTML = ''
        for(const i in this.board){
            const div = document.createElement('div')
            div.onclick = () => {
                this.makePlay(i)
            }
            div.innerHTML = this.board[i]
            this.containerElement.appendChild(div)
        }
    }
}