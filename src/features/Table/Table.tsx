import { margin } from '@mui/system';
import React, { ReactPropTypes, useState } from 'react';
import Box from '@mui/material/Box';
import { UnoCardType } from '../card/cardAPI';
import { Hand } from '../hand/Hand';
import { Button, ButtonGroup, CircularProgress, Divider, Stack} from '@mui/material';
import { DiscardPile } from '../discardPile/DiscardPile';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { skipTurnAsync, getGameStateAsync, selectGameState } from '../game/gameSlice';
import { skipTurn } from '../game/gameAPI';

export function Table() {
  const gameState = useAppSelector(selectGameState);
  const dispatch = useAppDispatch();

  const started = gameState.room.start

  if(gameState.gameStatus == 'loading') {
    return <CircularProgress/>
  }
  
  return <Box
  sx={{
    width: "100%",
    height: "100%",
  }}
>
  <Box   sx={{
    width: "100%",
    height: "50%",
    backgroundColor: 'primary.main',
    border: '2px black dashed',
    margin: '2px',
  }}>
    <DiscardPile/>
  </Box>
  <Box   sx={{
    width: "100%",
    height: "25%",
    backgroundColor: 'primary.main',
    border: '2px black dashed',
    margin: '2px',
  }}>
    <Hand />
  </Box>
  <Box   sx={{
    width: "100%",
    height: "10%",
    backgroundColor: 'primary.main',
    border: '2px white',
    margin: '2px',
  }}>
      <ButtonGroup style={{margin: '10px'}} size="large" variant="contained">
        <Button onClick={() => {
          dispatch(skipTurnAsync({playerId: gameState.room.playerId, roomId: gameState.room.roomId}))
        }}>Skip</Button>
        <Button onClick={() => {
          dispatch(getGameStateAsync({playerId: gameState.room.playerId, roomId: gameState.room.roomId}))
        }}>Refresh</Button>
      </ButtonGroup>
      <span>
        {"Current Player: " + gameState.currentPlayer}
      </span>
  </Box>
</Box>
}