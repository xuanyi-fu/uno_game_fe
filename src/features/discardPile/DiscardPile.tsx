import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectGameState } from '../game/gameSlice';
import { UnoCard, UnoCardStatic } from '../card/Card';
import { unoNumberCardSet } from '../card/cardAPI';

export function DiscardPile() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const gameState = useAppSelector(selectGameState);

  useEffect(() => {
    if (wrapperRef.current) {
      setHeight(wrapperRef.current.offsetHeight);
      setWidth(wrapperRef.current.offsetWidth)
    }
  }, [wrapperRef]);

  const cardWidth = width / 8;
  const cardHeight = cardWidth * 1.5;
  const overlapWidth = cardWidth / 3;
  const maxCardEachCol = 6;
  const overlapHeight = Math.floor((height - cardHeight) / (maxCardEachCol));
  const maxCardEachRow = Math.floor((width - cardWidth) / overlapWidth);

  const computePos = (index: number) => {
    return {
      left: (index % maxCardEachRow) * overlapWidth,
      top: -Math.floor(index / maxCardEachRow) * overlapHeight,
      zIndex: index
    }
  }

  return <div style={
    {
      height: "100%",
      width: "100%",
      position: "relative"
    }
  } ref={wrapperRef}>
    {
      gameState.discardPile.map((card, index) => {
        return <span style={{
          position: "absolute",
          ...computePos(index),
        }}>
          <UnoCardStatic card={card} width={cardWidth} />
        </span>
      })
    }
  </div>
}