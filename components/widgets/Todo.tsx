'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckSquare, Plus, Trash2 } from 'lucide-react'
import { TodoItem, addTodo, updateTodo, deleteTodo } from '@/lib/storage/browser-home'

interface TodoProps {
  todos: TodoItem[]
  onUpdate: () => void
}

export function Todo({ todos, onUpdate }: TodoProps) {
  const [newTodoText, setNewTodoText] = useState('')

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim())
      setNewTodoText('')
      onUpdate()
    }
  }

  const handleToggleTodo = (id: string, completed: boolean) => {
    updateTodo(id, { completed })
    onUpdate()
  }

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id)
    onUpdate()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  return (
    <Card className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <CheckSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Tasks</h3>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleAddTodo} size="icon" variant="secondary">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No tasks yet. Add one to get started!
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={(checked) =>
                    handleToggleTodo(todo.id, checked as boolean)
                  }
                />
                <span
                  className={`flex-1 text-sm ${
                    todo.completed
                      ? 'line-through text-gray-400 dark:text-gray-600'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {todo.text}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
