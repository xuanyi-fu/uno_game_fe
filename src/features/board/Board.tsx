import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Hand } from '../hand/Hand';
import { Button, ButtonGroup, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import { DiscardPile } from '../discardPile/DiscardPile';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { skipTurnAsync, getGameStateAsync, selectGameState, reset} from '../game/gameSlice';

export default function Table() {
  const gameState = useAppSelector(selectGameState);
  const dispatch = useAppDispatch();

  const [count, setCount] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const winner = gameState.winner;
  const gameStarted = gameState.room.start;
  const isYourTurn = gameState.room.playerId !== '' && gameState.currentPlayer === gameState.room.playerId;
  const shouldAutoRefresh = (!!!winner) && !isYourTurn && gameStarted && autoRefresh;
  const [backdropOpen, setBackdropOpen] = useState(false);
  const winnerBackdropOpen = !!winner && backdropOpen;

  useEffect(() => {
    let id = setInterval(() => {
      if (shouldAutoRefresh) {
        setCount(count + 1);
        dispatch(getGameStateAsync({ playerId: gameState.room.playerId, roomId: gameState.room.roomId }));
      }
    }, 1000);
    return () => { clearInterval(id) };
  }, [shouldAutoRefresh]);

  useEffect(() => {
    if(!!winner) {
      setBackdropOpen(true);
    }
  }, [winner])

  const handleBackdropClose = () => {
    setBackdropOpen(false);
    dispatch(reset());
  };

  return <Box
    sx={{
      width: "100%",
      height: "100%",
    }}
  >
     <Dialog
        open={winnerBackdropOpen}
        onClose={handleBackdropClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {winner === gameState.room.playerId ? "YOU ARE THE WINNER" : "WINNER IS " + winner}
          </DialogContentText>
        </DialogContent>
      </Dialog>

    <Box sx={{
      width: "100%",
      height: "50%",
      backgroundColor: 'primary.main',
      border: '2px black dashed',
      margin: '2px',
    }}>
      <DiscardPile />
    </Box>
    <Box sx={{
      width: "100%",
      height: "25%",
      backgroundColor: 'primary.main',
      border: '2px black dashed',
      margin: '2px',
    }}>
      <Hand />
    </Box>
    <Box sx={{
      width: "100%",
      height: "10%",
      backgroundColor: 'primary.main',
      border: '2px white',
      margin: '2px',
    }}>
      <ButtonGroup style={{ margin: '10px' }} size="large" variant="contained">
        <Button color='warning' onClick={() => {
          dispatch(skipTurnAsync({ playerId: gameState.room.playerId, roomId: gameState.room.roomId }))
        }}>Skip</Button>
        <Box sx={{ position: 'relative' }}>
          <Button variant='contained' onClick={() => {
            setAutoRefresh(!autoRefresh);
          }}>
            Auto Refresh
          </Button>
          {shouldAutoRefresh && (
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
        <Button disabled={!isYourTurn}>Your Turn</Button>
      </ButtonGroup>
    </Box>
  </Box>
}