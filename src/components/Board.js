import React, { useState } from 'react';
import '../styles/Board.css';

const Board = () => {
 const initialBoard = Array(5).fill(null).map(() => Array(5).fill(null));
 const [board, setBoard] = useState(initialBoard);
 const [turn, setTurn] = useState(0);
 const [highlightedCells, setHighlightedCells] = useState([]);
 const [gameOver, setGameOver] = useState(false);
 const [gameScore, setGameScore] = useState(0);
 const symbols = ['C', 'M', 'T'];
 const cellColors = { C: 'green', M: 'blue', T: 'red' };

 const detectGameLines = (gameBoard) => {
   const foundLines = [];
   let totalLineCount = 0;

   const registerLine = (lineCoordinates, character) => {
     totalLineCount++;
     foundLines.push({ coordinates: lineCoordinates, symbol: character });
   };

   const scanHorizontally = () => {
     for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
       let currentSequence = [];
       let currentSymbol = null;

       for (let colIndex = 0; colIndex < 5; colIndex++) {
         const cellSymbol = gameBoard[rowIndex][colIndex];

         if (cellSymbol === currentSymbol) {
           currentSequence.push([rowIndex, colIndex]);
         } else {
           if (currentSequence.length >= 3) {
             registerLine(currentSequence, currentSymbol);
           }
           currentSymbol = cellSymbol;
           currentSequence = [[rowIndex, colIndex]];
         }
       }

       if (currentSequence.length >= 3) {
         registerLine(currentSequence, currentSymbol);
       }
     }
   };

   const scanVertically = () => {
     for (let colIndex = 0; colIndex < 5; colIndex++) {
       let currentSequence = [];
       let currentSymbol = null;

       for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
         const cellSymbol = gameBoard[rowIndex][colIndex];

         if (cellSymbol === currentSymbol) {
           currentSequence.push([rowIndex, colIndex]);
         } else {
           if (currentSequence.length >= 3) {
             registerLine(currentSequence, currentSymbol);
           }
           currentSymbol = cellSymbol;
           currentSequence = [[rowIndex, colIndex]];
         }
       }

       if (currentSequence.length >= 3) {
         registerLine(currentSequence, currentSymbol);
       }
     }
   };

   const scanDiagonalTopLeftToBottomRight = () => {
     for (let startRow = 0; startRow < 5; startRow++) {
       let currentSequence = [];
       let currentSymbol = null;

       for (let offset = 0; startRow + offset < 5; offset++) {
         const row = startRow + offset;
         const col = offset;
         const cellSymbol = gameBoard[row][col];

         if (cellSymbol === currentSymbol) {
           currentSequence.push([row, col]);
         } else {
           if (currentSequence.length >= 3) {
             registerLine(currentSequence, currentSymbol);
           }
           currentSymbol = cellSymbol;
           currentSequence = [[row, col]];
         }
       }

       if (currentSequence.length >= 3) {
         registerLine(currentSequence, currentSymbol);
       }
     }

     for (let startCol = 1; startCol < 5; startCol++) {
       let currentSequence = [];
       let currentSymbol = null;

       for (let offset = 0; startCol + offset < 5; offset++) {
         const row = offset;
         const col = startCol + offset;
         const cellSymbol = gameBoard[row][col];

         if (cellSymbol === currentSymbol) {
           currentSequence.push([row, col]);
         } else {
           if (currentSequence.length >= 3) {
             registerLine(currentSequence, currentSymbol);
           }
           currentSymbol = cellSymbol;
           currentSequence = [[row, col]];
         }
       }

       if (currentSequence.length >= 3) {
         registerLine(currentSequence, currentSymbol);
       }
     }
   };

   const scanDiagonalTopRightToBottomLeft = () => {
     for (let startRow = 0; startRow < 5; startRow++) {
       let currentSequence = [];
       let currentSymbol = null;

       for (let offset = 0; startRow + offset < 5; offset++) {
         const row = startRow + offset;
         const col = 4 - offset;
         const cellSymbol = gameBoard[row][col];

         if (cellSymbol === currentSymbol) {
           currentSequence.push([row, col]);
         } else {
           if (currentSequence.length >= 3) {
             registerLine(currentSequence, currentSymbol);
           }
           currentSymbol = cellSymbol;
           currentSequence = [[row, col]];
         }
       }

       if (currentSequence.length >= 3) {
         registerLine(currentSequence, currentSymbol);
       }
     }

     for (let startCol = 3; startCol >= 0; startCol--) {
       let currentSequence = [];
       let currentSymbol = null;

       for (let offset = 0; 4 - startCol + offset < 5; offset++) {
         const row = offset;
         const col = startCol - offset;
         const cellSymbol = gameBoard[row][col];

         if (cellSymbol === currentSymbol) {
           currentSequence.push([row, col]);
         } else {
           if (currentSequence.length >= 3) {
             registerLine(currentSequence, currentSymbol);
           }
           currentSymbol = cellSymbol;
           currentSequence = [[row, col]];
         }
       }

       if (currentSequence.length >= 3) {
         registerLine(currentSequence, currentSymbol);
       }
     }
   };

   scanHorizontally();
   scanVertically();
   scanDiagonalTopLeftToBottomRight();
   scanDiagonalTopRightToBottomLeft();

   return {
     lineCount: totalLineCount,
     lines: foundLines
   };
 };

 const handleCellClick = (row, col) => {
   if (board[row][col] !== null || gameOver) return;

   const newBoard = board.map((r, rIdx) =>
     r.map((cell, cIdx) => (rIdx === row && cIdx === col ? symbols[turn % 3] : cell))
   );

   setBoard(newBoard);
   setTurn(turn + 1);
   
   const { lineCount, lines } = detectGameLines(newBoard);
   const allHighlightedCells = lines.flatMap(line => line.coordinates);
   
   setHighlightedCells(allHighlightedCells);
   setGameScore(lineCount);

   if (turn + 1 === 25) {
     setGameOver(true);
   }
 };

 const isHighlighted = (row, col) => {
   return highlightedCells.some(([r, c]) => r === row && c === col);
 };

 const resetGame = () => {
   setBoard(initialBoard);
   setTurn(0);
   setHighlightedCells([]);
   setGameOver(false);
   setGameScore(0);
 };

 return (
   <div className="board-container">
     <h2>CMT Board Game Elod Hersics</h2>
     <div className="board-grid">
       {board.map((row, rowIndex) =>
         row.map((cell, colIndex) => (
           <div
             key={`${rowIndex}-${colIndex}`}
             onClick={() => handleCellClick(rowIndex, colIndex)}
             className="board-cell"
             style={{
               backgroundColor: 'white',
               cursor: board[rowIndex][colIndex] ? 'not-allowed' : 'pointer',
             }}
           >
             {cell && (
               <span
                 style={{
                   color: isHighlighted(rowIndex, colIndex) ? cellColors[cell] : 'black',
                   fontSize: '2rem',
                 }}
               >
                 {cell}
               </span>
             )}
           </div>
         ))
       )}
     </div>
     <button onClick={resetGame} className="reset-button">
       Reset
     </button>
     {gameOver && (
       <h3 className="game-result">
         {gameScore > 0 ? `Congratulations, you have ${gameScore} lines!` : 'You have no lines, try again!'}
       </h3>
     )}
   </div>
 );
};

export default Board;