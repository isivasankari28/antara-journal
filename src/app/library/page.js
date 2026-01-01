'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Book, Star, Bookmark, MoreVertical, Trash2, Lightbulb, PenTool, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LibraryPage() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', status: 'wishlist' });
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('current');

    // Sparks Management
    const [sparkInput, setSparkInput] = useState('');
    const [activeBookId, setActiveBookId] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('antara_library');
        if (saved) setBooks(JSON.parse(saved));
    }, []);

    const saveBook = () => {
        if (!newBook.title.trim()) return;
        const book = {
            id: Date.now(),
            ...newBook,
            progress: 0,
            sparks: [], // Array of small notes
            review: '', // Final blog/review
            addedAt: new Date().toISOString()
        };
        const updated = [...books, book];
        setBooks(updated);
        localStorage.setItem('antara_library', JSON.stringify(updated));
        setNewBook({ title: '', author: '', status: 'wishlist' });
        setIsOpen(false);
    };

    const updateBook = (id, updates) => {
        const updated = books.map(b => b.id === id ? { ...b, ...updates } : b);
        setBooks(updated);
        localStorage.setItem('antara_library', JSON.stringify(updated));
    };

    const addSpark = (bookId) => {
        if (!sparkInput.trim()) return;
        const book = books.find(b => b.id === bookId);
        const newSpark = {
            id: Date.now(),
            text: sparkInput,
            date: new Date().toISOString()
        };
        const updatedSparks = [...(book.sparks || []), newSpark];
        updateBook(bookId, { sparks: updatedSparks });
        setSparkInput('');
    };

    const deleteSpark = (bookId, sparkId) => {
        const book = books.find(b => b.id === bookId);
        const updatedSparks = book.sparks.filter(s => s.id !== sparkId);
        updateBook(bookId, { sparks: updatedSparks });
    };

    const deleteBook = (id) => {
        const updated = books.filter(b => b.id !== id);
        setBooks(updated);
        localStorage.setItem('antara_library', JSON.stringify(updated));
    };

    const getBooksByStatus = (status) => books.filter(b => b.status === status);

    return (
        <div className="max-w-6xl mx-auto space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-foreground/90">Library</h1>
                    <p className="text-muted-foreground mt-1">Wisdom gathered, stories held.</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full shadow-sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Book
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-xl">New Arrival</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input
                                placeholder="Title"
                                value={newBook.title}
                                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                            />
                            <Input
                                placeholder="Author"
                                value={newBook.author}
                                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                            />
                            <div className="grid grid-cols-3 gap-2">
                                {['wishlist', 'current', 'completed'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setNewBook({ ...newBook, status })}
                                        className={cn(
                                            "p-2 rounded-lg text-sm border capitalize transition-all",
                                            newBook.status === status
                                                ? "bg-primary/20 border-primary text-primary"
                                                : "bg-muted/50 border-transparent hover:bg-muted"
                                        )}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                            <Button onClick={saveBook} className="w-full">Shelve Book</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/30 p-1 rounded-full max-w-md mx-auto">
                    <TabsTrigger value="current" className="rounded-full">Currently Reading</TabsTrigger>
                    <TabsTrigger value="wishlist" className="rounded-full">Wishlist</TabsTrigger>
                    <TabsTrigger value="completed" className="rounded-full">Wisdom Gathered</TabsTrigger>
                </TabsList>

                {/* CURRENTLY READING */}
                <TabsContent value="current" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {getBooksByStatus('current').map(book => (
                            <Card key={book.id} className="bg-card/40 border-border/50 overflow-hidden flex flex-col">
                                <CardHeader className="bg-muted/10 border-b border-border/30">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="font-serif text-2xl">{book.title}</CardTitle>
                                            <p className="text-sm text-muted-foreground italic mt-1">{book.author}</p>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateBook(book.id, { status: 'completed' })} title="Finish Book">
                                            <Check className="w-5 h-5 text-primary" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6 flex-1 flex flex-col">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                            <span>Progress</span>
                                            <span>{book.progress}%</span>
                                        </div>
                                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                className="absolute top-0 left-0 h-full bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${book.progress}%` }}
                                            />
                                            <input
                                                type="range"
                                                min="0" max="100"
                                                value={book.progress}
                                                onChange={(e) => updateBook(book.id, { progress: parseInt(e.target.value) })}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                                            <Lightbulb className="w-4 h-4 text-amber-500" /> Sparks ({book.sparks?.length || 0})
                                        </h4>
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Capture a thought..."
                                                    value={activeBookId === book.id ? sparkInput : ''}
                                                    onChange={(e) => {
                                                        setActiveBookId(book.id);
                                                        setSparkInput(e.target.value);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') addSpark(book.id);
                                                    }}
                                                    className="flex-1 bg-background/50"
                                                />
                                                <Button size="icon" onClick={() => addSpark(book.id)} disabled={!sparkInput.trim() || activeBookId !== book.id}>
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <AnimatePresence mode="popLayout">
                                                {(book.sparks || []).slice().reverse().map(spark => (
                                                    <motion.div
                                                        key={spark.id}
                                                        layout
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        className="group p-3 rounded-lg bg-background/40 border border-border/40 text-sm relative"
                                                    >
                                                        <p className="pr-6">{spark.text}</p>
                                                        <span className="text-[10px] text-muted-foreground mt-2 block">{new Date(spark.date).toLocaleDateString()}</span>
                                                        <button
                                                            onClick={() => deleteSpark(book.id, spark.id)}
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* WISHLIST */}
                <TabsContent value="wishlist">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {getBooksByStatus('wishlist').map(book => (
                            <motion.div
                                key={book.id}
                                layout
                                className="aspect-[2/3] bg-primary/5 rounded-xl border border-primary/10 flex flex-col items-center justify-center p-4 text-center hover:bg-primary/10 transition-colors relative group"
                            >
                                <Book className="w-8 h-8 text-primary/40 mb-3" />
                                <h3 className="font-serif font-medium line-clamp-2">{book.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{book.author}</p>

                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <Button size="sm" onClick={() => updateBook(book.id, { status: 'current' })}>Start Reading</Button>
                                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteBook(book.id)}>Remove</Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* COMPLETED / WISDOM GATHERED */}
                <TabsContent value="completed" className="space-y-8">
                    {getBooksByStatus('completed').map(book => (
                        <div key={book.id} className="relative group">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col lg:flex-row gap-8 pl-4 lg:pl-0">
                                {/* Left: Book Info & Review */}
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-serif text-4xl text-foreground/90">{book.title}</h3>
                                            <div className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium flex items-center gap-1">
                                                <Star className="w-3 h-3" /> Completed
                                            </div>
                                        </div>
                                        <p className="text-lg text-muted-foreground italic mt-1 font-serif">{book.author}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <PenTool className="w-3 h-3" /> My Review
                                        </label>
                                        <Textarea
                                            placeholder="Write your reflection... How did this book change you?"
                                            value={book.review || ''}
                                            onChange={(e) => updateBook(book.id, { review: e.target.value })}
                                            className="min-h-[200px] text-lg leading-relaxed font-serif bg-transparent border-none focus-visible:ring-0 pl-0 resize-y"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-border/40 flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">Finished on {new Date().toLocaleDateString()}</span>
                                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteBook(book.id)}>
                                            Delete Entry
                                        </Button>
                                    </div>
                                </div>

                                {/* Right: Sparks Collection */}
                                <div className="w-full lg:w-96 space-y-4">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4" /> Captured Sparks
                                    </h4>
                                    <div className="bg-muted/20 rounded-xl p-4 space-y-4 max-h-[500px] overflow-y-auto">
                                        {(book.sparks && book.sparks.length > 0) ? (
                                            book.sparks.map(spark => (
                                                <div key={spark.id} className="p-4 bg-background rounded-lg border border-border/50 shadow-sm text-sm italic">
                                                    "{spark.text}"
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-xs text-muted-foreground py-10">No sparks captured.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function Check({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}
