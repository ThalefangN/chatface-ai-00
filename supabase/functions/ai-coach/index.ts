
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process audio buffer from base64 to binary format
function processAudioData(base64String: string) {
  try {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error("Error processing audio data:", error);
    throw new Error("Invalid audio data format");
  }
}

// Handle speech-to-text using a mock implementation for now
async function speechToText(audioBase64: string): Promise<string> {
  try {
    // In a production environment, this would call a real speech-to-text API
    // For now, return a mock response
    console.log("Processing speech-to-text with audio length:", audioBase64.length);
    
    // Simple mock: return predefined texts based on audio length
    const audioLength = audioBase64.length;
    
    if (audioLength < 1000) {
      return "Hello, I'm preparing for an interview.";
    } else if (audioLength < 5000) {
      return "I'm nervous about the technical questions they might ask me.";
    } else {
      return "Could you help me prepare for common behavioral questions?";
    }
  } catch (error) {
    console.error("Error in speech-to-text:", error);
    throw error;
  }
}

// Generate text-to-speech using a mock implementation
async function textToSpeech(text: string): Promise<string> {
  try {
    // In a production environment, this would call a real text-to-speech API
    // For now, just return a mock base64 audio (empty string)
    console.log("Converting to speech:", text);
    return "";
  } catch (error) {
    console.error("Error in text-to-speech:", error);
    throw error;
  }
}

const getContextualResponse = (message: string): string => {
  // Real implementation would use a proper AI model
  // This is a simple rules-based approach for demonstration
  const msg = message.toLowerCase();
  
  if (msg.includes("introduce") || msg.includes("background") || msg.includes("tell me about yourself")) {
    return "Thanks for sharing about yourself! Could you tell me about a challenging work situation you've faced and how you handled it?";
  } else if (msg.includes("challenge") || msg.includes("difficult") || msg.includes("problem")) {
    return "That's a good example of problem-solving. What would you say are your greatest strengths?";
  } else if (msg.includes("strength") || msg.includes("good at") || msg.includes("excel")) {
    return "Those are valuable skills! Now, could you share what you consider to be areas for improvement?";
  } else if (msg.includes("weakness") || msg.includes("improve") || msg.includes("development")) {
    return "Self-awareness is important. How do you plan to address these areas?";
  } else if (msg.includes("salary") || msg.includes("compensation") || msg.includes("pay")) {
    return "That's a good question about compensation. In an interview, it's best to research market rates beforehand and provide a range rather than a specific number. Would you like to practice how to discuss compensation effectively?";
  } else if (msg.includes("question") || msg.includes("ask")) {
    return "Great! Asking questions shows your interest in the role. What specific aspects of the company culture, team dynamics, or growth opportunities would you like to know more about?";
  } else if (msg.includes("thank") || msg.includes("bye") || msg.includes("end")) {
    return "You're welcome! You've done well in this practice session. Remember to maintain eye contact, speak clearly, and provide specific examples in your actual interview. Good luck!";
  } else if (msg.includes("nervous") || msg.includes("anxiety") || msg.includes("stress")) {
    return "It's completely normal to feel nervous before an interview. Try some deep breathing exercises, and remember that the interviewer wants to get to know you. Focus on how your skills align with the role rather than trying to be perfect.";
  } else {
    // More generic responses
    const responses = [
      "Could you elaborate more on that point? Providing specific examples helps interviewers understand your experience better.",
      "That's interesting. How does that relate to your career goals and the position you're applying for?",
      "Great point. Let's explore that further. Can you give a specific example that demonstrates this skill in action?",
      "I understand. What metrics or outcomes can you share that showcase the impact of your work in this area?",
      "Thanks for sharing. Let's shift focus - where do you see yourself professionally in five years, and how does this role fit into that plan?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }
  
  try {
    const requestData = await req.json();
    const { message, sessionId, userId, audioData } = requestData;
    
    if (!sessionId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    let userMessage = message;
    
    // If audio data is provided, process it
    if (audioData) {
      try {
        console.log("Processing audio data...");
        userMessage = await speechToText(audioData);
        console.log("Transcribed text:", userMessage);
        
        // Save the user's audio message to the database
        await supabaseClient
          .from('session_messages')
          .insert({
            session_id: sessionId,
            content: userMessage,
            is_ai: false
          });
      } catch (error) {
        console.error("Error processing audio:", error);
        return new Response(
          JSON.stringify({ error: 'Failed to process audio data' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    } else if (message) {
      // If text message is provided, use it directly
      userMessage = message;
    } else {
      return new Response(
        JSON.stringify({ error: 'No message or audio data provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Generate a response based on the message
    const aiResponse = getContextualResponse(userMessage);
    
    // Generate speech from the AI response
    let speechAudio = "";
    try {
      speechAudio = await textToSpeech(aiResponse);
    } catch (error) {
      console.error("Error generating speech:", error);
      // Continue without speech audio
    }
    
    // Save the AI response to the database
    const { data, error } = await supabaseClient
      .from('session_messages')
      .insert({
        session_id: sessionId,
        content: aiResponse,
        is_ai: true
      })
      .select()
      .single()
      
    if (error) throw error
    
    // Return the AI response with optional speech audio
    return new Response(
      JSON.stringify({ 
        message: aiResponse,
        messageRecord: data,
        audioResponse: speechAudio
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error processing message:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
