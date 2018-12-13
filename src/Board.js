import React from "react";
import Square from "./Square";

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

export default Board;