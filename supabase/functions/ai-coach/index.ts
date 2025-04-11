
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight request
serve(async (req) => {
  // Handle CORS preflight requests
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
    
    // If audio data is provided, process it with OpenAI Whisper
    if (audioData) {
      try {
        console.log("Processing audio data with Whisper...");
        
        // Convert base64 to binary
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create a blob from the bytes
        const blob = new Blob([bytes], { type: 'audio/webm' });
        
        // Create form data for the OpenAI API
        const formData = new FormData();
        formData.append('file', blob, 'audio.webm');
        formData.append('model', 'whisper-1');
        
        // Call OpenAI API to transcribe the audio
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          },
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
        }
        
        const result = await response.json();
        userMessage = result.text;
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
          JSON.stringify({ error: 'Failed to process audio data: ' + error.message }),
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
    
    // Get previous messages for context
    const { data: previousMessages } = await supabaseClient
      .from('session_messages')
      .select('content, is_ai')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);
    
    // Format messages for OpenAI
    const formattedMessages = [];
    
    // Add system prompt
    formattedMessages.push({
      role: 'system',
      content: 'You are an AI interview coach helping users practice for job interviews. Provide constructive feedback, ask relevant follow-up questions, and help them improve their interview skills. Keep responses concise and actionable.'
    });
    
    // Add context from previous messages
    if (previousMessages && previousMessages.length > 0) {
      previousMessages.forEach(msg => {
        formattedMessages.push({
          role: msg.is_ai ? 'assistant' : 'user',
          content: msg.content
        });
      });
    }
    
    // Add current user message
    formattedMessages.push({
      role: 'user',
      content: userMessage
    });
    
    // Call OpenAI API
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });
    
    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }
    
    const openAiData = await openAiResponse.json();
    const aiResponse = openAiData.choices[0].message.content;
    
    // Generate speech from the AI response using OpenAI TTS
    let speechAudio = "";
    try {
      const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'onyx',
          input: aiResponse,
          response_format: 'mp3',
        }),
      });
      
      if (!ttsResponse.ok) {
        throw new Error(`TTS API error: ${ttsResponse.status} ${await ttsResponse.text()}`);
      }
      
      // Convert audio buffer to base64
      const arrayBuffer = await ttsResponse.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      speechAudio = btoa(binary);
      
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
      .single();
      
    if (error) throw error;
    
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
    console.error('Error processing message:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
