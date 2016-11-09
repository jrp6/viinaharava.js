import React, { Component } from 'react';
import './App.css';

function Square(props) {
    return (
 	<button className="Square" onClick={() => props.onClick()}>
 	    {props.value}
 	</button>
    );
}

const BOARD_WIDTH=10;
const BOARD_HEIGHT=8;

class Board extends Component {
    constructor() {
	super();
	
	this.state = {
	    // N.B. the Array contains rows, i.e. indexing is squares[y][x]
	    squares: Array(BOARD_HEIGHT).fill(null),
	}
    }
    componentWillMount() {
	const squares = this.state.squares.slice();
	for (var i = 0; i < BOARD_HEIGHT; i++) {
	    squares[i] = Array(BOARD_WIDTH).fill("0");
	}
	this.setState({ squares: squares })
    }
    renderSquare(x, y) {
	return <Square key={y * BOARD_WIDTH + x} value={this.state.squares[y][x]} onClick={() => this.handleClick(x, y)} />;
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
