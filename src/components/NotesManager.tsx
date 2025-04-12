
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, X, FileText, Calendar, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Note {
  id: string;
  courseId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesManagerProps {
  courseId: number;
}

const NotesManager = ({ courseId }: NotesManagerProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  
  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`course-${courseId}-notes`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [courseId]);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`course-${courseId}-notes`, JSON.stringify(notes));
  }, [notes, courseId]);
  
  const handleCreateNote = () => {
    if (!newNoteContent.trim()) return;
    
    const now = new Date();
    const newNote: Note = {
      id: `note-${Date.now()}`,
      courseId,
      content: newNoteContent,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    
    setNotes([...notes, newNote]);
    setNewNoteContent("");
    setIsCreating(false);
    
    toast({
      title: "Note Added",
      description: "Your note has been saved successfully."
    });
  };
  
  const handleUpdateNote = (noteId: string, content: string) => {
    const now = new Date();
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, content, updatedAt: now.toISOString() } 
        : note
    );
    
    setNotes(updatedNotes);
    setEditingNoteId(null);
    
    toast({
      title: "Note Updated",
      description: "Your changes have been saved successfully."
    });
  };
  
  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    
    toast({
      description: "Note has been deleted."
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium neon-text-primary">My Notes</h3>
        {!isCreating && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsCreating(true)}
            className="glow-effect"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Note
          </Button>
        )}
      </div>
      
      {isCreating && (
        <Card className="border border-primary/30">
          <CardContent className="p-4 space-y-3">
            <Textarea 
              placeholder="Type your note here..." 
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[100px] focus:border-primary"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsCreating(false);
                  setNewNoteContent("");
                }}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleCreateNote}
                disabled={!newNoteContent.trim()}
              >
                <Save className="h-3.5 w-3.5 mr-1" /> Save Note
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card 
              key={note.id} 
              className="course-card"
            >
              <CardContent className="p-4">
                {editingNoteId === note.id ? (
                  <div className="space-y-3">
                    <Textarea 
                      value={note.content}
                      onChange={(e) => {
                        const updatedNotes = notes.map(n => 
                          n.id === note.id ? { ...n, content: e.target.value } : n
                        );
                        setNotes(updatedNotes);
                      }}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingNoteId(null)}
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateNote(note.id, note.content)}
                        disabled={!note.content.trim()}
                      >
                        <Save className="h-3.5 w-3.5 mr-1" /> Update
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Note</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm whitespace-pre-wrap mb-3">
                      {note.content}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash className="h-3.5 w-3.5 mr-1" />
                        Delete
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingNoteId(note.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !isCreating ? (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-3">You haven't created any notes for this course yet.</p>
            <Button 
              variant="outline" 
              onClick={() => setIsCreating(true)}
            >
              Create Your First Note
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default NotesManager;
