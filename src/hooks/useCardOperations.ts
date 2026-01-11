import { useCallback } from 'react'
import type { Column, Card } from '../components/types'

export function useCardOperations(columnId: string, setColumns: React.Dispatch<React.SetStateAction<Column[]>>) {
  const updateCard = useCallback((cardId: string, title: string) => {
    setColumns((prev: Column[]) =>
      prev.map((col: Column) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((c: Card) =>
                c.id === cardId ? { ...c, title } : c
              )
            }
          : col
      )
    )
  }, [columnId, setColumns])

  const deleteCard = useCallback((cardId: string) => {
    setColumns((prev: Column[]) =>
      prev.map((col: Column) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c: Card) => c.id !== cardId) }
          : col
      )
    )
  }, [columnId, setColumns])

  return { updateCard, deleteCard }
}
