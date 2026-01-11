import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, memo } from 'react'
import type { Card as CardType, Column } from './types'
import { useCardOperations } from '../hooks/useCardOperations'

function CardComponent({ 
  card, 
  columnId, 
  setColumns, 
  isNewCard = false, 
  onEditComplete 
}: {
  card: CardType
  columnId: string
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>
  isNewCard?: boolean
  onEditComplete?: () => void
}) {
  const [editing, setEditing] = useState(isNewCard)
  const [value, setValue] = useState(card.title)
  const { updateCard, deleteCard } = useCardOperations(columnId, setColumns)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: card.id,
      disabled: editing
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isDragging ? '0 8px 16px rgba(0, 0, 0, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.06)',
    zIndex: isDragging ? 1000 : 'auto'
  }

  const save = () => {
    if (!value.trim()) {
      setValue(card.title)
      setEditing(false)
      onEditComplete?.()
      return
    }

    updateCard(card.id, value.trim())
    setEditing(false)
    onEditComplete?.()
  }

  const cancel = () => {
    setValue(card.title)
    setEditing(false)
    onEditComplete?.()
  }

  const remove = () => {
    deleteCard(card.id)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card"
    >
      <div
        className="card-content"
        {...attributes}
        {...(!editing ? listeners : {})}
        style={{ flex: 1 }}
      >
        {editing ? (
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={e => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') cancel()
            }}
            autoFocus
          />
        ) : (
          <span>{card.title}</span>
        )}
      </div>

      <button onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}>✏️</button>

      <button onClick={(e) => {
        e.stopPropagation();
        remove();
      }}>🗑</button>
    </div>
  )
}

export default memo(CardComponent)
