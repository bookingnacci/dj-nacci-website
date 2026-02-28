# DJ Nacci Website

## Overview
Premium DJ showcase website for DJ "Nacci" with dark luxury aesthetic (black and gold). Includes a public vitrine and a fully functional admin panel.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Express.js + PostgreSQL + Drizzle ORM
- **Routing**: wouter (client-side SPA)
- **State**: SettingsContext fetches data from API endpoints

## Key URLs
- `/` - Public homepage (Hero, About, Gallery, Social Links, Booking form)
- `/admin` - Admin panel (hidden from navigation, direct URL access only)

## Database Tables
- `media_items` - Hero/About/Gallery media (images, videos, YouTube)
- `social_links` - Instagram, TikTok, YouTube, Threads URLs
- `booking_requests` - Booking form submissions

## API Endpoints
- `GET/POST/PATCH/DELETE /api/media/:section` - Media CRUD
- `POST /api/media/upload` - File upload (multer)
- `POST /api/media/reorder` - Reorder media positions
- `GET/POST /api/social-links` - Social links
- `GET/POST/PATCH/DELETE /api/booking-requests` - Bookings

## File Uploads
- Stored in `/uploads/` directory, served statically

## Design
- Background: #0a0a0a, Gold primary: hsl(43 74% 49%)
- Fonts: Cormorant (serif titles) + Manrope (UI)
- Grain texture overlay, glass panels

## User Preferences
- Never delete Hero or Gallery sections when making updates
- Admin accessible only via direct URL `/admin`
- Booking form: country code selector, date from tomorrow, 200 char min details
- Slogan: "FEEL THE MUSIC, OR DIE TRYING"
- DJ list ends with "PAUZA, NITEFREAK, and many more"
