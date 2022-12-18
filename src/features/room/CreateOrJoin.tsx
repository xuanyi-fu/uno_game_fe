import React from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Button, Box, Stack, CircularProgress, TextField, TextareaAutosize } from '@mui/material';
import { selectGameState } from '../game/gameSlice';
import { createRoomAsync, joinRoomAsync, setRoomIdAndPlayerId, getRoomByIdAsync } from '../game/gameSlice';

export default function CreateOrJoin() {
  const [inputRoomId, setInputRoomId] = useState("");
  const [inputPlayerId, setInputPlayerId] = useState("");

  const [inputNumPlayers, setInputNumPlayers] = useState(2);
  const gameState = useAppSelector(selectGameState);
  const dispatch = useAppDispatch();

    return <Box>
      <Stack spacing={2}>
        <TextField
          variant="standard"
          label="Room Size"
          defaultValue={"2"}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          onChange={(event) => {
            setInputNumPlayers(parseInt(event.target.value))
          }} />
        <Button variant='contained' onClick={() => {
          dispatch(createRoomAsync(inputNumPlayers))
        }}>
          Create
        </Button>
        <TextField
          variant="standard"
          label="Room ID"
          required
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          onChange={(event) => {
            setInputRoomId(event.target.value)
          }} />
        <TextField
          variant="standard"
          label="Player ID"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          onChange={(event) => {
            setInputPlayerId(event.target.value)
          }} />
        <Button variant='contained' onClick={() => {
          if(inputPlayerId !== '' && inputRoomId !== '') {
            dispatch(setRoomIdAndPlayerId({roomId: inputRoomId, playerId: inputPlayerId}));
            dispatch(getRoomByIdAsync(gameState.room.roomId))
          } else if (inputRoomId !== '') {
            dispatch(joinRoomAsync(inputRoomId));
          }
        }}>
          Join
        </Button>
      </Stack>
    </Box>
}