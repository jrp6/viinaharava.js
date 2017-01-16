import React, { Component } from 'react';
import './App.css';

/*
 * Shuffles array in place. ES6 version
 * Copied from http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
 */
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}


function Square(props) {
    return (
 	<button className="Square" onClick={() => props.onClick(props.x, props.y)}>
 	    {props.visible ? props.value : "_"}
 	</button>
    );
}

const BOARD_WIDTH=10;
const BOARD_HEIGHT=8;
const BOARD_WINES=12;

class Board extends Component {
    constructor() {
	super();
	
	this.state = {
	    // N.B. the Array contains rows, i.e. indexing is squares[y][x]
	    squares: Array(BOARD_HEIGHT).fill(null),
            isPlayerWin: false,
            isPlayerLoss: false,
	};

        this.renderSquare = this.renderSquare.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentWillMount() {
	const squares = this.state.squares.slice();

        // Initialize the board with invisible zeroes
	for (let i = 0; i < BOARD_HEIGHT; i++) {
            squares[i] = [];
            for (let j = 0; j < BOARD_WIDTH; j++) {
                squares[i].push({ value: "0", visible: false });
            }
	}

        // Randomly pick some wines
        const coords = Array(BOARD_WIDTH * BOARD_HEIGHT).fill(null);
        for(let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                coords[y * BOARD_WIDTH + x] = {y: y, x: x};
            }
        }
        shuffle(coords);
        for (let i = 0; i < BOARD_WINES; i++) {
            const coord = coords[i];
            squares[coord.y][coord.x].value = "*"
            // Update neighbours
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const newY = coord.y + dy;
                    const newX = coord.x + dx;
                    if (squares[newY] !== undefined && squares[newY][newX] !== undefined &&
                        squares[newY][newX].value !== "*") {
                        squares[newY][newX].value = String(Number(squares[newY][newX].value) + 1);
                    }
                }
            }
        }
        
	this.setState({ squares: squares });
    }
    renderSquare(x, y) {
	return <Square
                   key={y * BOARD_WIDTH + x}
                   x={x}
                   y={y}
                   value={this.state.squares[y][x].value}
                   visible={this.state.squares[y][x].visible}
                   onClick={this.handleClick}
               />;
    }
    handleClick(x, y) {
        const squares = this.state.squares.slice();
        if (squares[y] !== undefined && squares[y][x] !== undefined && !squares[y][x].visible) {
            squares[y][x].visible = true;
            if (squares[y][x].value === "*") {
                this.setState({ isPlayerLoss: true });
            }
            if (squares[y][x].value === "0") {
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        this.handleClick(x + dx, y + dy);
                    }
                }
            }
            this.setState({ squares: squares });
        }
    }
    render() {
	// Render the squares
	const board = this.state.squares.map((row, y) => {
	    const squares = row.map((square, x) => {
		return this.renderSquare(x, y);
	    });
	    // A row is a div containing all the squares
	    return (
		<div key={y} className="board-row">
		    {squares}
		</div>
	    );
	});
	return (
	    <div className="gameBoard">
                <div className="status">
                    {this.state.isPlayerWin ? "8)" : this.state.isPlayerLoss ? ":(" : ":)"}
                </div>
	        {board}
	    </div>
	);
    }
}

class App extends Component {
    render() {
	return (
	    <div className="game">
		<Board />
	    </div>
	);
    }
}

export default App;
