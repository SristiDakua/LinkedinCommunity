# 🚀 Deployment Guide - Environment Variables

## Frontend (Vercel) Environment Variables

### Required Environment Variables:

| Variable Name | Value | Description |
|---------------|--------|-------------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com/api` | Backend API base URL |

### How to Add in Vercel:

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add the variable:**
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`
   - Environments: Production ✅, Preview ✅, Development ✅

### Example Values:
```env
# Production
VITE_API_URL=https://linkedincommunity-backend.onrender.com/api

# Development (optional - uses localhost by default)
VITE_API_URL=http://localhost:3001/api
```

## Backend (Render/Railway) Environment Variables

### Required Environment Variables:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/professionalnetwork` | MongoDB connection string |
| `JWT_SECRET` | `your-super-secure-jwt-secret-key-here` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | JWT expiration time |
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `3001` | Server port (auto-set by Render) |
| `CLIENT_URL` | `https://your-vercel-app.vercel.app` | Frontend URL for CORS |

### MongoDB Atlas Setup:
1. Create MongoDB Atlas account
2. Create cluster and database user
3. Get connection string
4. Replace `<username>`, `<password>`, and `<dbname>` in connection string

## Deployment Order:

### 1. Deploy Backend First (Render/Railway)
```bash
# Your backend will be available at:
https://your-app-name.onrender.com
```

### 2. Deploy Frontend (Vercel)
```bash
# Add environment variable:
VITE_API_URL=https://your-app-name.onrender.com/api
```

### 3. Update Backend CORS
```bash
# Add your Vercel URL to backend environment:
CLIENT_URL=https://your-vercel-app.vercel.app
```

## Quick Deploy Commands:

### Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
vercel --prod

# Set environment variables
vercel env add VITE_API_URL
```

### Render Deploy:
1. Connect GitHub repository
2. Select `backend` folder
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables in dashboard

## Testing Deployment:

### Frontend Tests:
- ✅ Login/Register works
- ✅ Posts load and display
- ✅ Profile pages work
- ✅ API calls successful

### Backend Tests:
- ✅ API endpoints respond
- ✅ Database connection works
- ✅ Authentication functional
- ✅ CORS configured correctly

## Troubleshooting:

### Common Issues:
1. **API calls failing**: Check `VITE_API_URL` is correct
2. **CORS errors**: Verify `CLIENT_URL` in backend
3. **Database connection**: Check MongoDB Atlas settings
4. **Authentication issues**: Verify JWT_SECRET is set

### Debug Commands:
```bash
# Check environment variables
console.log(import.meta.env.VITE_API_URL)

# Check API connectivity
fetch(import.meta.env.VITE_API_URL + '/health')
```
