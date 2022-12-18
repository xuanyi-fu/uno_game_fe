import {ReactComponent as Number0} from './0.svg'
import {ReactComponent as Number1} from './1.svg'
import {ReactComponent as Number2} from './2.svg'
import {ReactComponent as Number3} from './3.svg'
import {ReactComponent as Number4} from './4.svg'
import {ReactComponent as Number5} from './5.svg'
import {ReactComponent as Number6} from './6.svg'
import {ReactComponent as Number7} from './7.svg'
import {ReactComponent as Number8} from './8.svg'
import {ReactComponent as Number9} from './9.svg'
import {ReactComponent as Draw2} from './Draw2.svg'
import {ReactComponent as Draw4} from './Draw4.svg'
import {ReactComponent as Reverse} from './Reverse.svg'
import {ReactComponent as Skip} from './Skip.svg'
import {ReactComponent as Wild} from './Wild.svg'

import { UnoCardType } from '../cardAPI'
import { ReactComponentElement } from 'react'

const name2svg = {
  "0" : Number0,
  "1" : Number1,
  "2" : Number2,
  "3" : Number3,
  "4" : Number4,
  "5" : Number5,
  "6" : Number6,
  "7" : Number7,
  "8" : Number8,
  "9" : Number9,
  "draw2": Draw2,
  "draw4": Draw4,
  "reverse": Reverse,
  "skip": Skip,
  "wild": Wild
}

export function UnoCardSVG(card : UnoCardType) {
 if(card.label == 'number') {
  const c = card;
  return name2svg[card.number]
 } else {
  return name2svg[card.label]
 }
}
