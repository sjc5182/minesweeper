import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './App.css'

const BOARD_SIZE = 10
const RESET_BUTTON_TEXT = 'New game'

class App extends Component {
  static propTypes = {
    boardRowsCount: PropTypes.number.isRequired,
    boardColsCount: PropTypes.number.isRequired,
  }

  static defaultProps = {
    boardRowsCount: BOARD_SIZE,
    boardColsCount: BOARD_SIZE,
  }

  state = {
    board: this.newBoard()
  }

  render() {
    console.table(
      this.state.board.map((row) => row.map((cell) => JSON.stringify(cell)))
    )
  
    return (
      <div className="App">
        <button className="resetButton" onClick={this.resetBoard}>
          {RESET_BUTTON_TEXT}
        </button>
        <main className="board">
          {
            this.renderCell()
          }
        </main>
      </div>
    )
  }

  renderCell = () => {
    const initialContents = <span className="cellContents--initial" />
    const clearedContents = (count) => <span className="cellContents--isCleared">{count ? count : null}</span>
    const mineContents = (
      <span className="cellContents--isMine" role="img" aria-label="mine">
        💣
      </span>
    )

    return this.state.board.map((row) =>
      <div className="row">
        {
          row.map((cell) =>
              <span className="cell" onClick = {() => this.adjacentCells(cell)}>
                {
                  cell.unrevealed && cell.minesCount===0 
                  ? initialContents 
                  : !cell.unrevealed && cell.isMine // Revealed cells show a mine
                
                  ? mineContents 
                  : !cell.unrevealed && cell.minesCount!==0 // Revealed cells show a count of adjacent mines
                
                  ? clearedContents(cell.minesCount)
                  : !cell.unrevealed && cell.minesCount===0 // Revealed cells with zero adjacent mines should be blank
                
                  ? clearedContents() 
                  : null
                }
              </span>
          )
        }
      </div>
    )
  }
  // this is O(1) or constant iteration, so performance is fine
  adjacentCells = (cellsObj) => {
    const { x, y } = cellsObj
    const adjacent = [
      [x - 1, y - 1],
      [x, y - 1],
      [x - 1, y],
      [x + 1, y + 1],
      [x + 1, y],
      [x, y + 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
    ];
   this.adjacentMinesCount(adjacent, cellsObj)
  }


  adjacentMinesCount = (adjacent, obj) => {

    let board = this.state.board.slice();
    board[obj.x][obj.y]["unrevealed"] = false
    // 
    this.setState(() => {
      let minesCount = 0
      if(!board[obj.x][obj.y]["isMine"]){
        for(let i = 0; i < adjacent.length; i++){ // iterating through adjacent cells
          let xRow = adjacent[i][0]
          let yCol = adjacent[i][1]
          if((xRow >= 0 && yCol >= 0) && (xRow < board.length && yCol<board.length)){
            if(board[xRow][yCol]["isMine"]){ // check for adjacent mines
              minesCount += 1
            }
          }
        }
      }
      if(minesCount !==0 ){
        board[obj.x][obj.y]["minesCount"] = minesCount // set count if there is more than one adjacent cells
      }else if(minesCount===0){
        for(let i = 0; i < adjacent.length; i++){
          let xRow = adjacent[i][0]
          let yCol = adjacent[i][1]
          if((xRow >= 0 && yCol >= 0) && (xRow < board.length && yCol<board.length)){
            if(!board[obj.x][obj.y]["isMine"])
              board[xRow][yCol]["unrevealed"] = false // set false for display blank if no mines count
          }
        }
      }
      return {
        board
      }
    })
  }

  newBoard() {
    const { boardRowsCount, boardColsCount } = this.props

    const newBoard = []

    for (let r = 0; r < boardRowsCount; r++) {
      const row = []
      for (let c = 0; c < boardColsCount; c++) {
        // Suggestion: const isMine = Math.floor(Math.random() * 8) === 0
        const cell = {
          isMine: Math.floor(Math.random() * 8) === 0,
          unrevealed: true,
          minesCount: 0,
          y: c,
          x: r
        }
        row.push(cell)
      }
      newBoard.push(row)
    }

    return newBoard
  }

  resetBoard = () => {
    this.setState({ board: this.newBoard() })
  }
}

export default App
