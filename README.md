# Ghoripara

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
  <img src="https://img.shields.io/badge/node-%3E18-red" alt="node">
</p>

A luxury watch e-commerce web application built with Node.js, Express, and MongoDB.

---

## About

Ghoripara is a premium e-commerce platform for luxury watches. It features a modern design, user authentication system, admin dashboard for product management, and a seamless shopping experience.

## Features

- **User Authentication** - Secure registration and login with JWT
- **Admin Dashboard** - Manage products with image uploads
- **Product Catalog** - Browse watches with pricing and discounts
- **Shopping Cart** - Add products to cart
- **User Profile** - Edit profile and view orders
- **Responsive Design** - Works on all devices

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| EJS | Template Engine |
| Tailwind CSS | Styling |
| JWT | Authentication |
| bcrypt | Password Hashing |

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd ghoripara

# Install dependencies
npm install
```

### Environment Variables

Create `.env` file in root directory:

```env
# Server
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/ghoripara

# Authentication
JWT_SECRET=your_jwt_secret_key
EXPRESS_SESSION_SECRET=your_session_secret_key
```

### Run Development Server

```bash
npm start
# or
node app.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Routes

### Public Routes

| Endpoint | Method | Description |
|---------|--------|-------------|
| `/` | GET | Landing page |
| `/login` | GET/POST | User login |
| `/register` | GET/POST | User registration |
| `/owners/login` | GET/POST | Admin login |
| `/owners/register` | GET/POST | Admin registration |

### User Routes (Authenticated)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/explore` | GET | Product catalog |
| `/user/dashboard` | GET | User dashboard |
| `/user/edit` | POST | Update profile |
| `/logout` | GET | Logout |

### Admin Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/owners/all` | GET | All products |
| `/owners/generate` | GET | Create product page |
| `/products/generateproduct` | POST | Add new product |

---

## Project Structure

```
ghoripara/
├── app.js                 # Application entry point
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
├── .env                # Environment variables
├── config/
│   ├── keys.js         # API keys
│   ├── mongoose-connection.js    # Database connection
│   └── development.json      # Development config
├── controllers/
│   └── authController.js    # Authentication logic
├── models/
│   ├── user-model.js       # User schema
│   ├── owner-model.js       # Owner schema
│   └── product-model.js    # Product schema
├── routes/
│   ├── index.js          # Base routes
│   ├── ownersRouter.js   # Admin routes
│   ├── usersRouter.js    # User routes
│   └── productsRouter.js # Product routes
├── utils/
│   └── generateToken.js  # JWT token generator
├── views/
│   ├── index.ejs        # Landing page
│   ├── login.ejs        # Login page
│   ├── register.ejs    # Registration page
│   ├── explore.ejs     # Product catalog
│   ├── dashboard.ejs   # User dashboard
│   └── ...
└── public/
    ├── css/           # Stylesheets
    ├── js/           # Scripts
    └── images/       # Static images
```

---

## API Reference

### Authentication

All authenticated routes require a valid JWT token in cookies.

### Models

#### User
```javascript
{
  name: String,
  email: String,
  password: String,
  contact: Number,
  cart: [ObjectId],
  orders: [ObjectId],
  pfp: { buffer: Buffer, mimetype: String }
}
```

#### Product
```javascript
{
  image: { buffer: Buffer, mimetype: String },
  name: String,
  price: Number,
  discount: Number,
  details: String,
  bgcolor: String,
  panelcolor: String,
  textcolor: String
}
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Author

**Adrishikhar Chowdhury**
- GitHub: [AdrishikharChowdhury](https://github.com/AdrishikharChowdhury)
- Email: amiadrishikhar@gmail.com

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- Built with modern JavaScript technologies
- Designed with Tailwind CSS
- Powered by MongoDB

---

<p align="center">Made with ❤️ by Ghoripara</p>