# 🎓 College Management System - Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646cff?style=for-the-badge&logo=vite)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11-764abc?style=for-the-badge&logo=redux)
![GraphQL](https://img.shields.io/badge/GraphQL-16.12-e10098?style=for-the-badge&logo=graphql)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)

A modern, scalable frontend application for college management built with React, TypeScript, and cutting-edge web technologies.

[Live Demo](https://poneaswaran.github.io/College-Management-System-Frontend/) • [Report Bug](https://github.com/Poneaswaran/College-Management-System-Frontend/issues) • [Request Feature](https://github.com/Poneaswaran/College-Management-System-Frontend/issues)

</div>

---

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 👨‍🎓 **Student Management** - Comprehensive student information and attendance tracking
- 📊 **Real-time Attendance** - Mark attendance with webcam capture and geolocation
- 📈 **Dashboard Analytics** - Visual insights into student performance and attendance
- 🎨 **Modern UI/UX** - Beautiful, responsive design with dark mode support
- ⚡ **Optimized Performance** - Code splitting, lazy loading, and optimized bundles
- 🌐 **GraphQL Integration** - Efficient data fetching with Apollo Client
- 🔄 **State Management** - Redux Toolkit for predictable state management

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Poneaswaran/College-Management-System-Frontend.git

# Navigate to project directory
cd College-Management-System-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 📦 Tech Stack

### Core
- **React 19.2** - UI library with latest features
- **TypeScript 5.9** - Type-safe JavaScript
- **Vite 7.2** - Next-generation frontend tooling

### State & Data
- **Redux Toolkit 2.11** - State management
- **Apollo Client 4.1** - GraphQL client
- **React Router 7.13** - Client-side routing

### UI & Styling
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Webcam** - Webcam integration

### Development
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript linting
- **SWC** - Super-fast compilation

---

## 📁 Project Structure

```
src/
│
├── app/                # App-level setup
│   ├── App.tsx
│   ├── main.tsx
│   ├── router.tsx      # React Router config with lazy loading
│   └── providers.tsx   # Context providers (Redux, Apollo, Theme)
│
├── pages/              # Route-level pages
│   ├── auth/           # Authentication pages
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── dashboard/      # Dashboard views
│   │   └── Dashboard.tsx
│   ├── student/        # Student-specific pages
│   │   ├── StudentDashboard.tsx
│   │   ├── StudentAttendance.tsx
│   │   ├── MarkAttendance.tsx
│   │   └── AttendanceHistory.tsx
│   └── not-found/
│       └── NotFound.tsx
│
├── components/         # Reusable UI components
│   ├── ui/             # Base UI components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── layout/         # Layout components
│       ├── Navbar.tsx
│       └── Sidebar.tsx
│
├── features/           # Feature-based modules
│   ├── auth/           # Authentication feature
│   │   ├── api.ts      # API calls
│   │   ├── hooks.ts    # Custom hooks
│   │   ├── types.ts    # TypeScript types
│   │   └── slice.ts    # Redux slice
│   └── students/       # Student management feature
│       ├── api.ts
│       ├── hooks.ts
│       ├── types.ts
│       ├── components/
│       └── graphql/
│
├── services/           # External services
│   ├── api.ts          # Axios instance
│   └── auth.service.ts # Auth service
│
├── hooks/              # Global custom hooks
│   └── useDebounce.ts
│
├── store/              # Redux store configuration
│   ├── index.ts
│   └── auth.store.ts
│
├── lib/                # Utilities & helpers
│   ├── axios.ts
│   ├── graphql.ts
│   ├── constants.ts
│   └── helpers.ts
│
├── types/              # Global TypeScript types
│   └── index.d.ts
│
├── assets/             # Static assets
│
├── styles/             # Global styles
│   └── index.css
│
└── theme.tsx           # Theme configuration
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production (includes linting)
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

---

## 🚢 Deployment

The project is automatically deployed to GitHub Pages using GitHub Actions.

### Deployment Configuration

- **Base Path**: `/College-Management-System-Frontend/`
- **Routing**: Hash-based routing for GitHub Pages compatibility
- **Build Optimization**: Code splitting with manual chunking strategy
- **CI/CD**: Automated deployment on push to `main` branch

### Manual Deployment

```bash
# Build the project
npm run build

# The dist/ folder contains production-ready files
```

---

## ⚡ Performance Optimizations

### Code Splitting
- ✅ Lazy loading for all route components
- ✅ Manual chunking for vendor libraries
- ✅ Separate bundles for features (auth, student, dashboard)

### Bundle Sizes (Gzipped)
- React vendor: 64.58 kB
- Apollo vendor: 52.74 kB
- Auth feature: 44.22 kB
- Student feature: 6.20 kB
- Individual routes: <1 kB each

### Build Optimizations
- SWC for fast compilation
- Tree shaking for unused code elimination
- CSS minification with PostCSS
- Asset optimization

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_GRAPHQL_URL=your_graphql_url
```

### Vite Configuration

The project uses optimized Vite configuration with:
- Manual chunk splitting
- Hash-based routing for static hosting
- SWC plugin for fast refresh
- Custom build optimizations

---

## 🎨 Theme Customization

The application supports extensive theme customization through `src/theme.tsx`:

- Brand colors (primary, secondary, accent)
- UI colors (background, foreground, borders)
- Status colors (success, warning, error, info)
- Typography settings
- Spacing and layout
- Dark mode support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Poneaswaran** - [GitHub](https://github.com/Poneaswaran)

---

## 🙏 Acknowledgments

- React Team for the amazing library
- Vite team for the blazing-fast build tool
- All open-source contributors

---

<div align="center">

[⬆ Back to Top](#-college-management-system---frontend)

</div>
