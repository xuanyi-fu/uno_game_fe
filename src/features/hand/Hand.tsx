import React, { ReactPropTypes, useState } from 'react';
import { UnoCard } from '../card/Card';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { playCardAsync, selectGameState } from '../game/gameSlice';
import { UnoCardType, UnoColorType } from '../card/cardAPI';

export function Hand() {
  const gameState = useAppSelector(selectGameState);
  const dispatch = useAppDispatch();
  return <div style={
    { height: "100%",
      position: "relative",
    backgroundColor: "black"}
  }>
    {
      gameState.hands.map( (card, index) => { return <span style={{
        position: "absolute",
        left: (index * 50).toString() + "px",
        zIndex: index
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