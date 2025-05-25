
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, systemPrompt, subject } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const defaultSystemPrompt = 'You are a helpful AI study assistant focused exclusively on educational content. When solving math problems, provide clear step-by-step solutions without using asterisks for formatting. Use simple text formatting and line breaks for clarity. Keep responses concise but comprehensive. Always offer to provide additional explanation or create practice questions after solving problems. If someone asks about non-educational topics, politely redirect them back to academic subjects.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt || defaultSystemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Clean up formatting and check if it's a math solution
    const cleanText = content.replace(/\*/g, '');
    const isMathSolution = /\d+[\+\-\*\/\=]|\bsolution\b|\bsolve\b|\banswer\b/i.test(cleanText);

    return new Response(
      JSON.stringify({ 
        content: cleanText,
        hasFollowUpButtons: isMathSolution
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-study-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get AI response',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. In the meantime, feel free to ask me about any academic subjects you need help with!",
        hasFollowUpButtons: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
