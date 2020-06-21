import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './ExploreContainer.css';
import { IonIcon } from '@ionic/react';
import { pause, reload, play } from 'ionicons/icons';

interface ContainerProps { }
const numRows = 20;
const numCols = 200;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let index = 0; index < numRows; index++) {
    rows.push(Array.from(Array(numCols), () => Math.random() > 0.7 ? 1 : 0))
  }
  return rows;
}

const countNeighbors = (grid: any, x: number, y: number) => {
  return operations.reduce((acc, [i, j]) => {
    const row = (x + i + numRows) % numRows;
    const col = (y + j + numCols) % numCols;
    acc += grid[row][col];
    return acc;
  }, 0);
};

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(
    () => {
      if (!runningRef.current) {
        return;
      }
      setGrid((g) => {
        return produce(g, gridCopy => {
          for (let i = 0; i < numRows; i++) {
            for (let k = 0; k < numCols; k++) {
              let neighbors = 0;
              operations.forEach(([x, y]) => {
                const newI = i + x;
                const newK = k + y;
                if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                  neighbors += g[newI][newK];
                }
              });
              // const neighbors = countNeighbors(grid, i, k);
              if (neighbors < 2 ||  neighbors > 3) {
                gridCopy[i][k] = 0;
              } else if (g[i][k] === 0 && neighbors === 3) {
                gridCopy[i][k] = 1;
              }
            }
          }
        })
      })
      setTimeout(runSimulation, 500);
    }, [],
  )

  return (
    <div
    style={{ 
      width: '100%', 
      margin: 'auto', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly'
    }}
    >
      <div 
        style={{ justifyContent: 'center', display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)` }}
      >
        {grid.map((rows, i) => 
          rows.map((col, k) => 
          <div 
            key={`${i} - ${k}`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][k] = grid[i][k] ? 0 : 1;
              });
              setGrid(newGrid);
            }} 
            style={{ width: 20, height: 20, 
              backgroundColor: grid[i][k] ? '#c70039' : undefined,
              border: 'solid 1px black'
            }} 
          />)
        )}
      </div>
      <div style={{ 
        textAlign: 'center',
        justifyContent: "space-evenly",
        display: 'flex',
        marginTop: '8px'
      }}>
        <button
          style={buttonStyle}
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >{running ? <IonIcon style={iconStyle} icon={pause}></IonIcon> : <IonIcon style={iconStyle} icon={play}></IonIcon>}</button>
        <button
          style={buttonStyle}
          onClick={() => {
            const rows = [];
            for (let index = 0; index < numRows; index++) {
              rows.push(Array.from(Array(numCols), () => Math.random() > 0.7 ? 1 : 0))
            }
            setGrid(rows);
          }}
        ><IonIcon style={iconStyle} icon={reload}></IonIcon></button>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#e43f5a',
  borderRadius: "50%",
  alignItems: "center",
  transition: "background-color 500ms",
  willChange: "background-color",
  width: '70px',
  height: '70px',
  color: 'white',
  outline: 'none'
};

const iconStyle = {
  fontSize: '38px'
}

export default ExploreContainer;
