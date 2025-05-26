
import { supabase } from '@/integrations/supabase/client';

export interface AIResponse {
  content: string;
  hasFollowUpButtons?: boolean;
}

export const getReliableAIResponse = async (
  message: string, 
  systemPrompt?: string,
  context?: string
): Promise<AIResponse> => {
  
  const enhancedSystemPrompt = systemPrompt || `You are a helpful AI study assistant for students in Botswana. You are knowledgeable about BGCSE, JCE, and PSLE curricula. Always provide encouraging, clear, and educational responses. Format your responses with proper structure and helpful explanations.`;

  // Fallback responses based on message content
  const getContextualFallback = (msg: string): string => {
    const lowerMsg = msg.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return "Hello! I'm your AI study assistant, and I'm excited to help you learn! Whether you need help with math, science, English, or any other subject from the Botswana curriculum, I'm here for you. What would you like to study today?";
    }
    
    if (lowerMsg.includes('math') || lowerMsg.includes('calculate') || lowerMsg.includes('solve') || lowerMsg.includes('equation')) {
      return "I love helping with mathematics! Whether it's algebra, geometry, calculus, or basic arithmetic, I can guide you through step-by-step solutions. Remember, the key to math success is practice and understanding each step. What specific math problem or concept would you like to work on?";
    }
    
    if (lowerMsg.includes('science') || lowerMsg.includes('biology') || lowerMsg.includes('chemistry') || lowerMsg.includes('physics')) {
      return "Science is such a fascinating subject! I can help you understand scientific concepts, explain experiments, and break down complex theories into simple, understandable parts. Whether it's biology, chemistry, or physics, I'm here to make science fun and accessible. What science topic interests you?";
    }
    
    if (lowerMsg.includes('english') || lowerMsg.includes('writing') || lowerMsg.includes('essay') || lowerMsg.includes('grammar')) {
      return "English and communication skills are so important! I can help you improve your writing, understand grammar rules, analyze literature, and structure essays effectively. Good communication opens many doors in life. What aspect of English would you like to work on?";
    }
    
    if (lowerMsg.includes('study') || lowerMsg.includes('exam') || lowerMsg.includes('test') || lowerMsg.includes('prepare')) {
      return "Great that you're thinking about effective studying! I can help you create study plans, learn memory techniques, understand concepts better, and prepare for exams. Some proven study methods include spaced repetition, active recall, and creating mind maps. What subject or exam are you preparing for?";
    }
    
    if (lowerMsg.includes('help') || lowerMsg.includes('explain') || lowerMsg.includes('understand')) {
      return "I'm absolutely here to help and explain anything you need! My goal is to make learning clear, engaging, and fun for you. Whether it's a concept you're struggling with or something new you want to explore, we can work through it together step by step. What specific topic would you like me to explain?";
    }
    
    return "I'm your dedicated AI study assistant, and I'm always ready to help you succeed in your learning journey! Whether you need help with homework, understanding concepts, preparing for exams, or just exploring new topics, I'm here to support you. What would you like to learn about today?";
  };

  // Primary attempt using ai-study-chat
  try {
    console.log('Attempting primary AI response');
    
    const { data, error } = await supabase.functions.invoke('ai-study-chat', {
      body: {
        message: context ? `${context}\n\nUser question: ${message}` : message,
        systemPrompt: enhancedSystemPrompt
      }
    });

    if (error) {
      console.warn('Primary AI method failed:', error);
      throw error;
    }

    if (data?.content) {
      console.log('Primary AI response successful');
      return {
        content: data.content,
        hasFollowUpButtons: data.hasFollowUpButtons || false
      };
    } else {
      throw new Error('No content received from primary AI');
    }

  } catch (primaryError) {
    console.log('Primary AI failed, trying backup method');
    
    // Backup attempt using ai-coach
    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          message: context ? `${context}\n\nUser question: ${message}` : message,
          systemPrompt: enhancedSystemPrompt
        }
      });

      if (error) {
        console.warn('Backup AI method failed:', error);
        throw error;
      }

      if (data?.content) {
        console.log('Backup AI response successful');
        return {
          content: data.content,
          hasFollowUpButtons: false
        };
      } else {
        throw new Error('No content received from backup AI');
      }

    } catch (backupError) {
      console.log('Both AI methods failed, using contextual fallback');
      
      // Return contextual fallback response
      return {
        content: getContextualFallback(message),
        hasFollowUpButtons: false
      };
    }
  }
};

// Utility for generating study content with multiple fallbacks
export const generateStudyContent = async (
  topic: string,
  contentType: 'mindmap' | 'podcast' | 'explanation' | 'quiz',
  additionalContext?: string
): Promise<string> => {
  
  const contentPrompts = {
    mindmap: `Create a comprehensive mind map outline for the topic: "${topic}". ${additionalContext || ''}
    
    Format the mind map as a structured outline with:
    - Main topic as the center
    - Primary branches (3-5 main categories)  
    - Secondary branches (2-4 sub-topics per main category)
    - Key points and details for each branch
    
    Use clear hierarchical structure with bullet points and indentation.`,
    
    podcast: `Create an engaging study podcast script about: "${topic}". ${additionalContext || ''}
    
    Format as a conversational podcast with:
    - Engaging introduction
    - Main content broken into digestible segments
    - Key takeaways and summaries
    - Discussion questions for reflection
    
    Make it sound natural and engaging for audio learning.`,
    
    explanation: `Provide a clear, comprehensive explanation of: "${topic}". ${additionalContext || ''}
    
    Include:
    - Simple, easy-to-understand language
    - Real-world examples
    - Step-by-step breakdowns where applicable
    - Key concepts to remember`,
    
    quiz: `Create a practice quiz for: "${topic}". ${additionalContext || ''}
    
    Include:
    - 5-7 questions of varying difficulty
    - Multiple choice and short answer questions
    - Clear answer explanations
    - Tips for understanding the concepts`
  };

  try {
    const response = await getReliableAIResponse(
      contentPrompts[contentType],
      'You are an expert educational content creator. Create engaging, accurate, and well-structured educational content.'
    );
    
    return response.content;
    
  } catch (error) {
    console.error('Error generating study content:', error);
    
    // Fallback content based on type
    const fallbacks = {
      mindmap: `# ${topic} - Mind Map\n\n## Main Concepts\n- Key concept 1\n  - Supporting detail\n  - Example\n- Key concept 2\n  - Supporting detail\n  - Application\n\n## Important Points\n- Essential information about ${topic}\n- Practical applications\n- Common misconceptions to avoid\n\n## Study Tips\n- Review regularly\n- Practice with examples\n- Connect to real-world situations`,
      
      podcast: `# Study Podcast: ${topic}\n\n## Introduction\nWelcome to your study session on ${topic}! Today we'll explore the key concepts and help you understand this important topic.\n\n## Main Content\n${topic} is an important subject that connects to many areas of study. Let's break it down into manageable parts.\n\n## Key Takeaways\n- Understanding ${topic} helps with broader learning\n- Practice and repetition are key to mastery\n- Apply concepts to real situations\n\n## Conclusion\nKeep practicing and stay curious about ${topic}!`,
      
      explanation: `# Understanding ${topic}\n\n${topic} is an important concept that students need to master. Here's a clear breakdown:\n\n## What is ${topic}?\n${topic} refers to [basic definition and explanation].\n\n## Why is it important?\nUnderstanding ${topic} helps students because it forms the foundation for more advanced concepts.\n\n## Key points to remember:\n- Main concept 1\n- Main concept 2\n- Main concept 3\n\n## Practice suggestion:\nTry applying these concepts to real-world examples you encounter daily.`,
      
      quiz: `# Practice Quiz: ${topic}\n\n## Question 1\nWhat is the main concept of ${topic}?\nA) Option 1\nB) Option 2\nC) Option 3\nD) Option 4\n\n## Question 2\nHow does ${topic} apply in real life?\n[Short answer space]\n\n## Question 3\nTrue or False: ${topic} is important for understanding advanced concepts.\n\n## Answer Key\n1. [Correct answer with explanation]\n2. [Sample answer and explanation]\n3. True - because ${topic} provides foundational understanding`
    };
    
    return fallbacks[contentType];
  }
};
