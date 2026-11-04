# 🌍 Wanderlust - Vacation Rentals & Airbnb Clone

A full-stack web application inspired by Airbnb, built with the **MERN / MEN stack** (MongoDB, Express.js, Node.js, EJS). Wanderlust allows users to explore, create, edit, and review holiday listings around the world with secure authentication and cloud image uploads.

---

## ✨ Features

- **🏠 Listings Management (CRUD)**:
  - Browse all destinations with interactive filter categories (Trending, Rooms, Iconic Cities, Mountains, etc.).
  - Total pricing calculator with tax switch toggle (+18% GST).
  - Create new listings with image uploads directly stored on Cloudinary.
  - Edit and update listing details or upload replacement photos.
  - Delete listings with automatic cleanup of associated reviews.

- **⭐ Interactive Reviews & Star Ratings**:
  - Submit reviews with a modern, interactive 5-star CSS rating widget with hover glow effects.
  - View average ratings and detailed customer reviews on listing pages.
  - Delete reviews with author-level permission checks.

- **🔐 Authentication & Authorization**:
  - User Registration and Login powered by **Passport.js** and **passport-local-mongoose**.
  - Protected routes: Only logged-in users can create listings or post reviews.
  - Ownership protection: Only the owner of a listing can edit or delete it; only the review author can delete their review.
  - Automatic redirect back to the intended page after login.

- **🛡️ Validation & Error Handling**:
  - Server-side data validation using **Joi** schemas for listings and reviews.
  - Custom `ExpressError` handler and clean user-facing error templates.
  - Client-side Bootstrap form validation.

- **☁️ Cloud Image Storage**:
  - Image upload processing with **Multer** and storage via **Cloudinary**.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js (v5)
- **Database**: MongoDB, Mongoose ODM
- **Templating Engine**: EJS, ejs-mate (layouts & partials)
- **Authentication**: Passport.js, Passport-Local, Passport-Local-Mongoose
- **File Uploads**: Multer, Cloudinary (`multer-storage-cloudinary`)
- **Validation**: Joi
- **Styling & UI**: Bootstrap 5, FontAwesome, Custom CSS (CSS Star Rating)

---

## 📁 Project Structure

```text
MjProject/
├── controllers/          # Route controller logic (listings, reviews, users)
├── init/                 # Sample data and DB initialization script
├── models/               # Mongoose data models (listing, review, user)
├── public/               # Static assets
│   ├── CSS/              # Custom stylesheets (style.css, rating.css)
│   └── js/               # Client-side scripts (form validation)
├── routes/               # Express routers (listing.js, review.js, user.js)
├── utils/                # Helper utilities (wrapAsync, ExpressError)
├── views/                # EJS templates
│   ├── includes/         # Navbar, footer, flash alerts
│   ├── layouts/          # Boilerplate layout
│   ├── listings/         # Listing views (index, show, new, edit)
│   └── users/            # User auth views (login, signup)
├── .env                  # Environment secrets (git-ignored)
├── .gitignore            # Git ignore file
├── app.js                # Express app entry point & DB configuration
├── cloudConfig.js        # Cloudinary setup
├── middleware.js         # Auth & validation middleware
├── package.json          # Project metadata & dependencies
├── Schema.js             # Joi validation schemas
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local Community Server or MongoDB Atlas account)
- [Cloudinary Account](https://cloudinary.com/) (for image hosting)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AmandeepSingh455/Wanderlust-bnb.git
   cd Wanderlust-bnb
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   # Cloudinary Credentials
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret

   # MongoDB Connection (Local or Atlas)
   MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
   # ATLAS_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wanderlust?retryWrites=true&w=majority

   # Session Secret
   SECRET=your_super_secret_session_key
   PORT=8080
   ```

4. **Initialize / Seed Sample Data** *(Optional)*:
   ```bash
   node init/index.js
   ```

5. **Start the server**:
   ```bash
   npm start
   ```
   or
   ```bash
   node app.js
   ```

6. **Open in browser**:
   Visit [http://localhost:8080](http://localhost:8080)

---

## 📝 License

This project is open source and available under the [ISC License](LICENSE).
