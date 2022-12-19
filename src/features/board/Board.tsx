import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Hand } from '../hand/Hand';
import { Paper, Button, ButtonGroup, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { DiscardPile } from '../discardPile/DiscardPile';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { skipTurnAsync, getGameStateAsync, selectGameState, reset } from '../game/gameSlice';
import { UnoCardType } from '../card/cardAPI';
import { unoCardColorConvert } from '../card/Card';

export default function Table() {
  const gameState = useAppSelector(selectGameState);
  const dispatch = useAppDispatch();
  const [bgColor, setBgColor] = useState(unoCardColorConvert('red'));

  useEffect(() => {
    const len = gameState.discardPile.length;
    const lastCard: (UnoCardType | null) = len ? gameState.discardPile[len - 1] : null
    setBgColor(unoCardColorConvert(lastCard === null ? 'red' : lastCard.color))
  }, [gameState.discardPile])

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
    if (!!winner) {
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
      backgroundColor: bgColor,
      border: '2px black solid',
      borderRadius: '10px',
      margin: '2px',
      transition: 'background-color 500ms ease-out'
    }}>
      <Box sx={{
        width: "100%",
        height: "100%",
        margin: "10px"
      }}>
        <Box>
          <DiscardPile />
        </Box>
      </Box>
    </Box>
    <Box sx={{
      width: "100%",
      height: "30%",
      backgroundColor: 'primary.main',
      border: '2px black solid',
      borderRadius: '10px',
      margin: '2px',
    }}>
      <Box sx={{
        width: "100%",
        height: "100%",
        margin: "10px",
      }}>
        <Hand />
      </Box>

    </Box>
    <Box sx={{
      width: "100%",
      height: "10%",
      backgroundColor: 'primary.main',
      border: '2px black solid',
      borderRadius: '10px',
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