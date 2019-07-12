import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';




function Square(props) {
  return (
    <button
      className={`square ${props.isChangeColor ? 'changeColor' : ''}`}
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}




//ボードを作るクラス
class Board extends React.Component {
  renderSquare(i, isChangeColor = false) {
    return <Square
      isChangeColor={isChangeColor}
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        {
          Array(3).fill(0).map((row, i) => {
            return (
              <div className="board-row" key={i}>
                {
                  Array(3).fill(0).map((col, j) => {
                    return (
                      this.renderSquare(i * 3 + j,
                        this.props.colorChangeCells.indexOf(i * 3 + j) !== -1))
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}




class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      isAsc: true,
      AscDsc: "昇順"
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'O' : 'X';
    this.setState({
      history: history.concat([{
        squares: squares,
        col: (i % 3) + 1,
        row: Math.floor(i / 3) + 1,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    })
  }

  toggleAsc() {
    this.setState({
      asc: !this.state.asc,
      AscDsc: (this.state.asc ? "昇順" : "降順")
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const settlement = calculateWinner(current.squares);

    let status;
    if (settlement) {
      if (settlement.isDraw) {
        status = 'Draw';
      } else {
        status = 'Winner: ' + settlement.winner;
      }
    } else {
      status = '次の手番: ' +
        (this.state.xIsNext ? 'O' : 'X');
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        move + `番目の手に移動  ` + step.col + '列目 ' + step.row + '行目に  ' + (move % 2 ? 'O' : 'X') :
        'ゲームスタート';
      return (
        <li key={move}>
          <button
            className={this.state.stepNumber === move ? 'bold' : ''}
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            colorChangeCells={settlement ? settlement.line : []}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.toggleAsc()}>
              {this.state.AscDsc}
            </button>
          </div>
          <ol>{!this.state.asc ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}





ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        isDraw: false,
        winner: squares[a],
        line: [a, b, c]
      }
    }

    if (squares.filter((e) => !e).length === 0) {
      return {
        isDraw: true,
        winner: null,
        line: []
      }
    }
  }
  return null;
}
