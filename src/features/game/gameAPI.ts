import axios from "axios";
import { UnoActionCardType, UnoCardType, UnoNumberCardType, unoCardToPostBody } from "../card/cardAPI";
import { isUnoActionCardLabel } from "../card/cardAPI";

const server = "http://144.202.8.64:8080"

export interface GameStateResponseRaw {
  drawPileSize: number;
  discardPile: any[];
  currentPlayer: string;
  playerId: string;
  direction: number;
  player_hands: any[];
  winner: string | null;
}

export interface GameStateResponse {
  drawPileSize: number;
  discardPile: UnoCardType[];
  currentPlayer: string;
  playerId: string;
  direction: number;
  playerHands: UnoCardType[];
  winner: string | null;
}

export interface RoomInfoResponse {
  roomId: string;
  roomSize: number;
  players: string[];
  gameStart: boolean;
}

export interface RoomResponse {
  roomInfo : RoomInfoResponse
  playerId: string
}

function getUnoCardLabel(unoCard : any) {
  return ((unoCard[0] as string).toLowerCase())
}

function getUnoCardColor(unoCard : any) {
  if (unoCard[1].length === 1) {
    return ((unoCard[1][0] as string)).toLowerCase()
  } else {
    return ((unoCard[1][0][0] as string)).toLowerCase()
  }
  
}

function getUnoCardNumber(unoCard : any) {
  return ((unoCard[1][1] as number)).toString()
}

function getUnoCard(unoCard : any) : UnoCardType {
  const label = getUnoCardLabel(unoCard);
  const color = getUnoCardColor(unoCard);
  if(isUnoActionCardLabel(label)) {
    return {
      label : label,
      color: color
    } as UnoActionCardType
  } else {
    const number = getUnoCardNumber(unoCard);
    return {
      label : label,
      color: color,
      number: number,
    } as UnoNumberCardType
  }
}

function transformUnoCardsResponse(unoCards : any[]) : UnoCardType[] {
  return unoCards.map(getUnoCard);
}

function transformGameStateResponseRawToGameStateResponse(resRaw : GameStateResponseRaw) : GameStateResponse{
  const playerHands = transformUnoCardsResponse(resRaw.player_hands);
  const discardPile = transformUnoCardsResponse(resRaw.discardPile);
  return {
    drawPileSize: resRaw.drawPileSize,
    discardPile,
    currentPlayer: resRaw.currentPlayer,
    playerId: resRaw.playerId,
    direction: resRaw.direction,
    playerHands,
    winner: resRaw.winner
  };
}

export async function skipTurn(playerId: string, roomId: string) {
  const params = {
    roomId,
    playerId,
  };
  const res = await axios.post(
    server + '/api/skipTurn',
    null,
    {params}
  )

  return transformGameStateResponseRawToGameStateResponse(res.data)
}

export async function playCard(playerId: string, roomId: string, card : UnoCardType) {
 const params = {
  roomId,
  playerId,
  ...unoCardToPostBody(card)
 }
 const res = await axios.post(
  server + '/api/playCard',
  null,
  {
    params
  }
 )

 return transformGameStateResponseRawToGameStateResponse(res.data)
}

export async function getGameState(playerId: string, roomId: string) {
  const res = await axios.post(
    server + '/api/getGameByRoomId',
    null,
    {
      params : {
        roomId,
        playerId,
      }
    }
  );
  const resRaw = res.data as GameStateResponseRaw;
  return transformGameStateResponseRawToGameStateResponse(resRaw);
}

export async function createRoom(roomSize : number) {
  const res = await axios.post(
    server + '/api/createRoom',
    null,
    {
      params: {
        roomSize
      }
    }
  )
  
  return res.data as RoomResponse
}

export async function joinRoom(roomId : string) {
  const res = await axios.post(
    server + '/api/joinRoom',
    null,
    {
      params: {
        roomId: roomId
      }
    }
  );
  return res.data as RoomResponse
}

export async function getRoomById(roomId : string) {
  const res = await axios.get(
    server + '/api/getRoomById',
    {
      params: {
        roomId
      }
    }
  )

  return res.data as RoomInfoResponse
}

export async function startGameByRoomId(roomId : string, playerId: string) {
  const res = await axios.post(
    server + '/api/startGameByRoomId',
    null,
    {
      params : {
        roomId,
        playerId
      }
    }
  )
  return res.data
}