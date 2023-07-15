import { useState, useRef } from "react";

function Square({ value, onSquareClick, highlighted, justMoved }) {
  return (
    <button
      className="square"
      style={
        highlighted
          ? { color: "red", backgroundColor: "yellow" }
          : justMoved
          ? { color: "blue" }
          : null
      }
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, noMoreMoves, lastMove }) {
  const winningSquares = useRef([]);

  function handleClick(i) {
    if (!squares[i] && !calculateWinner(squares, winningSquares)) {
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
      onPlay(nextSquares, i);
    }
  }

  const winner = calculateWinner(squares, winningSquares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (noMoreMoves) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {squares.map((sq, index) =>
        index % 3 === 0 ? (
          <div className="board-row">
            {squares.slice(index, index + 3).map((sq, i) => (
              <Square
                value={squares[index + i]}
                onSquareClick={() => handleClick(index + i)}
                highlighted={winningSquares.current.includes(index + i)}
                justMoved={index + i === lastMove}
              />
            ))}
          </div>
        ) : null
      )}
      {/* {(() => {
        const rows = [];
        for(let i=0; i<3; i++) {
          rows.push(<div className="board-row">
          {(() => {
          const cols = [];
          for(let j=0; j<3; j++) {
            let index = (i * 3) + j;
            cols.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)}/>);
          }
          return cols;
          })()}
          </div>);
        }
        return rows;
      })()} */}
      {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div> */}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [movesHistory, setMovesHistory] = useState(Array(9).fill(null));
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const lastMove = currentMove > 0 ? movesHistory[currentMove - 1] : -1;

  function handlePlay(nextSquares, nextMove) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextMovesHistory = movesHistory.map((m, i) =>
      i < currentMove ? m : i === currentMove ? nextMove : null
    );
    setHistory(nextHistory);
    setMovesHistory(nextMovesHistory);
    setCurrentMove(currentMove + 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const movePosition = (m) => {
    const col = m % 3;
    const row = (m - col) / 3;
    return "(" + (row + 1) + "," + (col + 1) + ")";
  };

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description =
        "Go to move #" + move + " " + movePosition(movesHistory[move - 1]);
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {move !== currentMove ? (
          <button onClick={() => jumpTo(move)}>{description}</button>
        ) : (
          <span style={{ fontSize: "0.9em", paddingLeft: "1px" }}>
            You are at move #{currentMove}{" "}
            {currentMove > 0
              ? movePosition(movesHistory[currentMove - 1])
              : null}
          </span>
        )}
      </li>
    );
  });

  // const sortedMoves = sortAscending ? moves : moves.sort((a, b) => b.key - a.key);
  const sortedMoves = sortAscending ? moves : moves.reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          noMoreMoves={currentMove === 9}
          lastMove={lastMove}
        />
      </div>
      <div className="game-info">
        <button
          className="toggle"
          onClick={() => setSortAscending(!sortAscending)}
        >
          Toggle Sort
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, winningSquares) {
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
      winningSquares.current = lines[i].slice();
      return squares[a];
    }
  }
  winningSquares.current = [];
  return null;
}
