
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
    const { documentNames } = await req.json();

    if (!documentNames || !Array.isArray(documentNames) || documentNames.length === 0) {
      return new Response(
        JSON.stringify({ 
          title: 'No Documents Selected',
          description: 'Select documents to get AI-generated insights and summaries'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ 
          title: 'Study Collection',
          description: 'Comprehensive learning materials'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
            content: 'Based on the document names provided, generate a concise title and description for the study collection. Focus on the main academic subject. Return in format: "Title: [title]\nDescription: [description]"'
          },
          {
            role: 'user',
            content: `Generate a title and description for these documents: ${documentNames.join(', ')}`
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const lines = content.split('\n');
    const title = lines[0]?.replace('Title: ', '') || 'Study Collection';
    const description = lines[1]?.replace('Description: ', '') || 'Comprehensive learning materials';

    return new Response(
      JSON.stringify({ title, description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-document-summary function:', error);
    return new Response(
      JSON.stringify({ 
        title: 'Study Collection',
        description: 'Comprehensive learning materials'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
