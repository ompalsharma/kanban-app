import type { DragEndEvent } from '@dnd-kit/core'
import type { Column } from '../components/types'

export function useKanbanLogic() {
  const handleDragEnd = (event: DragEndEvent, columns: Column[]) => {
    const { active, over } = event
    if (!over) return

    const fromCol = columns.find(col =>
      col.cards.some(c => c.id === active.id)
    )
    const toCol = columns.find(col => {
      if (col.cards.some(c => c.id === over.id)) return true
      return col.id === over.id
    })

    if (!fromCol || !toCol) return

    if (fromCol.id === toCol.id) {
      const oldIndex = fromCol.cards.findIndex(c => c.id === active.id)
      const newIndex = fromCol.cards.findIndex(c => c.id === over.id)

      if (oldIndex === newIndex) return

      return columns.map(col =>
        col.id === fromCol.id
          ? {
              ...col,
              cards: (() => {
                const newCards = [...col.cards]
                const [movedCard] = newCards.splice(oldIndex, 1)
                newCards.splice(newIndex > oldIndex ? newIndex - 1 : newIndex, 0, movedCard)
                return newCards
              })()
            }
          : col
      )
    } else {
      return columns.map(col => {
        if (col.id === fromCol.id) {
          return {
            ...col,
            cards: col.cards.filter(c => c.id !== active.id)
          }
        }

        if (col.id === toCol.id) {
          const cardToMove = fromCol.cards.find(c => c.id === active.id)
          if (!cardToMove) return col

          if (toCol.cards.some(c => c.id === over.id)) {
            const newIndex = col.cards.findIndex(c => c.id === over.id)
            return {
              ...col,
              cards: [
                ...col.cards.slice(0, newIndex),
                cardToMove,
                ...col.cards.slice(newIndex)
              ]
            }
          }

          return {
            ...col,
            cards: [...col.cards, cardToMove]
          }
        }

        return col
      })
    }
  }

  return { handleDragEnd }
}
