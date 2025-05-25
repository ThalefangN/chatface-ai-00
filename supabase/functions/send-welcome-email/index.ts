
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { WelcomeEmail } from './_templates/welcome-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    const wh = new Webhook(hookSecret)
    
    const {
      user,
      email_data: { token_hash, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
        user_metadata: {
          first_name?: string
          last_name?: string
        }
      }
      email_data: {
        token_hash: string
        email_action_type: string
        site_url: string
      }
    }

    // Only send welcome email for signup confirmations
    if (email_action_type !== 'signup') {
      return new Response('Not a signup confirmation', { status: 200, headers: corsHeaders })
    }

    const firstName = user.user_metadata?.first_name || 'Student'
    const confirmationUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent('https://your-app-domain.com/dashboard')}`

    const html = await renderAsync(
      React.createElement(WelcomeEmail, {
        firstName,
        confirmationUrl,
      })
    )

    const { data, error } = await resend.emails.send({
      from: 'StudyBuddy <welcome@yourdomain.com>',
      to: [user.email],
      subject: '🎓 Welcome to StudyBuddy - Confirm Your Email',
      html,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log('Welcome email sent successfully:', data)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })

  } catch (error) {
    console.error('Error in send-welcome-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
