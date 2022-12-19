import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useState } from 'react';
import { Button, Box, Stack, CircularProgress, TextField, TextareaAutosize } from '@mui/material';
import { createRoomAsync, getRoomByIdAsync, joinRoomAsync, selectGameState, startGameByRoomIdAsync } from '../game/gameSlice';
import JoinedRoom from './JoinedRoom';
import CreateOrJoin from './CreateOrJoin';

export function Room() {
  const gameState = useAppSelector(selectGameState);
  switch (gameState.room.status) {
    case 'idle':
      return <CreateOrJoin />
    case 'loading':
    case 'joined':
      return <JoinedRoom />
    default:
      return <Box></Box>
  }
}