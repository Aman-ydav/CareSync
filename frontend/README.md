# CareSync - Healthcare Management Platform

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF.svg)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11.0-764ABC.svg)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A comprehensive healthcare management platform connecting patients, doctors, and administrators through an intuitive web interface. Built with modern React technologies for seamless healthcare coordination.

## 🌟 Overview

CareSync revolutionizes healthcare management by providing a unified platform where patients can easily book appointments, manage health records, and access AI-powered medical assistance. Doctors can efficiently manage their schedules and patient interactions, while administrators oversee the entire system with powerful analytics and controls.

## ✨ Key Features

### 👥 Multi-Role User System
- **Patients**: Book appointments, view health records, access AI chat support
- **Doctors**: Manage appointments, review patient records, provide consultations
- **Administrators**: System oversight, user management, analytics dashboard

### 📅 Appointment Management
- Real-time appointment scheduling
- Calendar integration with availability tracking
- Automated reminders and notifications
- Appointment status tracking and history

### 🏥 Health Records
- Secure digital health record storage
- Medical history tracking
- Document upload and management
- Privacy-compliant data handling

### 🤖 AI-Powered Assistant
- Intelligent medical chat support
- Symptom analysis and guidance
- AI-powered text enhancement for medical documentation (diagnoses, notes, vital signs)
- 24/7 availability for preliminary consultations
- Integration with healthcare knowledge base

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/Light theme support
- Intuitive navigation and workflows
- Accessibility-first approach

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js 5.2.1** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose 9.0.0** - Elegant MongoDB object modeling for Node.js
- **JWT (jsonwebtoken 9.0.2)** - JSON Web Tokens for secure authentication
- **bcrypt & bcryptjs** - Password hashing for security
- **Cloudinary 2.8.0** - Cloud-based image and video management
- **Multer 2.0.2** - Middleware for handling file uploads
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware
- **Cookie Parser 1.4.7** - Parse HTTP request cookies
- **@google/generative-ai 0.24.1** - Google's Generative AI for AI chat features
- **@getbrevo/brevo 3.0.1** - Email service for notifications
- **Axios 1.13.2** - HTTP client for API requests

### Development Tools (Backend)
- **Nodemon 3.1.11** - Utility for automatic server restarts during development
- **Prettier 3.7.1** - Code formatter for consistent styling

### Frontend Framework
- **React 19.2.0** - Modern JavaScript library for building user interfaces
- **Vite 7.2.4** - Fast build tool and development server
- **React Router DOM 7.9.6** - Declarative routing for React

### State Management
- **Redux Toolkit 2.11.0** - State management with simplified Redux logic
- **React Redux 9.2.0** - Official React bindings for Redux

### UI & Styling
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **shadcn/ui** - Re-usable UI components built on Radix UI
- **Framer Motion 12.23.25** - Animation library for React
- **Lucide React 0.555.0** - Beautiful & consistent icon toolkit

### Forms & Validation
- **React Hook Form 7.67.0** - Performant forms with easy validation
- **Zod 4.1.13** - TypeScript-first schema validation
- **@hookform/resolvers 5.2.2** - Resolvers for React Hook Form

### HTTP & Real-time Communication
- **Axios 1.13.2** - Promise-based HTTP client
- **Socket.io-client 4.8.1** - Real-time bidirectional communication

### Utilities
- **Day.js 1.11.19** - Lightweight date library
- **Date-fns 4.1.0** - Modern JavaScript date utility library
- **Lodash 4.17.21** - Utility library for JavaScript
- **Class Variance Authority 0.7.1** - Utility for managing component variants

### Development Tools
- **ESLint 9.39.1** - Pluggable linting utility for JavaScript
- **Vite Plugin React 5.1.1** - Official React plugin for Vite
- **@tailwindcss/vite 4.1.17** - Tailwind CSS integration for Vite

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control

### Backend Requirements
This frontend application requires a compatible backend API. Ensure the backend is running on the configured port (default: 5000).

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Configure your environment variables (see Environment Setup section below).

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (default Vite port)

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# For local development:
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000

# For production (override in Vercel dashboard):
# VITE_API_URL=https://your-backend-url.com/api/v1
# VITE_SOCKET_URL=https://your-backend-url.com
```

### Environment Variables Explanation
- `VITE_API_URL`: Base URL for the backend API endpoints
- `VITE_SOCKET_URL`: WebSocket URL for real-time features

### Sample Environment Files

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000

# For production (replace with your actual URLs):
# VITE_API_URL=https://your-backend-domain.com/api/v1
# VITE_SOCKET_URL=https://your-backend-domain.com
```

#### Backend (.env)
```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Frontend URLs
FRONTEND_URL_PROD=https://your-frontend-domain.vercel.app
FRONTEND_URL_DEV=http://localhost:5173
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:5173

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Brevo/Sendinblue)
BREVO_API_KEY=your_brevo_api_key
SMTP_FROM_EMAIL="CareSync <noreply@caresync.com>"

# JWT Tokens
ACCESS_TOKEN_SECRET=your_access_token_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
REFRESH_TOKEN_EXPIRY=10d

# Google AI (Gemini)
GENAI_API_KEY=your_google_ai_api_key
GENAI_MODEL=gemini-2.0-flash-exp

# CORS
CORS_ORIGIN=*
```

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality checks
npm run lint
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service functions
│   │   ├── adminAPI.js
│   │   ├── aiChatAPI.js
│   │   ├── appointmentAPI.js
│   │   ├── auth.js
│   │   ├── healthRecordAPI.js
│   │   └── axiosInterceptor.js
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── appointments/ # Appointment-related components
│   │   ├── health/       # Health record components
│   │   └── ai/           # AI chat components
│   ├── features/         # Redux slices and state management
│   │   ├── auth/
│   │   ├── appointments/
│   │   ├── healthRecords/
│   │   ├── aiChat/
│   │   └── admin/
│   ├── hooks/            # Custom React hooks
│   ├── layout/           # Layout components
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   │   ├── dashboard/
│   │   ├── appointments/
│   │   ├── profile/
│   │   ├── records/
│   │   └── ai/
│   ├── router/           # Routing configuration
│   ├── store/            # Redux store configuration
│   ├── utils/            # Helper utilities
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── components.json      # shadcn/ui configuration
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── jsconfig.json        # JavaScript configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── vercel.json          # Vercel deployment configuration
├── vite.config.js       # Vite configuration
└── README.md            # Project documentation

backend/
├── src/
│   ├── controllers/      # Route controllers
│   │   ├── admin.controller.js
│   │   ├── aiChat.controller.js
│   │   ├── appointment.controller.js
│   │   ├── healthRecord.controller.js
│   │   └── user.controller.js
│   ├── db/               # Database connection
│   │   └── index.js
│   ├── middlewares/      # Express middlewares
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   │   ├── requireAdmin.middleware.js
│   │   └── roleCheck.middleware.js
│   ├── models/           # MongoDB models
│   │   ├── appointment.model.js
│   │   ├── chatMessage.model.js
│   │   ├── healthRecord.model.js
│   │   └── user.model.js
│   ├── routes/           # API routes
│   │   ├── admin.routes.js
│   │   ├── aiChat.routes.js
│   │   ├── appointment.routes.js
│   │   ├── healthRecord.routes.js
│   │   └── user.routes.js
│   ├── utils/            # Utility functions
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   ├── fileCleanUp.js
│   │   └── sendEmail.js
│   ├── app.js            # Express app configuration
│   ├── config.js         # Configuration settings
│   ├── constant.js       # Application constants
│   └── index.js          # Server entry point
├── public/               # Static files
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── check-model.js       # AI model checker script
├── package.json         # Dependencies and scripts
└── package-lock.json    # Lockfile for dependencies
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project: `npm run build`
2. Serve the `dist` folder using any static hosting service
3. Configure environment variables for production

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

For questions, support, or collaboration opportunities:

- **Email**: [your-email@example.com]
- **GitHub Issues**: [Create an issue](https://github.com/your-username/caresync-frontend/issues)
- **Documentation**: [Link to full documentation]

---

**Built with ❤️ for better healthcare management**
