'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming input exists, if not I'll standard input.
import { cn } from '@/lib/utils';

export default function TodosPage() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('todos');
        if (saved) {
            setTodos(JSON.parse(saved));
        }
    }, []);

    const saveTodos = (updatedTodos) => {
        setTodos(updatedTodos);
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
    };

    const addTodo = (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        const todo = {
            id: Date.now(),
            text: newTodo,
            completed: false,
        };

        saveTodos([todo, ...todos]);
        setNewTodo('');
    };

    const toggleTodo = (id) => {
        const updated = todos.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        saveTodos(updated);
    };

    const deleteTodo = (id) => {
        const updated = todos.filter(t => t.id !== id);
        saveTodos(updated);
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 min-h-[60vh]">
            <div className="space-y-2">
                <h1 className="text-3xl font-serif text-foreground/90">Daily Intentions</h1>
                <p className="text-muted-foreground">Small steps, handled with grace.</p>
            </div>

            <form onSubmit={addTodo} className="relative">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="New intention..."
                    className="w-full bg-transparent border-b border-border py-3 text-lg focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/40"
                />
                <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="absolute right-0 top-2 text-muted-foreground hover:text-primary"
                    disabled={!newTodo.trim()}
                >
                    <Plus className="w-5 h-5" />
                </Button>
            </form>

            <ul className="space-y-3">
                <AnimatePresence>
                    {todos.map((todo) => (
                        <motion.li
                            key={todo.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-card/40 transition-colors cursor-pointer"
                            onClick={() => toggleTodo(todo.id)}
                        >
                            <div className={cn(
                                "w-5 h-5 rounded-full border border-primary/40 flex items-center justify-center transition-all duration-300",
                                todo.completed ? "bg-primary border-primary" : "bg-transparent"
                            )}>
                                {todo.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>

                            <span className={cn(
                                "flex-1 text-lg font-light transition-all duration-300",
                                todo.completed ? "text-muted-foreground line-through decoration-primary/30" : "text-foreground"
                            )}>
                                {todo.text}
                            </span>

                            <Button
                                size="icon"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTodo(todo.id);
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </motion.li>
                    ))}
                </AnimatePresence>
                {todos.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground/30 italic">
                        No tasks yet. Enjoy the stillness.
                    </div>
                )}
            </ul>
        </div>
    );
}
