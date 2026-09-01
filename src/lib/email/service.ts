export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: SendEmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@gosedma.com';

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('RESEND_API_KEY is not defined. Email send skipped. Log output:');
      console.log('--- EMAIL DUMP ---');
      console.log(`To: ${payload.to}`);
      console.log(`From: ${fromEmail}`);
      console.log(`Subject: ${payload.subject}`);
      console.log(`Body: ${payload.html}`);
      console.log('------------------');
    }
    return true; // Return true so flow doesn't break
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Failed to send email via Resend:', errBody);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Resend email error:', error);
    return false;
  }
}
