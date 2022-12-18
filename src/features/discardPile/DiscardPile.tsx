import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectGameState } from '../game/gameSlice';
import { UnoCard, UnoCardStatic } from '../card/Card';

export function DiscardPile() {
  const gameState = useAppSelector(selectGameState);
  const cardWidth = 50;
  return <div style={
    { height: "100%",
      position: "relative"}
  }>
    {
      gameState.discardPile.map( (card, index) => { return <span style={{
        position: "absolute",
        left: (index * (cardWidth / 3)).toString() + "px",
        zIndex: index
      }}>
          <UnoCardStatic card = {card} width = {cardWidth}/>
        </span>})
    }
  </div>
}