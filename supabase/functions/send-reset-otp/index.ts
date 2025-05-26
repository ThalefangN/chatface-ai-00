
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SendOTPRequest = await req.json();
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database with 10-minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    const { error: dbError } = await supabase
      .from('password_reset_otps')
      .upsert({
        email,
        otp,
        expires_at: expiresAt,
        used: false
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store OTP');
    }

    // Send OTP email
    const emailResponse = await resend.emails.send({
      from: "StudyBuddy <noreply@studybuddy.co.bw>",
      to: [email],
      subject: "StudyBuddy - Password Reset OTP",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
              .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 8px; }
              .tagline { color: rgba(255,255,255,0.9); font-size: 16px; }
              .content { padding: 40px 20px; }
              .otp-box { background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
              .otp-code { font-size: 36px; font-weight: bold; color: #10b981; letter-spacing: 8px; margin: 10px 0; font-family: 'Courier New', monospace; }
              .footer { background: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb; }
              .warning { background: #fef3cd; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">📚 StudyBuddy</div>
                <div class="tagline">Your AI-Powered Study Companion for Botswana Education</div>
              </div>
              
              <div class="content">
                <h1 style="color: #111827; margin-bottom: 16px;">Password Reset Request</h1>
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
                  Hello! We received a request to reset your StudyBuddy password. Use the OTP code below to continue with your password reset:
                </p>
                
                <div class="otp-box">
                  <p style="color: #374151; margin-bottom: 10px; font-weight: 500;">Your OTP Code:</p>
                  <div class="otp-code">${otp}</div>
                  <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">This code will expire in 10 minutes</p>
                </div>
                
                <div class="warning">
                  <p style="color: #d97706; margin: 0; font-size: 14px;">
                    <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
                  </p>
                </div>
                
                <div style="margin: 30px 0; padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                  <h3 style="color: #059669; margin: 0 0 12px 0;">About StudyBuddy</h3>
                  <p style="color: #065f46; margin: 0; font-size: 14px; line-height: 1.5;">
                    StudyBuddy is your comprehensive AI-powered learning platform designed specifically for Botswana's education system. 
                    We support students from PSLE, JCE, to BGCSE levels with personalized courses, study materials, and intelligent tutoring.
                  </p>
                </div>
              </div>
              
              <div class="footer">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                  This email was sent by StudyBuddy - Botswana's Leading Educational Technology Platform
                </p>
                <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
                  © 2025 StudyBuddy. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, message: "OTP sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reset-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
