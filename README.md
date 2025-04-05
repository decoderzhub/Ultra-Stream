# Ultra Stream Web Application

This is the web version of the Ultra Stream application, converted from React Native to React for web deployment.

## Features

- Account creation and authentication with MFA
- User profiles management
- Video streaming functionality
- VPN connection for secure streaming
- Responsive design for all devices

## Technologies Used

- React
- Firebase (Authentication, Firestore, Storage)
- React Router
- CSS3 with responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```
git clone https://github.com/decoderzhub/Ultra-Stream.git
cd Ultra-Stream
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

## Deployment

This application is configured for deployment to Netlify. The `netlify.toml` file contains the necessary configuration.

## Project Structure

- `/public` - Static assets
- `/src` - Source code
  - `/components` - Reusable UI components
  - `/screens` - Application screens
  - `/services` - Firebase and other service integrations
  - `/hooks` - Custom React hooks
  - `/config` - Configuration files
  - `/styles` - Global styles and responsive design system
  - `/navigation` - Routing configuration

## Testing

Run the test script to verify the application:
```
./run-tests.sh
```

## License

This project is proprietary and confidential.

## Contact

For any inquiries, please contact the repository owner.