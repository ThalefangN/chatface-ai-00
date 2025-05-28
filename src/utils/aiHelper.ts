
import { supabase } from '@/integrations/supabase/client';

export interface AIResponse {
  content: string;
  hasFollowUpButtons?: boolean;
  audioUrl?: string;
}

export const getReliableAIResponse = async (
  message: string, 
  systemPrompt?: string,
  context?: string
): Promise<AIResponse> => {
  
  const enhancedSystemPrompt = systemPrompt || `You are a helpful AI study assistant for students in Botswana. You are knowledgeable about BGCSE, JCE, and PSLE curricula. Always provide encouraging, clear, and educational responses. Format your responses with proper structure and helpful explanations.`;

  // Enhanced fallback responses based on message content with better context awareness
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
    
    if (lowerMsg.includes('mindmap') || lowerMsg.includes('mind map')) {
      return "Mind maps are excellent visual learning tools! I can help you create structured mind maps that organize information hierarchically, making complex topics easier to understand and remember. Mind maps work great for subjects like history, biology, literature, and planning essays. What topic would you like to create a mind map for?";
    }
    
    if (lowerMsg.includes('podcast') || lowerMsg.includes('audio') || lowerMsg.includes('listen')) {
      return "Audio learning through podcasts is a fantastic way to absorb information! I can create engaging study podcasts that break down complex topics into digestible audio content, perfect for learning on the go or reinforcing concepts through different learning styles. What subject would you like to turn into an audio learning experience?";
    }
    
    return "I'm your dedicated AI study assistant, and I'm always ready to help you succeed in your learning journey! Whether you need help with homework, understanding concepts, preparing for exams, or exploring new topics, I'm here to support you every step of the way. What would you like to learn about today?";
  };

  // Primary attempt using ai-study-chat with shorter timeout
  try {
    console.log('Making AI request with message:', message.substring(0, 50) + '...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const { data, error } = await supabase.functions.invoke('ai-study-chat', {
      body: {
        message: context ? `${context}\n\nUser question: ${message}` : message,
        systemPrompt: enhancedSystemPrompt
      },
      options: {
        signal: controller.signal
      }
    });

    clearTimeout(timeoutId);

    if (error) {
      console.warn('Primary AI request failed:', error);
      throw error;
    }

    if (data?.content) {
      console.log('AI response received successfully');
      return {
        content: data.content,
        hasFollowUpButtons: data.hasFollowUpButtons || false,
        audioUrl: data.audioUrl
      };
    } else {
      throw new Error('No content received from AI');
    }

  } catch (primaryError) {
    console.log('Primary AI failed, trying backup method:', primaryError);
    
    // Backup attempt using ai-coach function
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          message: context ? `${context}\n\nUser question: ${message}` : message,
          systemPrompt: enhancedSystemPrompt
        },
        options: {
          signal: controller.signal
        }
      });

      clearTimeout(timeoutId);

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
      
      // Return enhanced contextual fallback response
      return {
        content: getContextualFallback(message),
        hasFollowUpButtons: false
      };
    }
  }
};

// Enhanced utility for generating study content with better timeout handling
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
    
    Use clear hierarchical structure with bullet points and indentation. Make it educational and easy to follow.`,
    
    podcast: `Create an engaging study podcast script about: "${topic}". ${additionalContext || ''}
    
    Format as a conversational, educational podcast with:
    - Engaging introduction that hooks the listener
    - Main content broken into digestible segments with clear transitions
    - Real-world examples and practical applications
    - Key takeaways and summaries at the end
    - Discussion questions for reflection
    
    Make it sound natural and engaging for audio learning. Keep the script focused and under 1000 words for optimal audio generation. Use a conversational tone that makes learning enjoyable.`,
    
    explanation: `Provide a clear, comprehensive explanation of: "${topic}". ${additionalContext || ''}
    
    Include:
    - Simple, easy-to-understand language
    - Real-world examples and analogies
    - Step-by-step breakdowns where applicable
    - Key concepts to remember
    - Common misconceptions to avoid`,
    
    quiz: `Create a practice quiz for: "${topic}". ${additionalContext || ''}
    
    Include:
    - 5-7 questions of varying difficulty levels
    - Multiple choice and short answer questions
    - Clear answer explanations that teach concepts
    - Tips for understanding and remembering the material
    - Encouraging feedback for learners`
  };

  try {
    console.log(`Generating ${contentType} content for topic: ${topic}`);
    
    const response = await getReliableAIResponse(
      contentPrompts[contentType],
      'You are an expert educational content creator. Create engaging, accurate, and well-structured educational content that helps students learn effectively. Always be encouraging and supportive.'
    );
    
    console.log(`Successfully generated ${contentType} content`);
    return response.content;
    
  } catch (error) {
    console.error(`Error generating ${contentType} content:`, error);
    
    // Enhanced fallback content based on type with better educational value
    const fallbacks = {
      mindmap: `# ${topic} - Mind Map Structure\n\n## Core Concepts\n- **Fundamental Principle 1**\n  - Key detail and explanation\n  - Real-world application\n  - Memory tip or mnemonic\n\n- **Fundamental Principle 2**\n  - Supporting evidence or example\n  - Connection to other concepts\n  - Practice suggestion\n\n- **Fundamental Principle 3**\n  - Historical context or background\n  - Current relevance\n  - Future implications\n\n## Important Relationships\n- How concepts connect to each other\n- Cause and effect relationships\n- Dependencies and prerequisites\n\n## Study Strategies\n- Active recall techniques\n- Spaced repetition schedule\n- Practice problems or exercises\n- Real-world applications to explore\n\n## Key Takeaways\n- Main points to remember about ${topic}\n- Common mistakes to avoid\n- Next steps for deeper learning`,
      
      podcast: `# Study Podcast: Understanding ${topic}\n\n**[Intro Music & Welcome]**\n\nHello and welcome to your personal study session! I'm your AI study companion, and today we're diving deep into ${topic}. Whether you're preparing for exams or just curious to learn more, this session is designed to make ${topic} clear, engaging, and memorable.\n\n**[Main Content Begins]**\n\n${topic} is a fascinating subject that connects to many areas of learning. Let me break this down into digestible pieces that will help you truly understand and remember this material.\n\nFirst, let's establish the foundation. Think of ${topic} as a building - we need strong fundamentals before we can add the upper floors. The core concept here is understanding how different elements work together to create the bigger picture.\n\nWhat makes ${topic} particularly interesting is how it applies to real-world situations. You might encounter this in everyday life more often than you think. For example, when you observe nature, use technology, or even plan your daily activities, principles of ${topic} are often at work.\n\n**[Key Learning Points]**\n\nLet me share three essential points that will help you master ${topic}:\n\n1. **Understanding the Basics**: Start with the fundamental concepts and build from there\n2. **Making Connections**: See how ${topic} relates to other subjects you're studying\n3. **Practical Application**: Find ways to use this knowledge in real situations\n\n**[Wrap-up & Encouragement]**\n\nRemember, learning ${topic} is a journey, not a destination. Every expert was once a beginner, and with consistent practice and curiosity, you'll develop a strong understanding of this subject.\n\nKeep asking questions, stay curious, and remember that I'm always here to help you succeed in your learning journey!\n\n**[Outro]**`,
      
      explanation: `# Understanding ${topic}\n\n${topic} is an important concept that students need to master for academic success. Here's a comprehensive explanation designed to make this topic clear and accessible.\n\n## What is ${topic}?\n\n${topic} refers to the fundamental principles and concepts that form the foundation of this subject area. Understanding these basics is crucial for building more advanced knowledge.\n\n## Why is ${topic} Important?\n\nLearning about ${topic} helps students because:\n- It provides essential foundational knowledge\n- It connects to many other areas of study\n- It develops critical thinking skills\n- It has practical real-world applications\n\n## Key Concepts to Remember\n\n1. **Core Principle 1**: The fundamental idea that everything else builds upon\n2. **Core Principle 2**: How different elements interact and influence each other\n3. **Core Principle 3**: The practical applications and real-world relevance\n\n## Learning Strategies\n\n- Start with the basics and build gradually\n- Use visual aids like diagrams or mind maps\n- Practice with real examples\n- Connect new information to what you already know\n- Review regularly to strengthen memory\n\n## Real-World Applications\n\nYou can see ${topic} in action when you observe daily life, nature, technology, and social interactions. Look for examples around you to make the learning more meaningful and memorable.\n\n## Next Steps\n\nTo deepen your understanding of ${topic}, try creating your own examples, teaching the concept to someone else, or exploring how it connects to other subjects you're studying.`,
      
      quiz: `# Practice Quiz: ${topic}\n\n## Instructions\nThis quiz will help you test your understanding of ${topic}. Take your time, think through each question, and use the explanations to deepen your learning.\n\n## Question 1 (Multiple Choice)\nWhat is the most important fundamental concept of ${topic}?\n\nA) The basic definition and core principles\nB) The historical development over time\nC) The mathematical formulas involved\nD) The future applications and possibilities\n\n**Answer: A** - Understanding the basic definition and core principles provides the foundation for all other learning about ${topic}.\n\n## Question 2 (Short Answer)\nExplain how ${topic} applies to everyday life. Give at least two specific examples.\n\n**Sample Answer**: ${topic} appears in daily life in many ways. For example, we can observe it when [example 1] and when [example 2]. These examples show how understanding ${topic} helps us make sense of the world around us.\n\n## Question 3 (True/False)\nTrue or False: Understanding ${topic} is essential for success in related academic subjects.\n\n**Answer: True** - ${topic} provides foundational knowledge that supports learning in many other areas. Mastering these concepts creates a strong base for advanced study.\n\n## Question 4 (Application)\nIf you were teaching ${topic} to a younger student, what would be the most important point to emphasize?\n\n**Sample Answer**: I would emphasize the practical relevance and real-world applications, making sure they understand why this knowledge is valuable and how they can use it in their daily life.\n\n## Study Tips\n- Review the core concepts regularly\n- Practice applying knowledge to new situations\n- Create your own examples and explanations\n- Connect ${topic} to other subjects you're studying\n- Ask questions when something isn't clear\n\n## Encouragement\nRemember, every question you answer correctly builds your confidence and knowledge. Keep practicing, stay curious, and celebrate your progress!`
    };
    
    return fallbacks[contentType];
  }
};
