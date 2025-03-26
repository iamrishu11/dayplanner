
import { Clock, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TaskItemProps {
  time: string;
  task: string;
  index: number;
  total: number;
}

const TaskItem = ({ time, task, index, total }: TaskItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300 + index * 150);
    
    return () => clearTimeout(timer);
  }, [index]);
  
  return (
    <div 
      className={`
        glass-card rounded-xl p-5 mb-4 relative overflow-hidden transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      <div className="absolute top-0 left-0 h-full w-1 bg-primary opacity-70"></div>
      
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary rounded-lg p-2 flex-shrink-0">
          <Clock className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <div className="font-medium text-primary text-sm mb-1">{time}</div>
          <div className="font-semibold text-base mb-2">{task}</div>
          
          {index < total - 1 && (
            <div className="absolute bottom-2 right-2 text-muted-foreground/40">
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
