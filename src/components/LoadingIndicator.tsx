
import { ArrowUpRight } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className="w-full max-w-md mx-auto text-center py-10 animate-fade-in">
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-opacity"></div>
          <div className="relative h-20 w-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin-slow flex items-center justify-center">
            <ArrowUpRight className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Optimizing your schedule</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Our AI is analyzing your tasks to create the most efficient schedule for your day.
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="h-8 bg-secondary/80 rounded-md animate-pulse-opacity max-w-[80%] mx-auto"></div>
        <div className="h-8 bg-secondary/60 rounded-md animate-pulse-opacity max-w-[65%] mx-auto"></div>
        <div className="h-8 bg-secondary/40 rounded-md animate-pulse-opacity max-w-[75%] mx-auto"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
