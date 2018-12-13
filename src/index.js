import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {

    let className = 'square';
    if (props.isHighlighted) {
        className += ' highlighted';
    }

    return (
        <button className={className} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i, isHighlighted) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isHighlighted={isHighlighted}
            />
        );
    }

    render() {

        const boardRows = Array(3);

        for (let i = 0; i < boardRows.length; i++) {
            const boardSquares = Array(3);
            for (let j = 0; j < boardSquares.length; j++) {
                const ij = i*3 + j;
                const lightOn = this.props.winLine && this.props.winLine.includes(ij);
                boardSquares[j] = this.renderSquare(ij, lightOn);
            }
            boardRows[i] = (
                <div key={i} className="board-row">
                    {boardSquares}
                </div>
            )
        }

        return (
            <div>
                {boardRows}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                clicked: null,
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                clicked: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerData = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc = move ?
                'Go to move #' + move + ' (' + (step.clicked % 3) + ',' + Math.floor(step.clicked / 3) + ')' :
                'Go to game start';
            if (step === current) {
                desc = <b>{desc}</b>;
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winnerData) {
            status = 'Winner: ' + winnerData.winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winLine={winnerData.line}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

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
                winner: squares[a],
                line: lines[i],
            };
        }
    }
    return {
        winner: null,
        line: null,
    };
}