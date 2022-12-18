import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Room } from '../room/Room';
import Board from '../board/Board';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Game() {
  return <div style={{height: "100vh"}}>
  <Grid container spacing={1} style={{height: "100%"}}>
    <Grid xs={2}>
      <Item style={{height: "100%"}}>
        <Room/>
      </Item>
    </Grid>
    <Grid xs={10}>
      <Item style={{height: "100%"}}>{
         <Board/>
      }</Item>
    </Grid>
  </Grid>
  </div>
}