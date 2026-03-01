import { useState } from 'react';

function Square({ value, onSquareClick, highLight }) {
    return (
        <button className="square"
        onClick={onSquareClick}
        style={{
            backgroundColor: highLight ? "yellow" : "white" // (4) highlight winning squares
        }}
        >
        {value}
        </button>
    );
}


function Board({ xIsNext, squares, onPlay}) {

    function handleClick(i){
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } 
        else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares, i); // (5) pass index of moves separately
    }

    const winnerInfo = calculateWinner(squares); // (4) now returns object
    const winner = winnerInfo ? winnerInfo.winner : null;
    const winningLine = winnerInfo ? winnerInfo.line : [];

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } 
    else if (!winner && !squares.includes(null)) { // (4) draw 
        status = 'Result: Draw';
    }
    else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    // (2) Use loops to build rows
    const rows = [];
    for (let r = 0; r < 3; r++) { 
        const cols = [];
        for (let c = 0; c < 3; c++) { 
            const i = r * 3 + c;
            cols.push(
                <Square
                    key={i}
                    value={squares[i]}
                    onSquareClick={()=> handleClick(i)}
                    highLight={winningLine.includes(i)} // (4)
                />
            );
        }
        rows.push(<div key={r} className="board-row">{cols}</div>);
    }

    return (
    <>
        <div className="status">{status}</div>
        {rows}
    </>
  );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [moveLocations, setMoveLocations] = useState([null]); // (5) separate array for locations
    const [currentMove, setCurrentMove] = useState(0);
    const [ascending, setAscending] = useState(true); // (3) toggle state

    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares, moveIndex){ 
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        const nextLocations = [...moveLocations.slice(0, currentMove + 1), moveIndex]; 
        setHistory(nextHistory);
        setMoveLocations(nextLocations); 
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove){
        setCurrentMove(nextMove);
    }

    let moves = history.map((squares, move) => {

        let description;

        if (move > 0) {
            const index = moveLocations[move]; 
            const row = Math.floor(index / 3) + 1; 
            const col = (index % 3) + 1; 
            description = 'Go to move #' + move + ' (' + row + ', ' + col + ')'; // (5)
        } 
        else {
            description = 'Go to game start';
        }

        if (move === currentMove) { 
            return (
                <li key={move}>
                    <span>You are at move #{move}</span>
                </li>
            );
        }

        return (
        <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
        );
    });

    if (!ascending) { // (3) reverse menu
        moves = moves.slice().reverse();
    }

    return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={() => setAscending(!ascending)}>
            Sort {ascending ? "Descending" : "Ascending"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] }; // (4) return winning line
    }
  }
  return null;

}
