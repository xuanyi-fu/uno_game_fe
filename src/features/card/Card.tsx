import React, { useState } from 'react';
import { UnoCardType, UnoColorType } from './cardAPI';
import { UnoCardSVG } from './images';
import {animated, useSpring} from 'react-spring'
import { useDrag, useGesture, useHover } from 'react-use-gesture'
import styles from './Card.module.css'
import { setTimeout } from 'timers/promises';
import { Popover, Typography } from '@mui/material';

function unoCardColorConvert(color : UnoColorType) {
  switch (color) {
    case "blue": return "#5555ff";
    case "green": return "#55aa55";
    case "red": return "#ff5555";
    case "yellow" : return "#ffaa00";
  }
}

export function UnoCard(props: { card: UnoCardType, width: string | number | undefined, onClick: (card : UnoCardType) => void}) {
  const [animatedStyle, api] = useSpring(() => ({y : 0}));

  const bind = useGesture({
    onHover:({active}) => {
      api.start({y : active ? -50 : 0})
    }
  })

  const style = {
    width: props.width,
    ["--uno-card-color" as string]: unoCardColorConvert(props.card.color),
  } as React.CSSProperties;
  const CardSvg = UnoCardSVG(props.card);
  return <animated.div {...bind()} onClick={(event: React.MouseEvent<HTMLDivElement>)=>{
    props.onClick(props.card);
  }} className={styles.card} style={{...style, ...animatedStyle}}> <CardSvg />
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