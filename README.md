# AQWG - AdventureQuest Worlds Guides

A modern platform for AdventureQuest Worlds community guides with admin dashboard, user feedback, and announcements.

## Features

- 📚 **Dynamic Guide System** - Modular section-based guides
- 🔧 **Admin Dashboard** - Create and manage guides
- ⭐ **User Feedback** - Community ratings and comments
- 📢 **Announcements** - Post game updates
- 🎨 **Modern Design** - Dark theme, mobile responsive

## Quick Start

### Step 1: Install Dependencies

```bash
cd aqwg-site
npm install
```

### Step 2: Get Supabase API Keys

1. Go to **https://supabase.com** → Sign up (with GitHub is easiest)
2. Create a new **Project** (wait 2-3 minutes for it to initialize)
3. Click **Settings** (gear icon) in the left sidebar
4. Click **API** 
5. You'll see these keys on the page:
   - **Project URL** → Copy the `https://xxxxx.supabase.co` URL
   - **sb_publishable_...** (Publishable Key) → This is your **ANON KEY**
   - **sb_secret_...** (Secret Key) → This is your **SERVICE ROLE KEY**

### Step 3: Configure Environment Variables

Open `.env` file and fill in the 3 keys you just copied:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-name.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_BalJSKGC8hFE2e5Pntya-g_HCX0lb2z
SUPABASE_SERVICE_ROLE_KEY=sb_secret_fFHQOe2Jmr9I2KiLp72iBw_j4emhwOe
DISCORD_WEBHOOK_URL=your_webhook_url (optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/your-invite
```

### Step 4: Create Database Tables

1. In Supabase, click **SQL Editor**
2. Click **New Query**
3. Paste this SQL and click **Run**:

```sql
-- Create guides table
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  category VARCHAR NOT NULL CHECK (category IN ('class', 'item', 'reputation', 'farming', 'enhancement')),
  description TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR NOT NULL,
  image_url VARCHAR
);

-- Create announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('game_update', 'event', 'maintenance')),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_feedback table
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  user_name VARCHAR NOT NULL,
  user_email VARCHAR,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create site_updates table
CREATE TABLE site_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  changes JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id VARCHAR UNIQUE NOT NULL,
  username VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'moderator' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR NOT NULL,
  page_path VARCHAR NOT NULL,
  guide_id UUID,
  user_agent TEXT,
  referrer TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create discord_submissions table
CREATE TABLE discord_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  username VARCHAR NOT NULL,
  message TEXT NOT NULL,
  message_link VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 5: Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

## Project Structure

```
aqwg-site/
├── app/
│   ├── layout.tsx           # Main layout
│   ├── page.tsx             # Home page
│   ├── guides/              # Guides listing
│   ├── announcements/       # Announcements
│   ├── admin/               # Admin dashboard
│   │   └── guides/new/      # Guide editor
│   ├── api/                 # API routes
│   │   ├── guides/
│   │   ├── feedback/
│   │   └── announcements/
│   └── (other pages)
├── lib/
│   ├── supabase.ts         # Database client
│   └── analytics.ts        # Analytics tracking
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── .env                    # Your secrets (fill these!)
├── package.json
└── README.md
```

## Supabase API Keys - WHERE TO FIND THEM

### ❌ NOT in Organization Settings!

The API keys are NOT in Organization Settings. They're in your **PROJECT settings**.

### ✅ CORRECT Path:

1. **After creating a Supabase project**, you'll see the project dashboard
2. Look for the **Settings icon** (⚙️ gear icon) on the **left sidebar**
3. Click **Settings**
4. In the left menu, click **API** (it's there, not in Organization!)

### You'll See This Screen:

```
┌─────────────────────────────────────┐
│ Project API Keys                    │
├─────────────────────────────────────┤
│ Project URL                         │
│ https://abcde123.supabase.co       │ ← Copy this
│ (Copy icon button on right)         │
├─────────────────────────────────────┤
│ anon public                         │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX... │ ← Copy this
│ (Copy icon button on right)         │
├─────────────────────────────────────┤
│ service_role (SECRET!)              │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX... │ ← Copy this
│ (Copy icon button on right)         │
└─────────────────────────────────────┘
```

### Copy Each Key:

1. **Project URL** - Copy the full URL starting with `https://`
2. **anon public** - Copy the entire long string
3. **service_role** - Copy the entire long string (this is secret, keep it safe!)

### Fill in .env File:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcde123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...
```

### Common Mistakes:

❌ **Looking in Organization Settings** - They're not there!
❌ **Copying incomplete keys** - Copy the ENTIRE string
❌ **Using wrong key for wrong variable** - Paste in correct spots
❌ **Not waiting for project to initialize** - Wait 2-3 minutes after creating project

### If You Can't Find It:

1. Make sure your **project finished initializing** (wait a few minutes)
2. Look for **Settings** (gear icon) in the **left sidebar** (not top menu)
3. Click **API** in the Settings page
4. If still can't find it, try refreshing the page

---

## Database Schema

### Tables
- **guides** - Game guides with sections
- **announcements** - Game update announcements
- **site_updates** - Site changelog/versions
- **discord_submissions** - User submissions via Discord
- **user_feedback** - Guide ratings and comments
- **admin_users** - Admin user management

The SQL schema is included in Step 4 above.

## Admin Dashboard

Access at `/admin`

### Features
- Create/Edit guides with modular sections
- Manage announcements and site updates
- Review user feedback
- View Discord submissions
- Upload images (stored in Supabase)

### Section Types
- **Overview** - Quick guide summary
- **Requirements** - Prerequisites and items needed
- **Step** - Farming/quest steps (repeatable)
- **Tips** - Helpful hints and tricks
- **Preview** - Images of class/item
- **Notes** - Additional information

## Deployment to Vercel

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Add environment variables (from `.env`)
   - Deploy!

3. **Set Custom Domain**
   - In Vercel Settings > Domains
   - Add `aqwg.net` or your domain

## Discord Integration

### Webhook Setup

1. Create a Discord channel (e.g., #submissions)
2. Server Settings > Webhooks > New Webhook
3. Copy webhook URL
4. Add to `.env`:

```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### Discord Submissions

Users can submit guide updates via:
- Discord command (if bot implemented)
- Submission form on site

All submissions go to your Discord channel for review.

## Development Tips

### Adding a New Guide Programmatically

```typescript
const { data } = await supabase
  .from('guides')
  .insert([{
    title: "Void Highlord",
    slug: "void-highlord",
    category: "class",
    description: "Best soloing class",
    sections: [
      {
        id: "1",
        type: "overview",
        title: "Overview",
        content: "..."
      }
    ],
    published: true
  }]);
```

### User Feedback Submission

```javascript
const response = await fetch('/api/feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    guide_id: guideId,
    user_name: 'Player Name',
    rating: 5,
    comment: 'Great guide!'
  })
});
```

## Common Issues

### Supabase Connection Error
- Check `.env` file has correct URL and keys
- Verify Supabase project is active
- Check Row Level Security policies

### Images Not Uploading
- Ensure `image_url` is correct in `.env`
- Check Supabase Storage bucket permissions
- Verify file size is under 5MB

### Discord Webhook Failing
- Confirm webhook URL is valid
- Check webhook still exists in Discord server
- Verify Discord bot permissions

## Contributing

Community contributions welcome! To update guides:

1. Submit via Discord webhook
2. Use the admin dashboard
3. Create a PR on GitHub

## License

This project is a community resource for AdventureQuest Worlds players.

## Support

- **Discord**: [Join Server](https://discord.gg/your-server)
- **Issues**: Create an issue on GitHub
- **Email**: contact@example.com

---

**AQWG** - Made by the community, for the community.
