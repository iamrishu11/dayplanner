import { useState } from 'react';
import TaskInput from '../components/TaskInput';
import LoadingIndicator from '../components/LoadingIndicator';
import Schedule from '../components/Schedule';
import { generateSchedule } from '../lib/scheduler';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle'; // Import the ThemeToggle component

type Stage = 'input' | 'loading' | 'schedule';

interface ScheduleData {
  tasks: { time: string; task: string }[];
  explanation: string;
}

const Index = () => {
  const [stage, setStage] = useState<Stage>('input');
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);

  const handleTaskSubmit = async (tasks: string[]) => {
    try {
      setStage('loading');

      const generatedSchedule = await generateSchedule(tasks);

      setSchedule(generatedSchedule);
      setStage('schedule');
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast.error('Something went wrong. Please try again.');
      setStage('input');
    }
  };

  const handleReset = () => {
    setStage('input');
    setSchedule(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-4 py-10 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle /> 
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Day Planner
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Plan your perfect day with AI assistance
          </p>
        </header>

        <div className="glass-card rounded-2xl p-6 shadow-xl">
          {stage === 'input' && <TaskInput onSubmit={handleTaskSubmit} />}
          {stage === 'loading' && <LoadingIndicator />}
          {stage === 'schedule' && schedule && <Schedule schedule={schedule} onReset={handleReset} />}
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <p>Designed with efficiency in mind.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;