# Deploying SpiritTok to spirittok.com

## Option 1: Vercel (Recommended)
1. Push code to GitHub repository
2. Connect Vercel to your GitHub repo
3. In Vercel dashboard, go to Domains
4. Add custom domain: `spirittok.com`
5. Update your domain's DNS records:
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
   - Type: A, Name: @, Value: 76.76.19.61

## Option 2: Netlify
1. Build: `npm run build`
2. Deploy dist folder to Netlify
3. In Netlify dashboard, add custom domain
4. Update DNS:
   - Type: CNAME, Name: www, Value: your-site.netlify.app
   - Type: A, Name: @, Value: 75.2.60.5

## Option 3: Firebase Hosting
1. Install: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Init: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`
6. Add custom domain in Firebase console

## Environment Variables
Update these in your hosting platform:
- VITE_SUPABASE_URL=your-supabase-url
- VITE_SUPABASE_ANON_KEY=your-supabase-key
- VITE_AGORA_APP_ID=your-agora-app-id

## SSL Certificate
Most hosting services provide free SSL automatically.
Your site will be accessible at https://spirittok.com