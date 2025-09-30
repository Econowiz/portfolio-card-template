# EmailJS Setup Guide

This guide will help you set up EmailJS to make your contact form functional.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: New Contact Form Submission from {{from_name}}

Hello {{to_name}},

You have received a new contact form submission:

Name: {{from_name}}
Email: {{from_email}}
Company: {{company}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. Save the template and note down your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to "Account" → "General" in your dashboard
2. Find your **Public Key** (e.g., `abcdefghijklmnop`)

## Step 5: Update Environment Variables

1. Open the `.env` file in the `econowiz.github.io` folder
2. Replace the placeholder values with your actual EmailJS credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

## Step 6: Test the Form

1. Start your development server: `pnpm dev`
2. Navigate to the contact section
3. Fill out and submit the form
4. Check your email for the message

## TypeScript Support

The application includes full TypeScript support for environment variables:

- Environment variables are typed in `src/vite-env.d.ts`
- Runtime validation utilities are available in `src/utils/env.ts`
- Build-time validation prevents deployment with invalid configuration
- IDE autocompletion and type checking for environment variables

## Troubleshooting

- **Form shows success but no email received**: Check your EmailJS dashboard for delivery status
- **"EmailJS not configured" in console**: Verify your environment variables are correct
- **Template variables not showing**: Ensure template variable names match exactly (case-sensitive)

## Security Notes

- The `.env` file is gitignored to protect your credentials
- EmailJS public keys are safe to expose in client-side code
- Consider setting up domain restrictions in EmailJS dashboard for production

## Production Deployment

### Environment Variable Validation

The application includes built-in environment variable validation to ensure proper configuration:

1. **Development Mode**: Missing or placeholder values will show warnings but allow the app to run with simulated email functionality
2. **Production Mode**: Missing or placeholder values will cause build failures to prevent deployment with invalid configuration

### Build Scripts

- `pnpm dev` - Start development server (allows placeholder values)
- `pnpm build` - Standard build (includes basic validation)
- `pnpm build:prod` - Production build with full environment validation
- `pnpm validate-env` - Manually validate environment variables

### Production Environment Setup

1. Create a `.env.production` file (copy from `.env.production.example`)
2. Fill in your actual EmailJS credentials:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_abc123
   VITE_EMAILJS_TEMPLATE_ID=template_xyz789
   VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
   ```
3. Run `pnpm validate-env` to verify configuration
4. Use `pnpm build:prod` for production builds

### Deployment Checklist

- [x] EmailJS service is configured and tested
- [x] Environment variables are set with actual values (not placeholders)
- [x] Domain restrictions are configured in EmailJS dashboard
- [x] Build validation passes (`pnpm validate-env`)
- [x] Production build completes successfully (`pnpm build:prod`)
- [x] Bot protection mechanisms are active
- [x] Rate limiting is implemented
- [x] Spam detection is enabled

### Security Best Practices & Bot Protection

1. **Domain Restrictions**: Configure allowed domains in your EmailJS dashboard to prevent unauthorized use
2. **Rate Limiting**:
   - Client-side: 3 attempts per 5 minutes per browser fingerprint
   - EmailJS: Built-in server-side rate limiting (200 emails/month on free tier)
3. **Bot Detection**:
   - Honeypot field (invisible to users, visible to bots)
   - Behavioral analysis (mouse movements, keystrokes, form interaction time)
   - Spam content detection (suspicious keywords, multiple URLs, excessive caps)
4. **Email Validation**: Strict email format validation with suspicious pattern detection
5. **Environment Files**: Never commit `.env`, `.env.production`, or other environment files to version control
6. **Monitoring**: Monitor EmailJS dashboard for unusual activity or quota usage

### Additional Quota Protection Measures

1. **EmailJS Dashboard Settings**:
   - Set up domain restrictions (recommended)
   - Enable email notifications for quota warnings
   - Monitor usage statistics regularly

2. **Client-Side Protection** (Already Implemented):
   - Rate limiting: 3 submissions per 5 minutes per user
   - Bot detection: Multiple behavioral checks
   - Spam filtering: Content analysis for suspicious patterns
   - Honeypot trap: Hidden field that bots typically fill

3. **Recommended EmailJS Settings**:
   - Enable "Block emails from unauthorized domains"
   - Set up email templates with variable validation
   - Consider upgrading to paid plan for higher limits if needed

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Basic email templates
- Standard support

For higher volume, consider upgrading to a paid plan.
