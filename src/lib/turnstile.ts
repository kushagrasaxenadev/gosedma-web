export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // For local development, if secret key is not set, allow verification to pass.
  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY is not defined. Skipping verification.');
    return true;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const outcome = await result.json();
    return !!outcome.success;
  } catch (error) {
    console.error('Turnstile verification failed:', error);
    return false;
  }
}
