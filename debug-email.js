// Debug email functionality
require('dotenv').config({ path: '.env' });

async function debugEmail() {
  console.log('🔍 Debugging Email Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL || '❌ Not set');
  console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || '❌ Not set');
  console.log('');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found. Email sending will fail.');
    return;
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log('🧪 Testing email send to your email...');
    
    // Test with a real email (change this to YOUR email for testing)
    const testEmail = 'your-email@gmail.com'; // CHANGE THIS TO YOUR ACTUAL EMAIL
    
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@gadighar.com',
      to: testEmail,
      subject: '🚗 Gadi Ghar Email Test - ' + new Date().toLocaleTimeString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🧪 Email Test</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #dc2626; margin-top: 0;">Email Configuration Test</h2>
            <p>If you're receiving this email, your Resend configuration is working!</p>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">📊 Configuration Details</h3>
              <p><strong>From Email:</strong> ${process.env.FROM_EMAIL}</p>
              <p><strong>API Key:</strong> ${process.env.RESEND_API_KEY.substring(0, 15)}...</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              This email was sent from <strong>Gadi Ghar</strong> email testing script.
            </p>
          </div>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('📝 Email ID:', result.data?.id);
    console.log('📤 Sent to:', testEmail);
    console.log('📧 From:', process.env.FROM_EMAIL);
    console.log('');
    console.log('🔍 Next steps:');
    console.log('1. Check your email inbox (including spam folder)');
    console.log('2. If received, the issue is with dealership email addresses');
    console.log('3. If not received, there might be a domain/DNS issue');
    
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error Message:', error.message);
    console.error('Error Details:', error);
    
    if (error.message.includes('401')) {
      console.log('\n💡 Troubleshooting tip: 401 error usually means invalid API key');
    } else if (error.message.includes('domain')) {
      console.log('\n💡 Troubleshooting tip: Domain verification might be needed in Resend');
    }
  }
}

// Run the debug
debugEmail().catch(console.error);
