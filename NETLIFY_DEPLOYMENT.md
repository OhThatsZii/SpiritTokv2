# Deploy SpiritTok to spirittok.com on Netlify

## Quick Deploy Steps

### 1. Connect Repository
- Push your code to GitHub/GitLab
- Go to [Netlify](https://netlify.com) and sign in
- Click "New site from Git"
- Connect your repository

### 2. Build Settings
Netlify will auto-detect these from `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

### 3. Environment Variables
In Netlify dashboard > Site settings > Environment variables, add:
```
VITE_SUPABASE_URL=https://ffpkneionqoixqlqschn.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_AGORA_APP_ID=your-agora-app-id
```

### 4. Custom Domain Setup
1. In Netlify dashboard > Domain settings
2. Click "Add custom domain"
3. Enter: `spirittok.com`
4. Update your domain's DNS records:

**DNS Records:**
- Type: `CNAME`, Name: `www`, Value: `your-site-name.netlify.app`
- Type: `A`, Name: `@`, Value: `75.2.60.5`

### 5. SSL Certificate
- Netlify provides free SSL automatically
- Your site will be live at `https://spirittok.com`

## Manual Deploy (Alternative)
1. Run: `npm run build`
2. Drag `dist` folder to Netlify deploy area
3. Follow domain setup steps above

## Features Enabled
✅ SPA routing with redirects
✅ WWW to non-WWW redirect
✅ Security headers
✅ Asset caching
✅ Production optimizations