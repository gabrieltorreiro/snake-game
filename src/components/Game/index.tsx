import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { board, Canvas, fruit, gameLoopEvent, snake } from './script';

const CanvasStyled = styled.canvas`
    grid-column: 2 / 3;
    border: 1px solid;
`;

const Game = () => {
  const canvasRef = useRef(null);
  
  useEffect(()=>{
    const canvas = canvasRef.current;
    
    const canvasPresenter = new Canvas(canvas, board, snake, fruit);
    gameLoopEvent.attach(canvasPresenter)
  },[]);

  return (
    <CanvasStyled ref={canvasRef}/>
  )
}

export default Game