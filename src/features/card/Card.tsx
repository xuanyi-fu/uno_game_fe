import React, { useState } from 'react';
import { UnoCardType, UnoColorType } from './cardAPI';
import { UnoCardSVG } from './images';
import { animated, useSpring} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import styles from './Card.module.css'
import { Popper, Box, Button, ButtonGroup, Paper} from '@mui/material';

export function unoCardColorConvert(color : UnoColorType) {
  switch (color) {
    case "blue": return "#5555ff";
    case "green": return "#55aa55";
    case "red": return "#ff5555";
    case "yellow" : return "#ffaa00";
  }
}

export function UnoCard(props: { card: UnoCardType, width: string | number | undefined, onClick: (card : UnoCardType, selectedColor: UnoColorType | null) => void}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [animatedStyle, api] = useSpring(() => ({
    y: 0,
    onRest: () => {setAnchorEl(null)}
  }));

  const bind = useGesture({
    onHover:({active}) => {
      api.start({y : active ? -50 : 0})
    }
  })

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const style = {
    width: props.width,
    ["--uno-card-color" as string]: unoCardColorConvert(props.card.color),
  } as React.CSSProperties;
  const CardSvg = UnoCardSVG(props.card);
  return <animated.div {...bind()} onClick={(event: React.MouseEvent<HTMLDivElement>)=>{
    if(props.card.label === 'wild' || props.card.label === 'draw4') {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    } else {
      props.onClick(props.card, null);
    }
  }} className={styles.card} style={{...style, ...animatedStyle}}> <CardSvg />
        <Popper id={id} open={open} anchorEl={anchorEl} placement='top'>
        <Paper elevation={3}>
            <ButtonGroup variant='outlined'>
              <Button onClick={() => {
                props.onClick(props.card, 'red');
              }}>🟥</Button>
              <Button onClick={() => {
                props.onClick(props.card, 'blue');
              }}>🟦</Button>
              <Button onClick={() => {
                props.onClick(props.card, 'green');
              }}>🟩</Button>
              <Button onClick={() => {
                props.onClick(props.card, 'yellow');
              }}>🟨</Button>
            </ButtonGroup>
        </Paper>
      </Popper>
  </animated.div>
}

export function UnoCardStatic(props: { card: UnoCardType, width: string | number | undefined }) {
  const style = {
    width: props.width,
    ["--uno-card-color" as string]: unoCardColorConvert(props.card.color),
  } as React.CSSProperties;
  const CardSvg = UnoCardSVG(props.card);
  return <div className={styles.card} style={{...style}}> <CardSvg /></div>
}