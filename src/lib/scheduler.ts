
import { toast } from "sonner";

interface Task {
  time: string;
  task: string;
}

interface Schedule {
  tasks: Task[];
  explanation: string;
}

// Access the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateSchedule = async (tasks: string[]): Promise<Schedule> => {
  try {
    // Check if API key is available
    if (!API_KEY) {
      console.error('Gemini API key is missing');
      toast.error('API key is missing. Using fallback method.');
      return fallbackScheduleGeneration(tasks);
    }

    // Create a prompt for Gemini AI
    const prompt = `I need to organize these tasks optimally for today:
${tasks.map(task => `- ${task}`).join('\n')}

Please create a schedule that organizes these tasks in the most efficient order. Consider factors like:
- Task priority and deadlines
- Logical grouping (like outdoor activities together)
- Energy levels throughout the day
- Context switching minimization
- do add some minutes break between tasks when u feel the need

Format the response as a JSON object with:
1. "tasks" array with objects containing "time" (like "9AM", "2:30PM") and "task" (the task description)
2. "explanation" string that explains the reasoning behind this schedule

Don't include any other text in your response - just return a valid JSON object.`;

    // Call the Gemini API - updated to use the gemini-2.0-flash model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error('Failed to generate schedule with Gemini');
    }

    const data = await response.json();
    
    // Extract the text content from Gemini's response
    const textContent = data.candidates[0].content.parts[0].text;
    
    let parsedSchedule: Schedule;
    
    try {
      // Try to parse the JSON directly
      parsedSchedule = JSON.parse(textContent);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      
      // If direct parsing fails, try to extract JSON from the text
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedSchedule = JSON.parse(jsonMatch[0]);
        } catch (extractError) {
          console.error('Error extracting JSON from response:', extractError);
          throw new Error('Could not parse schedule data from AI response');
        }
      } else {
        // Fallback to the mock implementation if we can't get proper JSON
        console.warn('Falling back to mock scheduler implementation');
        return fallbackScheduleGeneration(tasks);
      }
    }
    
    // Validate the parsed schedule structure
    if (!parsedSchedule.tasks || !Array.isArray(parsedSchedule.tasks) || !parsedSchedule.explanation) {
      console.warn('Invalid schedule structure from Gemini, falling back to mock implementation');
      return fallbackScheduleGeneration(tasks);
    }
    
    // Ensure each task has the required fields
    parsedSchedule.tasks = parsedSchedule.tasks.map(task => ({
      time: task.time || "Anytime",
      task: task.task
    }));
    
    return parsedSchedule;
    
  } catch (error) {
    console.error('Error in generateSchedule:', error);
    toast.error('Failed to generate your schedule. Using fallback method.');
    
    // Use the fallback method if the API call fails
    return fallbackScheduleGeneration(tasks);
  }
};

// Keep the original implementation as a fallback
const fallbackScheduleGeneration = (tasks: string[]): Schedule => {
  // Create time slots starting from current hour (rounded up to next hour)
  const now = new Date();
  let currentHour = now.getHours();
  if (now.getMinutes() > 0) currentHour += 1;
  if (currentHour < 9) currentHour = 9; // Don't start before 9 AM
  
  // Sort tasks based on simulated priority (in a real app, the AI would determine this)
  const sortedTasks = [...tasks].sort((a, b) => {
    // Prioritize meetings and preparation tasks
    const aMeeting = a.toLowerCase().includes('meeting') || a.toLowerCase().includes('prepare');
    const bMeeting = b.toLowerCase().includes('meeting') || b.toLowerCase().includes('prepare');
    
    if (aMeeting && !bMeeting) return -1;
    if (!aMeeting && bMeeting) return 1;
    
    // Group outdoor activities
    const aOutdoor = a.toLowerCase().includes('run') || a.toLowerCase().includes('walk') || a.toLowerCase().includes('mow');
    const bOutdoor = b.toLowerCase().includes('run') || b.toLowerCase().includes('walk') || b.toLowerCase().includes('mow');
    
    if (aOutdoor && bOutdoor) return 0;
    
    // Family-related activities later in the day
    const aFamily = a.toLowerCase().includes('daughter') || a.toLowerCase().includes('family') || a.toLowerCase().includes('kid');
    const bFamily = b.toLowerCase().includes('daughter') || b.toLowerCase().includes('family') || b.toLowerCase().includes('kid');
    
    if (aFamily && !bFamily) return 1;
    if (!aFamily && bFamily) return -1;
    
    return 0;
  });
  
  // Assign time slots
  const scheduledTasks: Task[] = [];
  
  sortedTasks.forEach((task, index) => {
    let timeStr;
    let hour = currentHour + index;
    
    // Format time with AM/PM
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour > 12 ? hour - 12 : hour;
    timeStr = `${formattedHour}${ampm}`;
    
    scheduledTasks.push({
      time: timeStr,
      task
    });
  });
  
  // Generate explanation based on task patterns
  let explanation = "Here's why we've arranged your schedule this way:\n\n";
  
  const hasMeetings = tasks.some(t => t.toLowerCase().includes('meeting'));
  const hasOutdoor = tasks.some(t => t.toLowerCase().includes('run') || t.toLowerCase().includes('walk') || t.toLowerCase().includes('mow'));
  const hasFamily = tasks.some(t => t.toLowerCase().includes('daughter') || t.toLowerCase().includes('family') || t.toLowerCase().includes('kid'));
  
  if (hasMeetings) {
    explanation += "• We prioritized meetings and preparation tasks earlier in the day when your focus is typically higher.\n\n";
  }
  
  if (hasOutdoor) {
    explanation += "• We grouped outdoor activities together to maximize efficiency and allow you to stay in the flow.\n\n";
  }
  
  if (hasFamily) {
    explanation += "• Family-related activities are scheduled later since they often align with when family members are available after school or work.\n\n";
  }
  
  explanation += "This schedule optimizes your energy levels throughout the day and minimizes context switching between different types of activities.";
  
  return {
    tasks: scheduledTasks,
    explanation
  };
};
