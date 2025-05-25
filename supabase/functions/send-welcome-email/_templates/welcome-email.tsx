
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Img,
  Hr,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  firstName: string
  confirmationUrl: string
}

export const WelcomeEmail = ({
  firstName,
  confirmationUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to StudyBuddy - Confirm your email to get started!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>🎓 Welcome to StudyBuddy!</Heading>
        </Section>
        
        <Section style={content}>
          <Text style={greeting}>Hi {firstName},</Text>
          
          <Text style={paragraph}>
            Welcome to <strong>StudyBuddy</strong> - your AI-powered learning companion! 
            We're thrilled to have you join our community of dedicated learners.
          </Text>
          
          <Text style={paragraph}>
            To get started and unlock all the amazing features StudyBuddy has to offer, 
            please confirm your email address by clicking the button below:
          </Text>
          
          <Section style={buttonContainer}>
            <Button href={confirmationUrl} style={button}>
              Confirm Your Email
            </Button>
          </Section>
          
          <Text style={paragraph}>
            Or copy and paste this link in your browser:
          </Text>
          <Link href={confirmationUrl} style={link}>
            {confirmationUrl}
          </Link>
          
          <Hr style={hr} />
          
          <Section style={featuresSection}>
            <Heading style={h2}>What you can do with StudyBuddy:</Heading>
            <Text style={featureText}>📚 <strong>AI-Powered Learning:</strong> Get personalized study recommendations</Text>
            <Text style={featureText}>💬 <strong>Smart Chat Assistant:</strong> Ask questions and get instant help</Text>
            <Text style={featureText}>📄 <strong>Document Analysis:</strong> Upload and analyze your study materials</Text>
            <Text style={featureText}>📝 <strong>Smart Notes:</strong> Take and organize notes with AI assistance</Text>
            <Text style={featureText}>🎯 <strong>Progress Tracking:</strong> Monitor your learning journey</Text>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={paragraph}>
            Need help getting started? Check out our 
            <Link href="#" style={link}> quick start guide</Link> or 
            <Link href="#" style={link}> contact our support team</Link>.
          </Text>
          
          <Text style={footer}>
            Happy studying!<br />
            The StudyBuddy Team
          </Text>
          
          <Text style={disclaimer}>
            If you didn't create an account with StudyBuddy, you can safely ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
  maxWidth: '600px',
}

const header = {
  padding: '32px 40px 20px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '8px 8px 0 0',
}

const content = {
  padding: '0 40px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
}

const greeting = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: '600',
  margin: '32px 0 16px',
}

const paragraph = {
  color: '#555555',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#667eea',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  border: 'none',
  cursor: 'pointer',
}

const link = {
  color: '#667eea',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
}

const featuresSection = {
  margin: '24px 0',
}

const featureText = {
  color: '#555555',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
}

const footer = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: '600',
  margin: '32px 0 16px',
}

const disclaimer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '24px 0 0',
  textAlign: 'center' as const,
}
