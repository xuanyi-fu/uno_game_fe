import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { UnoCardType } from '../card/cardAPI';
import { getGameState, createRoom, joinRoom, getRoomById, startGameByRoomId, playCard, GameStateResponse, skipTurn } from './gameAPI';
import { Draft } from '@reduxjs/toolkit';

export interface GameState {
  gameStatus: 'idle' | 'loading' | 'finished';
  drawPileSize: number;
  discardPile: UnoCardType[];
  currentPlayer: string;
  direction: number;
  hands: UnoCardType[];
  winner: string | null;

  room: {
    status: 'idle' | 'loading' | 'joined';
    playerId: string;
    roomId: string;
    size: number;
    joinedCount: number;
    start: boolean;
  }
}

const initialState: GameState = {
  gameStatus: 'idle',
  drawPileSize: 0,
  discardPile: [],
  currentPlayer: "",
  direction: 0,
  hands: [],
  winner: null,

  room: {
    status: 'idle',
    playerId: "",
    roomId: "",
    size: 0,
    joinedCount: 0,
    start: false
  }
}

export const skipTurnAsync = createAsyncThunk(
  'game/SkipTurn',
  async (params: { playerId: string, roomId: string }) => {
    const response = await skipTurn(params.playerId, params.roomId);
    return response;
  }
)

export const playCardAsync = createAsyncThunk(
  'game/playCard',
  async (params: { playerId: string, roomId: string, card: UnoCardType }) => {
    const response = await playCard(params.playerId, params.roomId, params.card);
    return response;
  }
)

export const getGameStateAsync = createAsyncThunk(
  'game/getGameState',
  async (params: { playerId: string, roomId: string }) => {
    const response = await getGameState(params.playerId, params.roomId);
    return response;
  }
);

export const createRoomAsync = createAsyncThunk(
  'game/createRoom',
  async (roomSize: number) => {
    const response = await createRoom(roomSize)
    return response;
  }
)

export const joinRoomAsync = createAsyncThunk(
  'game/joinRoom',
  async (roomId: string) => {
    const response = await joinRoom(roomId);
    return response;
  }
)

export const getRoomByIdAsync = createAsyncThunk(
  'game/getRoomById',
  async (roomId: string) => {
    const response = await getRoomById(roomId);
    return response;
  }
)

export const startGameByRoomIdAsync = createAsyncThunk(
  'game/startGameByRoomId',
  async (params: { roomId: string, playerId: string }) => {
    const response = await startGameByRoomId(params.roomId, params.playerId);
  }
)

function mergeGameState(state: Draft<GameState>, response: GameStateResponse) {
  state.gameStatus = 'idle';
  state.currentPlayer = response.currentPlayer;
  state.direction = response.direction;
  state.discardPile = response.discardPile.reverse()
  state.hands = response.playerHands;
  state.room.playerId = response.playerId;
  if (response.winner !== null) {
    state.gameStatus = 'finished';
    state.winner = response.winner;
  }
}

export const gameSlice = createSlice(
  {
    name: 'game',
    initialState,
    reducers: {
      setRoomIdAndPlayerId: (state, action: PayloadAction<{ roomId: string, playerId: string }>) => {
        state.room.roomId = action.payload.roomId;
        state.room.playerId = action.payload.playerId;
        state.room.status = 'joined';
      },
      reset: (state) => {
        state.currentPlayer = '';
        state.direction = 0;
        state.discardPile = [];
        state.drawPileSize = 0;
        state.gameStatus = 'idle';
        state.hands = [];
        state.room.joinedCount = 0;
        state.room.playerId = '';
        state.room.roomId = '';
        state.room.size = 0;
        state.room.start = false;
        state.room.status = 'idle';
        state.winner = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(
          getGameStateAsync.pending, (state) => {
            state.gameStatus = 'loading'
          }
        )
        .addCase(
          getGameStateAsync.fulfilled, (state, action) => {
            const response = action.payload;
            mergeGameState(state, response)
          }
        )
        .addCase(
          getGameStateAsync.rejected, (state, action) => {
            state.gameStatus = 'idle';
          }
        )
        .addCase(
          createRoomAsync.pending, (state) => {
            state.room.status = 'loading';
          }
        )
        .addCase(
          createRoomAsync.fulfilled, (state, action) => {
            const response = action.payload;
            state.room.status = 'joined';
            state.room.playerId = response.playerId;
            state.room.roomId = response.roomInfo.roomId;
            state.room.joinedCount = response.roomInfo.players.length
            state.room.size = response.roomInfo.roomSize
          }
        )
        .addCase(
          createRoomAsync.rejected, (state) => {
            state.room.status = 'idle';
          }
        )
        .addCase(
          joinRoomAsync.pending, (state) => {
            state.room.status = 'loading';
          }
        )
        .addCase(
          joinRoomAsync.fulfilled, (state, action) => {
            const response = action.payload;
            state.room.status = 'joined';
            state.room.playerId = response.playerId;
            state.room.roomId = response.roomInfo.roomId;
            state.room.joinedCount = response.roomInfo.players.length
            state.room.size = response.roomInfo.roomSize
          }
        )
        .addCase(
          joinRoomAsync.rejected, (state) => {
            state.room.status = 'idle';
          }
        )
        .addCase(
          getRoomByIdAsync.pending, (state) => {
            state.room.status = 'loading';
          }
        )
        .addCase(
          getRoomByIdAsync.fulfilled, (state, action) => {
            const response = action.payload;
            state.room.status = 'joined';
            state.room.roomId = response.roomId;
            state.room.joinedCount = response.players.length
            state.room.size = response.roomSize
            state.room.start = response.gameStart
          }
        )
        .addCase(
          getRoomByIdAsync.rejected, (state) => {

          }
        )

        .addCase(
          startGameByRoomIdAsync.pending, (state) => {
            state.room.status = 'loading';
          }
        )
        .addCase(
          startGameByRoomIdAsync.fulfilled, (state) => {
            state.room.status = 'joined'
            state.room.start = true
          }
        )
        .addCase(
          startGameByRoomIdAsync.rejected, (state) => {
            state.room.status = 'joined'
            state.room.start = false
          }
        )

        .addCase(
          playCardAsync.pending, (state) => {
            state.gameStatus = 'loading'
          }
        )
        .addCase(
          playCardAsync.fulfilled, (state, action) => {
            const response = action.payload;
            mergeGameState(state, response)
          }
        )
        .addCase(
          playCardAsync.rejected, (state) => {
            state.gameStatus = 'idle';
          }
        )

        .addCase(
          skipTurnAsync.pending, (state) => {
            state.gameStatus = 'loading'
          }
        )
        .addCase(
          skipTurnAsync.fulfilled, (state, action) => {
            const response = action.payload;
            mergeGameState(state, response)
          }
        )
        .addCase(
          skipTurnAsync.rejected, (state) => {
            state.gameStatus = 'idle';
          }
        )
    }
  }
)

export const { setRoomIdAndPlayerId, reset } = gameSlice.actions

export const selectGameState = (state: RootState) => state.game;

export default gameSlice.reducer;