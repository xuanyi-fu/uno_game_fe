import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Button, Box, Stack, CircularProgress, TextField, TextareaAutosize } from '@mui/material';
import { selectGameState } from '../game/gameSlice';
import { getRoomByIdAsync, startGameByRoomIdAsync } from '../game/gameSlice';


export default function JoinedRoom() {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(selectGameState);
  const [count, setCount] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const gameStarted = gameState.room.start;

  useEffect(() => {
    let id = setInterval(() => {
      if (!gameStarted && autoRefresh) {
        setCount(count + 1);
        dispatch(getRoomByIdAsync(gameState.room.roomId));
      }
    }, 1000);
    return () => { clearInterval(id) };
  }, [autoRefresh, count, gameStarted]);

  return <Stack spacing={2}>
    <TextField
      variant="standard"
      label="Room ID"
      InputProps={{
        readOnly: true,
      }}
      value={gameState.room.roomId} />
    <TextField
      variant="standard"
      label="Player ID"
      InputProps={{
        readOnly: true,
      }}
      value={gameState.room.playerId} />
    <span>
      {"Players Joined: " + gameState.room.joinedCount + " / " + gameState.room.size}
    </span>
    <Box sx={{ m: 1, position: 'relative' }}>
      <Button variant='contained' onClick={() => {
        setAutoRefresh(!autoRefresh);
      }}>
        Auto Refresh
      </Button>
      {!gameStarted && autoRefresh && (
        <CircularProgress
          size={36}
          thickness={4}
          sx={{
            color: 'white',
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-18px',
            marginLeft: '-18px',
          }}
        />
      )}
    </Box>
    <Box sx={{ m: 1, position: 'relative' }}>
      <Button disabled={gameStarted} variant='contained' onClick={() => {
        dispatch(startGameByRoomIdAsync({ roomId: gameState.room.roomId, playerId: gameState.room.playerId }))
      }}>
        Game Start
      </Button>
    </Box>
    <span>
      {"Game Started : " + (gameStarted ? "YES" : "NO")}
    </span>
  </Stack>
}