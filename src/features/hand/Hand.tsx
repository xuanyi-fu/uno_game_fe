import React, { ReactPropTypes, useState, useRef, useEffect } from 'react';
import { UnoCard } from '../card/Card';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { playCardAsync, selectGameState } from '../game/gameSlice';
import { UnoCardType, UnoColorType } from '../card/cardAPI';
import { unoNumberCardSet } from '../card/cardAPI';

export function Hand() {
  const gameState = useAppSelector(selectGameState);
  const dispatch = useAppDispatch();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if(wrapperRef.current) {
      setHeight(wrapperRef.current.offsetHeight);
      setWidth(wrapperRef.current.offsetWidth)
    }
  }, [wrapperRef]);

  const cardWidth = width / 8;
  const cardHeight = cardWidth * 1.5;
  const overlapWidth = cardWidth / 2;
  const maxCardEachCol = 3;
  const overlapHeight = Math.floor((height - cardHeight) / (maxCardEachCol));
  const maxCardEachRow = Math.floor((width - cardWidth) / overlapWidth);

  const computePos = (index : number) => {
    return {
      left: (index % maxCardEachRow) * overlapWidth,
      top: Math.floor(index / maxCardEachRow) * overlapHeight,
      zIndex: index
    }
  }
  
  return <div style={
    { height: "100%",
      width: "100%",
      position: "relative"}
  } ref={wrapperRef}>
    {
      gameState.hands.map( (card, index) => { return <span style={{
        position: "absolute",
        ...computePos(index)
      }}>
          <UnoCard card = {card} width = "100px" onClick={(card : UnoCardType, selectedColor : UnoColorType | null) => {
            if (gameState.currentPlayer == gameState.room.playerId) {
              if (selectedColor !== null) {
                card = {...card, color : selectedColor}
              }
              dispatch(playCardAsync({playerId: gameState.room.playerId, roomId: gameState.room.roomId, card}))
            }
          }}/>
        </span>})
    }
  </div>
}