import React, { useState, useEffect } from 'react';
import './GameBoard.css'; // Lisää tyylit

const CELL_SIZE = 20; // Yhden ruudun koko
const BOARD_SIZE = 20; // Laudoituksen koko (20x20 ruutua)

const GameBoard = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]); // Käärmeen aloituspaikka
  const [food, setFood] = useState(generateFood());
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  // Käärmeen liikkuminen
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) moveSnake();
    }, 200);
    return () => clearInterval(interval);
  }, [snake, direction, gameOver]);

  // Nuolinäppäimet suunnan vaihtamiseen
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Käärmeen liikkumisen logiikka
  const moveSnake = () => {
    const newSnake = [...snake];
    const head = {
      x: newSnake[0].x + direction.x,
      y: newSnake[0].y + direction.y,
    };

    // Tarkista törmäykset seiniin tai itseen
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= BOARD_SIZE ||
      head.y >= BOARD_SIZE ||
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Tarkista ruoan syönti
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  // Ruoan sijainnin luonti
  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  return (
    <div>
      {gameOver ? (
        <div className="game-over">Peli ohi!</div>
      ) : (
        <div
          className="board"
          style={{
            width: `${BOARD_SIZE * CELL_SIZE}px`,
            height: `${BOARD_SIZE * CELL_SIZE}px`,
          }}
        >
          {snake.map((segment, index) => (
            <div
              key={index}
              className="snake-segment"
              style={{
                left: `${segment.x * CELL_SIZE}px`,
                top: `${segment.y * CELL_SIZE}px`,
              }}
            />
          ))}
          <div
            className="food"
            style={{
              left: `${food.x * CELL_SIZE}px`,
              top: `${food.y * CELL_SIZE}px`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default GameBoard;
