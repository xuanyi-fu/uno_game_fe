import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Room } from '../room/Room';
import Board from '../board/Board';
import { Box, Dialog, Slide, AppBar, Toolbar, IconButton, Typography, Button} from '@mui/material';
import { BrowserView, MobileView } from 'react-device-detect';
import { TransitionProps } from '@mui/material/transitions';
import { useAppSelector } from '../../app/hooks';
import { selectGameState } from './gameSlice';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Game() {
  const gameState = useAppSelector(selectGameState);
  const [open, setOpen] = React.useState(true);
  const [forceOpen, setForceOpen] = React.useState(false);

  useEffect(() => {
    if(!gameState.room.start) {
      setOpen(true);
    } else {
      setOpen(false);
      setForceOpen(false);
    }
  }, 
  [gameState.room.status]);

  const shouldOpen = forceOpen || open;

  const handleClose = () => {
    setOpen(false);
    setForceOpen(false);
  };

  return <>
    <BrowserView>
      <div style={{ height: "100vh" }}>
        <Grid container spacing={1} style={{ height: "100%" }}>
          <Grid xs={2}>
            <Item style={{ height: "100%" }}>
              <Room />
            </Item>
          </Grid>
          <Grid xs={10}>
            <Item style={{ height: "100%" }}>{
              <Board />
            }</Item>
          </Grid>
        </Grid>
      </div>
    </BrowserView>
    <MobileView>
    <Dialog
        fullWidth
        open={shouldOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            {/* <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              ❌
            </IconButton> */}
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Room
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{
          width: "95%",
          margin: "2%"
        }}>
          <Room/>
        </Box>
        
      </Dialog>
      <div style={{ height: "100vh" }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            alignContent: "center",
            position: "relative"
          }}
        >
          <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <Button color="inherit" onClick={() => {setForceOpen(true)}}>Join Room</Button>
        </Toolbar>
      </AppBar>
          <Box sx={{
            width: "95%",
            height: "100%",
            margin: "2%",
          }}>
            <Board />
          </Box>
        </Box>
      </div>
    </MobileView>
  </>
}