# EduPair - Peer-to-Peer Skill Swap Platform

EduPair is a peer-to-peer skill swap learning network where students can teach what they know and learn what they don't through a credit-based system.

## Features

- **User Authentication**: Register and login to access the platform
- **Skills Management**: Add skills you can teach to others
- **Session Management**: Create teaching sessions and earn credits
- **Learning**: Spend credits to learn from others
- **Reviews**: Rate your learning experience

## Getting Started

To run the application:

```bash
# Run with our prepared start script
node start.js
```

This will start both the backend API server and the React frontend.

## How to Use EduPair

1. When the application starts, you'll see the authentication page at `/auth`
2. **Register** for an account by creating a username and password
3. Once logged in, you'll see your dashboard with skills and sessions
4. **Add Skills** you're willing to teach by clicking "Add Skill"
5. **Create Teaching Sessions** to earn credits by clicking "Create Session" 
6. **Browse Sessions** created by other users to learn new skills
7. **Book Sessions** to learn by spending your credits
8. **Complete Sessions** and leave reviews for teachers

## Technology Stack

- React frontend with TailwindCSS and shadcn components
- Express backend with authentication
- PostgreSQL database for data persistence
- Drizzle ORM for type-safe database operations