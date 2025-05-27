
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to clean markdown formatting from text
function cleanMarkdownFormatting(text: string): string {
  // Remove ** bold formatting
  let cleaned = text.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // Remove ### headers
  cleaned = cleaned.replace(/###\s*/g, '');
  
  // Remove ## headers
  cleaned = cleaned.replace(/##\s*/g, '');
  
  // Remove # headers
  cleaned = cleaned.replace(/#\s*/g, '');
  
  // Clean up any remaining asterisks that might be used for emphasis
  cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
  
  return cleaned;
}

// Function to clean and validate JSON content for assessment questions
function cleanJsonContent(content: string): string {
  try {
    // Remove any markdown formatting first
    let cleaned = cleanMarkdownFormatting(content);
    
    // Remove any text before the first [ and after the last ]
    const startIndex = cleaned.indexOf('[');
    const endIndex = cleaned.lastIndexOf(']');
    
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      cleaned = cleaned.substring(startIndex, endIndex + 1);
    } else {
      throw new Error('No valid JSON array found in response');
    }

    // Fix incomplete JSON by checking if it ends properly
    if (!cleaned.endsWith(']')) {
      // Find the last complete object
      let lastCompleteIndex = -1;
      let braceCount = 0;
      let inString = false;
      let escapeNext = false;
      
      for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              lastCompleteIndex = i;
            }
          }
        }
      }
      
      if (lastCompleteIndex > -1) {
        cleaned = cleaned.substring(0, lastCompleteIndex + 1) + ']';
      }
    }
    
    // Fix common JSON issues
    cleaned = cleaned
      // Fix missing commas after closing braces/brackets
      .replace(/}\s*\n\s*{/g, '},\n  {')
      .replace(/]\s*\n\s*{/g, '],\n  {')
      // Fix missing commas after string values
      .replace(/"\s*\n\s*"/g, '",\n    "')
      // Fix missing commas after arrays
      .replace(/]\s*\n\s*}/g, ']\n  }')
      // Remove trailing commas
      .replace(/,(\s*[}\]])/g, '$1');
    
    // Try to parse and re-stringify to ensure valid JSON
    const parsed = JSON.parse(cleaned);
    
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not a valid array');
    }
    
    return JSON.stringify(parsed);
  } catch (error) {
    console.error('JSON cleaning failed:', error);
    throw new Error(`JSON cleaning failed: ${error.message}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, systemPrompt } = await req.json()

    console.log('Received AI study chat request:', { message: message?.substring(0, 100), systemPrompt })

    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string')
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured')
      throw new Error('AI service is not properly configured. Please contact support.')
    }

    // Check if this is a request for assessment questions (JSON format)
    const isAssessmentRequest = message.includes('Generate exactly') && message.includes('questions for the subject')

    console.log('Making request to OpenAI API...')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: isAssessmentRequest 
              ? 'You are a helpful AI that generates valid JSON assessment questions. Always respond with properly formatted JSON arrays containing question objects. Ensure all JSON is valid and complete. Do not truncate responses.'
              : (systemPrompt || 'You are a helpful AI study assistant. Provide clear, comprehensive, and educational responses. Always ensure your responses are complete and helpful.')
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 4000, // Increased token limit to prevent truncation
      }),
    })

    console.log('OpenAI API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', response.status, errorData)
      
      // Provide specific error messages for different status codes
      if (response.status === 401) {
        throw new Error('AI service authentication failed. Please contact support.')
      } else if (response.status === 429) {
        throw new Error('AI service is temporarily overloaded. Please try again in a moment.')
      } else if (response.status >= 500) {
        throw new Error('AI service is temporarily unavailable. Please try again later.')
      } else {
        throw new Error(`AI service error: ${response.status}. Please try again.`)
      }
    }

    const data = await response.json()
    console.log('OpenAI response structure:', { 
      hasChoices: !!data.choices, 
      choicesLength: data.choices?.length,
      finishReason: data.choices?.[0]?.finish_reason 
    })

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response format:', data)
      throw new Error('Received invalid response from AI service. Please try again.')
    }

    let content = data.choices[0].message.content

    if (!content || typeof content !== 'string') {
      console.error('No content in OpenAI response:', data.choices[0])
      throw new Error('AI service returned empty response. Please try again.')
    }

    // Check if response was truncated
    if (data.choices[0].finish_reason === 'length') {
      console.warn('Response was truncated due to max_tokens limit');
      // For assessment requests, this is critical
      if (isAssessmentRequest) {
        throw new Error('Response was truncated. Please try requesting fewer questions.');
      }
    }

    // Handle assessment questions differently
    if (isAssessmentRequest) {
      try {
        // Clean and validate JSON for assessment questions
        content = cleanJsonContent(content)
        console.log('Successfully cleaned JSON content')
      } catch (cleanError) {
        console.error('Failed to clean JSON content:', cleanError)
        throw new Error(`Failed to generate valid assessment questions: ${cleanError.message}`)
      }
    } else {
      // Clean markdown formatting from regular chat content
      content = cleanMarkdownFormatting(content)
    }
    
    console.log('Successfully processed AI response')
    
    return new Response(
      JSON.stringify({ 
        content,
        hasFollowUpButtons: !isAssessmentRequest // Don't show follow-up buttons for assessment questions
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in ai-study-chat function:', error)
    
    // Provide a helpful fallback response instead of just an error
    const fallbackContent = error.message.includes('API key') || error.message.includes('authentication') || error.message.includes('service')
      ? "I'm currently unable to connect to the AI service. Please check your internet connection and try again. If the problem persists, please contact support."
      : "I encountered an issue processing your request. Please try rephrasing your question or try again in a moment.";
    
    return new Response(
      JSON.stringify({ 
        content: fallbackContent,
        hasFollowUpButtons: false,
        error: 'AI service temporarily unavailable'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200  // Return 200 to prevent frontend errors, but include error flag
      }
    )
  }
})
