# WeGoToCalStateLA - Mental Health & Wellness Platform

## 🎯 What is WeGoToCalStateLA?

WeGoToCalStateLA is a comprehensive mental health and wellness platform designed specifically for California State University, Los Angeles students. The application provides tools for mental health assessment, daily wellness tracking, resources, and community support.

### Key Features
- **Mental Health Assessments**: PHQ-9 (Depression) and GAD-7 (Anxiety) screening tools
- **Daily Check-ins**: Mood, sleep quality, and stress level tracking
- **AI Chat Assistant**: Supportive conversations and guidance (UI ready)
- **Progress Analytics**: Visual tracking of wellness journey
- **Campus Resources**: Mental health services and emergency contacts
- **Cross-Platform**: Works on web browsers, iOS, and Android devices

## 🚀 How to Start Running the App

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (install globally: `npm install -g @expo/cli`)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WeGoApp
   ```

2. **Install dependencies (client and server)**
   ```bash
   # Client (Expo app)
   cd client
   npm install

   # Server (Express API)
   cd ../server
   npm install
   ```

3. **Environment setup (server)**
   - Copy `.env.example` to `.env` in `server/` and fill values:
     - `PORT=3000`
     - `DATABASE_URL` or individual `DB_*` fields (optional during early dev)
     - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
     - `GOOGLE_CALLBACK_URL=/auth/google/callback`
     - `JWT_SECRET`
     - `CLIENT_URL_DEV` and `SERVER_URL_DEV` (e.g., `CLIENT_URL_DEV=http://localhost:8085`, `SERVER_URL_DEV=http://localhost:3000/api`)

4. **Start the servers (two terminals)**
   ```bash
   # Terminal 1: API server
   cd server
   npm run dev

   # Terminal 2: Client app
   cd client
   npm run dev
   # For web-only preview
   npx expo start --web
   ```

5. **Run on different platforms**
   - **Web**: Press `w` in Expo dev tools (port may vary, e.g., `http://localhost:8085`)
   - **iOS Simulator**: Press `i` (requires Xcode on macOS)
   - **Android Emulator**: Press `a` (requires Android Studio)
   - **Physical Device**: Scan QR code with Expo Go app

### Alternative Commands
```bash
# Web only
npx expo start --web

# Clear cache if needed
npx expo start --clear

# Production build
npx expo build
```

## 🏗️ Current Architecture

### Frontend Stack
- **React Native** with **Expo** - Cross-platform development
- **Expo Router** - File-based routing system
- **React Native Web** - Web platform support
- **TypeScript** - Type safety and better development experience
- **Lucide React Native** - Modern icon library
- **React Native Reanimated** - Smooth animations

### Design System
- Modern design tokens inspired by contemporary web applications
- Responsive breakpoint system for web, tablet, and mobile
- Comprehensive color palette with semantic naming
- Typography scale and spacing system
- Accessibility-focused components

## ✅ Completed Features

### Frontend Implementation
- [x] **Landing Page** - Modern hero section with university branding
- [x] **Navigation & Layout** - Responsive sidebar navigation for web
- [x] **Dashboard/Home Screen** - Personalized wellness dashboard
- [x] **Daily Check-in System** - Mood, sleep, and stress tracking UI
- [x] **Mental Health Assessments** - PHQ-9 and GAD-7 questionnaires
- [x] **User Profile Management** - Profile editing and settings UI
- [x] **Resources Section** - Campus mental health services directory
- [x] **Modern UI/UX** - Contemporary design with smooth animations
- [x] **Cross-Platform Support** - Web, iOS, and Android compatibility
- [x] **Responsive Design** - Mobile-first approach with desktop optimization

### Recent UI Changes (Login/Signup)
- Removed large profile icon from mobile login and signup pages.
- Removed redundant white branding card from mobile login.
- Signup page UI mirrors the clean login UI (gradient header, form card, spacing).
- Unified email/username into a single `Email Address / Username` field.
- Google button uses clean white-bordered style consistent across login and signup.

## 🚧 What's Missing - Frontend

### Partially Implemented Features
- [ ] **Authentication System**
  - ✅ Login/signup UI components and form validation
  - ✅ Mock authentication flow (setTimeout-based)
  - ✅ Google OAuth flow wired on the server (`/api/auth/google`)
  - ❌ Client-side wiring to consume server JWT cookie and handle post-auth redirects
  - ❌ Session management and JWT handling
  - ❌ Password reset functionality (routes to non-existent screens)
  - ❌ Actual user data persistence

- [ ] **AI Chat Assistant**
  - ✅ Chat interface UI with modern design
  - ❌ AI integration (OpenAI/Claude API)
  - ❌ Conversation context management
  - ❌ Mental health response guidelines

- [ ] **Events System**
  - ✅ Events listing UI
  - ❌ Event management functionality
  - ❌ Calendar integration
  - ❌ Event registration system

- [ ] **Data Persistence**
  - ✅ Local state management
  - ❌ AsyncStorage integration for offline support
  - ❌ Cloud synchronization
  - ❌ Data export functionality

### Missing Frontend Features
- [ ] **Internationalization** - Multi-language support (i18next not installed)
- [ ] **Advanced Animations** - Lottie animation integration (package not installed)
- [ ] **Push Notifications** - Real-time alerts and reminders
- [ ] **Offline Support** - App functionality without internet
- [ ] **Progressive Web App** - PWA capabilities for web
- [ ] **Deep Linking** - Direct navigation to specific screens
- [ ] **Over-the-Air Updates** - Expo OTA update system
- [ ] **AsyncStorage Integration** - Local data persistence

## 🗺️ What Still Needs Integration

- Client-side auth handling:
  - Read `auth-token` cookie after Google or email/password login on web.
  - Implement post-auth redirect on client (e.g., to `/home_screen/home`).
  - Session check using `GET /api/user/me` to hydrate user state.
- Mobile auth:
  - Implement native Google OAuth (Expo AuthSession) and JWT/cookie handling.
  - Replace mobile mock credentials with real API calls.
- Error handling:
  - Map server JSend responses to client UI (success/fail/error).
- Data & features:
  - Replace thread mocks with real endpoints (create/list/reply/like/report).
  - Persist assessments and check-ins to backend; add analytics endpoints.
  - Implement password reset and email verification flows.

## ❌ What's Missing - Backend (Complete Implementation Needed)

### Core Backend Services
- [ ] **Authentication Service**
  - Google OAuth endpoints implemented (`GET /api/auth/google`, `GET /api/auth/google/callback` issuing `auth-token`)
  - Email/password endpoints implemented (`POST /api/signup`, `POST /api/login`)
  - JWT token management and refresh
  - Multi-factor authentication (MFA)
  - Password reset and email verification
  - Session management and security

- [ ] **Database Implementation**
  - User profiles and account data
  - Daily check-in history and analytics
  - Assessment results and scoring
  - Events and campus resources data
  - Privacy and data protection compliance

- [ ] **API Endpoints**
  ```
  Authentication:
  POST /api/auth/register
  POST /api/auth/login
  POST /api/auth/logout
  POST /api/auth/refresh
  
  User Management:
  GET /api/user/profile
  PUT /api/user/profile
  DELETE /api/user/account
  
  Daily Check-ins:
  GET /api/checkins
  POST /api/checkins
  GET /api/checkins/analytics
  
  Assessments:
  GET /api/assessments
  POST /api/assessments/submit
  GET /api/assessments/results
  
  Events:
  GET /api/events
  POST /api/events (admin)
  ```

- [ ] **AI Integration**
  - OpenAI/Claude API integration
  - Conversation context management
  - Mental health safety protocols
  - Crisis detection and escalation
  - Response filtering and guidelines

### Infrastructure Requirements
- [ ] **AWS Free Tier Services** (University-Friendly, Cost-Effective)
  - AWS Lambda for serverless computing (1M free requests/month)
  - Amazon Cognito for user authentication (50,000 MAUs free)
  - Amazon DynamoDB for data storage (25GB free storage)
  - API Gateway for secure endpoints (1M API calls/month free)
  - CloudWatch for monitoring and logging (5GB free)
  - S3 for static assets and file storage (5GB free)
  - **Note**: Replacing previous paid Cloudflare services with AWS free tier

- [ ] **Security & Compliance**
  - HIPAA compliance considerations
  - Data encryption at rest and in transit
  - Privacy policy implementation
  - Audit logging and monitoring
  - Secure data lifecycle management

## 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|---------|
| **Web** | ✅ Fully Supported | Modern responsive design |
| **iOS** | ✅ Ready | Requires Expo build |
| **Android** | ✅ Ready | Requires Expo build |

## 🛠️ Development Status

- **Frontend Development**: ~85% Complete
  - All UI screens functional with navigation
  - Forms have validation but no data persistence
  - Responsive design works across web and mobile
  - Mock authentication flows implemented
- **Backend Development**: Auth backbone present (Google OAuth; email/password signup/login implemented); user profile CRUD partially implemented
- **Data Storage**: Local state only (no AsyncStorage or cloud sync)
- **Testing**: Minimal (needs comprehensive testing suite)
- **Deployment**: Development only (Expo dev server; port may vary, e.g., `http://localhost:8085`)

## 🔧 Environment Variables (Server)

Create `server/.env` based on `server/.env.example`:
- `PORT`: API port (default `3000`)
- `DATABASE_URL` or `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`: typically `/auth/google/callback`
- `JWT_SECRET`: used to sign `auth-token`
- `CLIENT_URL_DEV`, `SERVER_URL_DEV`: e.g., `CLIENT_URL_DEV=http://localhost:8085`, `SERVER_URL_DEV=http://localhost:3000/api`

## 📡 API Endpoints (Server)

Base: `http://localhost:3000/api`
- `GET /auth/google` → Start Google OAuth
- `GET /auth/google/callback` → Issue JWT cookie `auth-token`
- `POST /signup` → Email/password registration
- `POST /login` → Email/password login (issues `auth-token` cookie)
- `GET /user/me` → Get current user (JWT required)
- `PATCH /user/me` → Update current user display name (JWT required)
- `DELETE /user/me` → Soft delete current user (JWT required)
- `GET /user/profile/:username` → Public profile lookup
- `GET /test` → JWT test route

Response format uses a JSend-style wrapper for success/fail/error.

## 🔌 Client Integrations

- OAuth: Web login/signup buttons redirect to `/api/auth/google`.
- Email/password: UI present; hook up to server via `client/services/api.js` using `POST /api/signup` and `POST /api/login`.
- Threads: `client/services/threads.js` uses local mocks (no network calls yet).
- Base API URL: `client/services/api.js` points to `http://localhost:3000`; adjust to proxy or environment if needed.

## 📋 Next Steps & Implementation Priority

### Frontend Next Steps (Immediate - Weeks 1-2)
1. **Complete Authentication Integration**
   - Replace mock authentication with real backend calls
   - Implement proper session management and token storage
   - Add password reset functionality with actual navigation

2. **Data Persistence & Storage**
   - Install and configure AsyncStorage for local data
   - Implement offline data caching for assessments
   - Add data synchronization when online

3. **Missing Package Integration**
   - Install and configure i18next for internationalization
   - Add Lottie React Native for advanced animations
   - Implement push notification setup (Expo Notifications)

4. **Enhanced User Experience**
   - Add loading states and error handling throughout app
   - Implement deep linking for direct screen navigation
   - Add Progressive Web App (PWA) capabilities
   - Configure Expo OTA updates for seamless deployments

### Backend Infrastructure (Weeks 3-6) - Free AWS Services Focus
1. **AWS Free Tier Setup** (University-Friendly)
   - AWS Lambda (1M free requests/month)
   - Amazon Cognito (50,000 MAUs free)
   - Amazon DynamoDB (25GB free storage)
   - API Gateway (1M API calls/month free)
   - CloudWatch Logs (5GB free)
   - S3 (5GB free storage for static assets)

2. **Authentication System**
   - Implement AWS Cognito user pools (replacing paid Cloudflare)
   - Set up MFA with SMS/TOTP (within free limits)
   - Configure JWT token management
   - Add password reset and email verification

3. **Core API Development**
   - Create serverless Lambda functions for all endpoints
   - Implement DynamoDB data models and queries
   - Set up API Gateway with proper CORS and security

### Data & AI Integration (Weeks 7-10)
1. **Database Implementation**
   - Design DynamoDB tables for user data, assessments, events
   - Implement data access patterns and indexing
   - Add data backup and recovery procedures

2. **AI Chatbot Restoration**
   - Integrate OpenAI API (pay-per-use, cost-effective)
   - Implement conversation context management
   - Add mental health safety protocols and crisis detection
   - Create response filtering and content guidelines

3. **Frontend-Backend Connection**
   - Connect all frontend forms to backend APIs
   - Implement real-time data synchronization
   - Add proper error handling and retry logic

### Testing & Deployment (Weeks 11-14)
1. **Comprehensive Testing**
   - Unit tests for all components and functions
   - Integration tests for API endpoints
   - End-to-end testing across platforms
   - Load testing within AWS free tier limits

2. **Production Deployment**
   - Set up staging and production environments
   - Configure monitoring and alerting (CloudWatch free tier)
   - Implement CI/CD pipeline
   - Prepare for app store submissions (iOS/Android)

### Cost Management & Monitoring
- **AWS Free Tier Monitoring**: Set up billing alerts to stay within free limits
- **Usage Optimization**: Implement efficient data queries and caching
- **Scalability Planning**: Design for growth while maintaining cost-effectiveness

## 🤝 Contributing

This project is designed for California State University, Los Angeles students' mental health and wellness. Contributions should focus on:
- Accessibility and inclusive design
- Mental health best practices
- Cross-platform compatibility
- Privacy and security considerations

## 📄 License

[Add appropriate license information]

## 📞 Support

For technical support or questions about the platform, please contact the development team or refer to the campus mental health resources integrated within the application.

---

**Note**: This application is currently in active development. The frontend is largely complete with modern UI/UX, but backend services require full implementation before production deployment.
## 🔐 Authentication (Current Behavior)

- **Web Google Sign-in**: Client redirects to `GET /api/auth/google`; server handles `GET /api/auth/google/callback`, issues `auth-token` cookie, then redirects to `/api/auth`.
- **Mobile Google Sign-in**: Not active in the development build; shows an informational alert.
- **Email/Password (web & mobile)**: UI present; backend exposes `POST /api/signup` and `POST /api/login` (client wiring pending).
- **Mock Credentials (mobile app login)**: Only this pair works on iOS/Android during dev:
  - Email: `student@csla.edu`
  - Password: `GoldenEagles123!`
- **Signup Email Field**: Combined into a single `Email Address / Username` field to reduce friction.

Environment variables for auth are defined in `server/.env.example`.