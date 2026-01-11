import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { useState, memo, useCallback } from 'react'
import type { Column as ColumnType } from './types'
import Card from './Card'

interface ColumnProps {
  column: ColumnType
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>
}

function ColumnComponent({ column, setColumns }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id
  })
  const [newCardId, setNewCardId] = useState<string | null>(null)

  const addCard = useCallback(() => {
    const cardId = Date.now().toString()
    setNewCardId(cardId)
    setColumns(prev =>
      prev.map(col =>
        col.id === column.id
          ? {
              ...col,
              cards: [
                ...col.cards,
                { id: cardId, title: '' }
              ]
            }
          : col
      )
    )
  }, [column.id, setColumns])

  return (
    <div className={`column ${column.id}`} ref={setNodeRef}>
      <div className="column-header">
        <h3>{column.title}</h3>
        <button onClick={addCard}>＋</button>
      </div>

      <SortableContext
        items={column.cards.map(card => card.id)}
        strategy={verticalListSortingStrategy}
      >
        {column.cards.map(card => (
          <Card
            key={card.id}
            card={card}
            columnId={column.id}
            setColumns={setColumns}
            isNewCard={card.id === newCardId}
            onEditComplete={() => setNewCardId(null)}
          />
        ))}
      </SortableContext>
    </div>
  )
}

export default memo(ColumnComponent)
