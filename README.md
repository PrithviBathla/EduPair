# EduPair - Peer-to-Peer Skill Swap Platform

EduPair is a peer-to-peer skill swap learning network where students can teach what they know and learn what they don't through a credit-based system. The platform operates on a credit economy: teach to earn credits, then spend those credits to learn from others.

![EduPair Platform](https://i.imgur.com/placeholder.png)

## 🌟 Features

- **Credit-Based System**: Earn credits by teaching, spend them to learn
- **Skill Marketplace**: Browse available skills and teachers
- **User Authentication**: Secure registration and login system
- **Skills Management**: Add and manage skills you can teach
- **Session Scheduling**: Create and manage teaching sessions
- **Booking System**: Book sessions with teachers using credits
- **Reviews & Ratings**: Rate your learning experience

## 🚀 Live Demo

Check out the live demo: Coming Soon

## 🔧 Technology Stack

- **Frontend**: React with Wouter for routing
- **UI Components**: TailwindCSS with shadcn/ui component library
- **Backend**: Express.js REST API
- **Database**: PostgreSQL for data persistence
- **ORM**: Drizzle ORM with Zod for type validation
- **Authentication**: Passport.js with session-based auth
- **State Management**: TanStack Query for data fetching/caching

## 📋 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/edupair.git
   cd edupair
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create a .env file with the following variables
   SESSION_SECRET=your_session_secret
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

4. Run the application:
   ```bash
   node start.js
   ```

## 🧠 How EduPair Works

1. **Register** and create your profile
2. **Add Skills** you're willing to teach to others
3. **Create Teaching Sessions** to earn credits
4. **Browse Available Sessions** from other teachers
5. **Book Sessions** using your earned credits
6. **Attend Sessions** and learn new skills
7. **Leave Reviews** to help the community

## 📚 Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express API
- `/shared` - Shared types and schemas
- `/drizzle` - Database migrations and schema

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Express](https://expressjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
