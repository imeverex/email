# SendMail — Custom Domain Email Sender

A Next.js app to send emails from your custom domain, hosted on Vercel, powered by Resend.

## Setup

### 1. Get a Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** → **Create API Key**
3. Copy your key

### 2. Verify Your Domain in Resend

1. In the Resend dashboard, go to **Domains** → **Add Domain**
2. Enter your custom domain (e.g. `yourdomain.com`)
3. Add the DNS records they provide to your domain registrar
4. Wait for verification (usually a few minutes)

Once verified, you can send from any address at that domain (e.g. `hello@yourdomain.com`)

### 3. Deploy to Vercel

#### Option A: GitHub + Vercel (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. In **Environment Variables**, add:
   - `RESEND_API_KEY` = your Resend API key
   - `FROM_EMAIL` = your verified email (e.g. `hello@yourdomain.com`)
   - `FROM_NAME` = display name (e.g. `Your Name`) — optional
4. Click **Deploy**

#### Option B: Vercel CLI

```bash
npm install -g vercel
vercel
```

Then add environment variables via the Vercel dashboard or:
```bash
vercel env add RESEND_API_KEY
vercel env add FROM_EMAIL
vercel env add FROM_NAME
```

### 4. Local Development

```bash
cp .env.local.example .env.local
# Fill in your values in .env.local

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | ✅ | Your Resend API key |
| `FROM_EMAIL` | ✅ | Verified sender email (must match your domain in Resend) |
| `FROM_NAME` | ❌ | Display name for the From field |

## Features

- ✅ Send from your custom domain
- ✅ To, CC, BCC support
- ✅ Plain text or HTML email body
- ✅ Multiple recipients (comma-separated)
- ✅ Clean, dark UI
- ✅ Error handling with clear messages
- ✅ Zero dependencies beyond Next.js + Resend
