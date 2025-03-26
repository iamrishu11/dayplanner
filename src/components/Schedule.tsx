
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import TaskItem from './TaskItem';
import { Button } from '../components/ui/button';

interface ScheduleProps {
  schedule: {
    tasks: { time: string; task: string }[];
    explanation: string;
  };
  onReset: () => void;
}

const Schedule = ({ schedule, onReset }: ScheduleProps) => {
  const [showExplanation, setShowExplanation] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExplanation(true);
    }, schedule.tasks.length * 150 + 800);
    
    return () => clearTimeout(timer);
  }, [schedule.tasks.length]);
  
  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in pt-2">
      <div className="mb-6 text-center">
        <div className="inline-block px-2 py-1 bg-primary/10 text-primary font-medium rounded-md mb-1">
          Your Optimized Day
        </div>
        <h2 className="text-2xl font-semibold mb-2">Here's your schedule</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          We've analyzed your tasks and created an optimal schedule to help you be most productive.
        </p>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-secondary/70 z-0"></div>
        
        <div className="space-y-1 relative z-10">
          {schedule.tasks.map((item, index) => (
            <TaskItem 
              key={index} 
              time={item.time} 
              task={item.task} 
              index={index}
              total={schedule.tasks.length}
            />
          ))}
        </div>
      </div>
      
      <div 
        className={`
          glass-card rounded-xl p-5 mb-8 transition-all duration-500
          ${showExplanation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-primary rounded-lg p-2">
            <Calendar className="h-5 w-5" />
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-2">Why this order?</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {schedule.explanation}
            </p>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onReset} 
        className="w-full bg-primary/90 hover:bg-primary transition-all shadow-md"
      >
        Plan Another Day
      </Button>
    </div>
  );
};

export default Schedule;
