# ShowSales.pk - Pakistan's #1 Sale Aggregator

🛍️ **Never Miss a Sale Again!** Discover the best discounts from all your favorite Pakistani clothing and shoes brands - Khaadi, Gul Ahmed, Sapphire, Servis & more - all in one place!

![ShowSales.pk](https://showsales.pk/og-image.jpg)

## 🚀 Features

- **Sale Aggregation**: All Pakistani fashion brand sales in one place
- **Real-time Updates**: Instant notifications when new sales go live
- **Price Tracking**: Track price history and get price drop alerts
- **Brand Pages**: Dedicated pages for each brand with their active sales
- **Categories**: Browse by Clothing, Footwear, Accessories & more
- **User Accounts**: Save favorites, get personalized alerts
- **Brand Dashboard**: Brands can manage their own sales & promotions
- **Admin Panel**: Full control over content and users
- **Dark Mode**: Easy on the eyes, day or night
- **Mobile Responsive**: Perfect on any device

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Modules
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Credentials, Google & Facebook
- **Email**: Nodemailer
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/showsales.git
cd showsales

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password

# OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Site
NEXT_PUBLIC_BASE_URL=https://showsales.pk
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── panel/             # Admin & Brand dashboards
│   ├── sales/             # Sale pages
│   ├── brands/            # Brand pages
│   └── ...
├── components/            # React components
│   ├── home/             # Homepage sections
│   ├── ui/               # Reusable UI components
│   └── layout/           # Header, Footer
├── lib/                   # Utilities
│   ├── mongodb.ts        # Database connection
│   ├── auth.ts           # Auth configuration
│   ├── rateLimit.ts      # Rate limiting
│   └── validation.ts     # Input validation
├── models/               # Mongoose models
└── types/                # TypeScript types
```

## 🔒 Security Features

- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Protected admin routes with middleware
- Secure password hashing with bcrypt
- CSRF protection via NextAuth

## 📊 API Endpoints

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | `/api/sales`       | List all sales          |
| GET    | `/api/brands`      | List all brands         |
| GET    | `/api/categories`  | List categories         |
| POST   | `/api/subscribers` | Subscribe to newsletter |
| POST   | `/api/contact`     | Submit contact form     |

## 🚀 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/showsales)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ in Pakistan
