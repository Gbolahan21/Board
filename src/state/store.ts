import { create } from 'zustand';
import type { Board } from '../types/board';
import type { Column } from '../types/column';
import type { Card } from '../types/card';

interface AppState {
  boards: Record<string, Board>;
  columns: Record<string, Column>;
  cards: Record<string, Card>;

  // Board actions
  addBoard: (board: Board) => void;
  deleteBoard: (boardId: string) => void;

  // Column actions
  addColumn: (column: Column, boardId: string) => void;
  editColumn: (column: Column) => void;
  deleteColumn: (columnId: string, boardId: string) => void;

  // Card actions
  addCard: (card: Card, columnId: string) => void;
  editCard: (card: Card) => void;
  deleteCard: (cardId: string, columnId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  boards: {},
  columns: {},
  cards: {},

  // ------------------------
  // Board actions
  // ------------------------
  addBoard: (board: Board) =>
    set((state) => ({
      ...state,
      boards: { ...state.boards, [board.id]: board },
    })),

  deleteBoard: (boardId: string) =>
    set((state) => {
      const { [boardId]: removedBoard, ...restBoards } = state.boards;

      // Remove all columns of this board
      const columnIdsToRemove = removedBoard?.columnIds || [];
      const newColumns = { ...state.columns };
      const newCards = { ...state.cards };

      columnIdsToRemove.forEach((colId) => {
        // Remove cards in each column
        const cardIds = state.columns[colId]?.cardIds || [];
        cardIds.forEach((cId) => delete newCards[cId]);
        delete newColumns[colId];
      });

      return {
        ...state,
        boards: restBoards,
        columns: newColumns,
        cards: newCards,
      };
    }),

  // ------------------------
  // Column actions
  // ------------------------
  addColumn: (column: Column, boardId: string) =>
    set((state) => ({
      ...state,
      columns: { ...state.columns, [column.id]: column },
      boards: {
        ...state.boards,
        [boardId]: {
          ...state.boards[boardId],
          columnIds: [...state.boards[boardId].columnIds, column.id],
        },
      },
    })),

  editColumn: (column: Column) =>
    set((state) => ({
      ...state,
      columns: { ...state.columns, [column.id]: column },
    })),

  deleteColumn: (columnId: string, boardId: string) =>
    set((state) => {
      const { [columnId]: removedColumn, ...restColumns } = state.columns;

      // Remove cards in column
      const newCards = { ...state.cards };
      removedColumn?.cardIds.forEach((cId) => delete newCards[cId]);

      return {
        ...state,
        columns: restColumns,
        cards: newCards,
        boards: {
          ...state.boards,
          [boardId]: {
            ...state.boards[boardId],
            columnIds: state.boards[boardId].columnIds.filter(
              (id) => id !== columnId
            ),
          },
        },
      };
    }),

  // ------------------------
  // Card actions
  // ------------------------
  addCard: (card: Card, columnId: string) =>
    set((state) => ({
      ...state,
      cards: { ...state.cards, [card.id]: card },
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId],
          cardIds: [...state.columns[columnId].cardIds, card.id],
        },
      },
    })),

  editCard: (card: Card) =>
    set((state) => ({
      ...state,
      cards: { ...state.cards, [card.id]: card },
    })),

  deleteCard: (cardId: string, columnId: string) =>
    set((state) => {
        const restCards = { ...state.cards };
        delete restCards[cardId]; // removes the card directly

        return {
        ...state,
        cards: restCards,
        columns: {
            ...state.columns,
            [columnId]: {
            ...state.columns[columnId],
            cardIds: state.columns[columnId].cardIds.filter(
                (id) => id !== cardId
            ),
            },
        },
        };
    }),
}));