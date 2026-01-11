import { DndContext, type DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { useKanbanLogic } from '../hooks/useKanbanLogic'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Column from './Column'
import './kanban.css'
import type { Column as ColumnType } from './types'

const STORAGE_KEY = 'kanban-board-data'

const initialData: ColumnType[] = [
  {
    id: 'todo',
    title: 'Todo',
    cards: [
      { id: '1', title: 'Create initial project plan' },
      { id: '2', title: 'Design landing page' }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [{ id: '3', title: 'Implement authentication' }]
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ id: '4', title: 'Write API documentation' }]
  }
]

export default function KanbanBoard() {
  const [columns, setColumnsStorage] = useLocalStorage<ColumnType[]>(STORAGE_KEY, initialData)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { handleDragEnd: getDragResult } = useKanbanLogic()

  const setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>> = (value) => {
    const newValue = typeof value === 'function' ? value(columns) : value
    setColumnsStorage(newValue)
  }

  const activeDraggedCard = useMemo(() => {
    if (!activeId) return null
    return columns.flatMap(col => col.cards).find(card => card.id === activeId)
  }, [activeId, columns])

  const handleDragEnd = (event: DragEndEvent) => {
    const result = getDragResult(event, columns)
    if (result) {
      setColumns(result)
    }
    setActiveId(null)
  }

  return (
    <DndContext
      onDragEnd={(event) => {
        handleDragEnd(event)
      }}
      onDragStart={(event) => {
        setActiveId(String(event.active.id))
      }}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="kanban-board">
        {columns.map(col => (
          <Column
            key={col.id}
            column={col}
            setColumns={setColumns}
          />
        ))}
      </div>
      <DragOverlay>
        {activeDraggedCard && (
          <div className="card card-dragging">
            <span>{activeDraggedCard.title}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
