import { useState } from 'react';
import { PlusCircle, X, Pencil } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface TaskInputProps {
  onSubmit: (tasks: string[]) => void;
}

const TaskInput = ({ onSubmit }: TaskInputProps) => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [currentTask, setCurrentTask] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState('');

  const handleAddTask = () => {
    if (currentTask.trim()) {
      setTasks([...tasks, currentTask.trim()]);
      setCurrentTask('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleEditTask = (index: number) => {
    setEditingIndex(index);
    setEditedTask(tasks[index]);
  };

  const handleUpdateTask = (index: number) => {
    if (editedTask.trim()) {
      const updatedTasks = [...tasks];
      updatedTasks[index] = editedTask.trim();
      setTasks(updatedTasks);
    }
    setEditingIndex(null);
  };

  const handleSubmit = () => {
    if (tasks.length > 0) {
      onSubmit(tasks);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="mb-2 opacity-70 text-sm">
        <div className="inline-block px-2 py-1 bg-primary/10 text-primary font-medium rounded-md mb-1">
          Step 1
        </div>
        <h2 className="text-xl font-semibold mb-1">What do you want to accomplish today?</h2>
        <p className="text-muted-foreground">
          Add your tasks below and let our AI create an optimized schedule for you.
        </p>
      </div>

      <div className="relative flex items-center mb-4 transition-all duration-300">
        <Input
          type="text"
          value={currentTask}
          onChange={(e) => setCurrentTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a task... (e.g. Go for a 20 minute run)"
          className="pr-10 transition-all border-secondary focus:border-primary/50 shadow-sm"
        />
        <Button 
          onClick={handleAddTask} 
          size="icon" 
          variant="ghost" 
          className="absolute right-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="sr-only">Add Task</span>
        </Button>
      </div>

      {tasks.length > 0 && (
        <div className="space-y-2 mb-6">
          {tasks.map((task, index) => (
            <div 
              key={index} 
              className="flex items-center p-3 bg-accent rounded-lg group transition-all hover:bg-accent/70 relative"
            >
              {editingIndex === index ? (
                <Input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                  onBlur={() => handleUpdateTask(index)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateTask(index)}
                  autoFocus
                  className="flex-grow text-sm border-none bg-transparent focus:ring-0"
                />
              ) : (
                <span className="flex-grow text-sm">{task}</span>
              )}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => handleEditTask(index)}
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 hover:bg-blue-200 hover:text-blue-600 transition-all"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit Task</span>
                </Button>
                <Button
                  onClick={() => handleRemoveTask(index)}
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove Task</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button 
        onClick={handleSubmit} 
        disabled={tasks.length === 0} 
        className="w-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-md"
      >
        Optimize My Day
      </Button>
    </div>
  );
};

export default TaskInput;
