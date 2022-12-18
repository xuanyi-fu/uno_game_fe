import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useState } from 'react';
import { Button, Box, Stack, CircularProgress, TextField, TextareaAutosize } from '@mui/material';
import { createRoomAsync, getRoomByIdAsync, joinRoomAsync, selectGameState, startGameByRoomIdAsync } from '../game/gameSlice';
import { getRoomById, startGameByRoomId } from '../game/gameAPI';

export function Room() {
  const gameState = useAppSelector(selectGameState);
  const [inputRoomId, setInputRoomId] = useState("");
  const [inputNumPlayers, setInputNumPlayers] = useState(1);
  const dispatch = useAppDispatch();
  switch (gameState.room.status) {
    case 'idle': {
      return <Box>
        <Stack spacing={2}>
          <TextField
            variant="standard"
            label="Room Size"
            defaultValue={"1"}
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
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(event) => {
              setInputRoomId(event.target.value)
            }} />
          <Button variant='contained' onClick={() => {
            dispatch(joinRoomAsync(inputRoomId))
          }}>
            Join
          </Button>
        </Stack>
      </Box>
    }
    case 'loading':
      return <CircularProgress />
    case 'joined':
      return <Stack spacing={2}>
        <TextField
          variant="standard"
          label="Room ID"
          InputProps={{
            readOnly: true,
          }}
          defaultValue={gameState.room.roomId} />
        <TextField
          variant="standard"
          label="Player ID"
          InputProps={{
            readOnly: true,
          }}
          defaultValue={gameState.room.playerId} />
        <span>
          {"Players Joined: " + gameState.room.joinedCount + " / " + gameState.room.size}
        </span>
        <Button variant='contained' onClick={() => {
          dispatch(getRoomByIdAsync(gameState.room.roomId))
        }}>
          Refresh
        </Button>
        <Button variant='contained' onClick={() => {
          dispatch(startGameByRoomIdAsync({ roomId: gameState.room.roomId, playerId: gameState.room.playerId }))
        }}>
          Game Start
        </Button>
        <span>
          {"Game Start? : " + (gameState.room.start ? "YES" : "NO")}
        </span>
      </Stack>
    default:
      return <Box></Box>
  }
}