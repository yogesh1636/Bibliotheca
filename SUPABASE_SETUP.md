# 🚀 Supabase Setup Guide for WebReader

## 📋 What You'll Need
- Email address
- 5 minutes of your time
- Web browser

---

## Step 1: Create Supabase Account

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with:**
   - GitHub (recommended)
   - Or email/password

---

## Step 2: Create New Project

1. **Click "New Project"**
2. **Fill in project details:**
   - **Organization**: Select your organization
   - **Project Name**: `WebReader`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
3. **Click "Create new project"**
4. **Wait 2-3 minutes** for setup to complete

---

## Step 3: Setup Database

1. **Go to "SQL Editor"** (left sidebar)
2. **Copy ALL content** from `supabase_setup.sql` file
3. **Paste into SQL editor**
4. **Click "RUN"** button
5. **Wait for "Success"** message

### ✅ Verify Setup:
- Go to **"Table Editor"**
- You should see 6 tables: `books`, `profiles`, `cart_items`, `orders`, `order_items`, `wishlist`

---

## Step 4: Get API Keys

1. **Go to "Settings"** (left sidebar)
2. **Click "API"**
3. **Copy these 2 values:**

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 5: Configure WebReader

1. **Open `supabase-config.js`** in your project
2. **Replace the placeholder values:**

```javascript
const SUPABASE_URL = 'https://your-actual-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-actual-anon-key-here';
```

3. **Save the file**

---

## Step 6: Enable Authentication

1. **Go to "Authentication"** → **"Settings"**
2. **Under "Auth Providers":**
   - ✅ Ensure **Email** is enabled
3. **Site URL Settings:**
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your domain if deploying

### 📧 Email Settings (Optional):
- For development: Check **"Disable email confirmations"**
- For production: Configure SMTP in **"SMTP Settings"**

---

## Step 7: Test Your Setup

1. **Open `index.html`** in browser
2. **Click "Sign In"** button
3. **Try creating account**
4. **Browse books in shop**
5. **Add items to cart**
6. **Complete test order**

---

## 🔧 Troubleshooting

### ❌ "Invalid API key" error:
- Double-check URL and key in `supabase-config.js`
- Remove any extra spaces or quotes

### ❌ "Table doesn't exist" error:
- Verify SQL setup completed successfully
- Check Table Editor for all 6 tables

### ❌ Books not loading:
- Check browser console for errors
- Verify sample data was inserted

### ❌ Sign up not working:
- Check if email confirmations are disabled
- Verify auth settings in Supabase

---

## 📊 Database Tables Created

| Table | Purpose |
|-------|---------|
| `books` | Store book catalog |
| `profiles` | User information |
| `cart_items` | Shopping cart items |
| `orders` | Order records |
| `order_items` | Items in each order |
| `wishlist` | User favorites |

---

## 🎯 Features Enabled

✅ User registration & login  
✅ Persistent shopping cart  
✅ Order history tracking  
✅ User profile management  
✅ Secure data access  
✅ Real-time updates  

---

## 🚀 Deployment (Optional)

### Netlify:
1. Push code to GitHub
2. Connect repo to Netlify
3. Deploy automatically

### Vercel:
1. Import GitHub repo
2. Deploy with one click

---

## 📞 Need Help?

- **Check browser console** for error messages
- **Review Supabase logs** in dashboard
- **Verify all steps** completed correctly

---

**🎉 That's it! Your WebReader is now powered by Supabase!**