# URL Shortener Frontend

A modern, responsive URL shortening application built with Angular 20, featuring Material Design components, real-time updates, and role-based access control.

## Features

### Core Functionality
- **URL Shortening**: Create short URLs with auto-generated secure codes
- **URL Management**: View, create, and delete short URLs with role-based permissions
- **URL Details**: View comprehensive information about each shortened URL
- **Real-time Updates**: Automatic table updates after creating or deleting URLs

### User System
- **User Registration**: Create new user accounts with email and password validation
- **User Authentication**: JWT-based login system with secure token management
- **User Profile**: Display current user information in the navigation bar
- **Role-Based Access**: Admin and User roles with different permission levels
  - **Admin**: Can delete any URL and edit About information
  - **User**: Can only delete their own URLs
  - **Anonymous**: Can only view the URL table

### Content Management
- **About Information**: Display URL shortening algorithm descriptions
- **Admin Controls**: Administrators can edit About information
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### UI/UX Features
- **Material Design**: Modern, clean interface using Angular Material
- **Glassmorphism**: Beautiful glass-like effects and gradients
- **Responsive Navigation**: Adaptive navigation bar with user menu
- **Error Handling**: Comprehensive error messages and user feedback
- **Loading States**: Smooth loading indicators and skeleton screens

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (install globally with `npm install -g @angular/cli`)
- **Git** (for cloning the repository)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd UrlShortener.Client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Verify installation
```bash
ng version
```

## Running the Application

### Backend Requirements

This frontend requires the URL Shortener backend API to be running on `https://localhost:7001`. Ensure the backend is properly configured and running before using this frontend application.

### Launching Frontend

1. **Start the development server**
   ```bash
   ng serve
   ```

2. **Open your browser**
   Navigate to `http://localhost:4200/`

3. **Application will automatically reload**
   When you modify any source files

### Browser Support

- **Chrome** (recommended)
- **Firefox**
- **Safari**
- **Edge**

## Key Components

### Authentication
- **Login/Register**: User authentication forms with validation
- **JWT Interceptor**: Automatically adds authentication tokens to requests
- **Error Interceptor**: Handles HTTP errors and displays user-friendly messages
- **Route Guards**: Protects routes based on authentication status

### URL Management
- **URLs Table**: Displays all URLs with filtering and sorting
- **Add URL Form**: Create new short URLs with validation
- **URL Details**: Comprehensive view of individual URLs
- **Delete Functionality**: Role-based URL deletion

### Navigation
- **Responsive Navbar**: Adaptive navigation with user menu
- **Role-based Links**: Different navigation options for different user types
- **Active Route Highlighting**: Visual feedback for current page

## Troubleshooting - Common Issues

- **Backend API Not Available**
  - Ensure the backend is running at `https://localhost:7001` before starting the frontend.
  - Check that the backend is listening on HTTPS and the correct port.

- **CORS Errors**
  - Make sure CORS is enabled on the backend for `http://localhost:4200`.
  - If using a self-signed certificate, your browser may require you to accept the certificate manually.

- **HTTPS Required**
  - The frontend expects the backend to be available via HTTPS. If you see mixed content errors, ensure both frontend and backend use HTTPS.

- **Login/Authentication Issues**
  - Make sure your backend JWT configuration matches the frontend expectations.
  - Clear browser cookies and local/session storage if you encounter persistent login issues.

- **API 404/500 Errors**
  - Double-check that the backend API endpoints match those expected by the frontend.
  - Review backend logs for more details.

- **UI Not Updating After Changes**
  - Try a hard refresh (Ctrl+F5) or clear browser cache.
  - Ensure you are running the latest version of both frontend and backend.

## License

This project is licensed under the terms specified in the LICENSE.txt file.