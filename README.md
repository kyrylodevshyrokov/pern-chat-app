# Chat API

## About 

The API is designed for user authentication, allowing logged-in users to send messages to other users and view messages sent to them.

## Features

- User Authentication: Users can register, log in, and log out, as well as view their profile information.
- Messaging: Logged-in users can send messages to other users.
- View Messages: Logged-in users can view messages sent to them.
- Conversation List: Users can view a list of other users they are having conversations with.

## Technologies

- **TypeScript:** A strongly typed programming language that builds on JavaScript, providing better tooling and error-checking capabilities.
- **Express:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **PostgreSQL:** A powerful, open-source object-relational database system with a strong reputation for reliability, feature robustness, and performance.
- **Prisma ORM:** A next-generation ORM that makes working with databases easy by providing a type-safe API for database queries.
- **NeonDB:** A serverless PostgreSQL database designed for modern cloud applications, offering on-demand scalability and seamless integration.
- **bcryptjs:** A library to help hash passwords, ensuring secure storage and authentication of user credentials.
- **jsonwebtoken:** A library to generate and verify JSON Web Tokens (JWTs), used for securely transmitting information between parties as a JSON object.

## Getting Started

1. Clone the repository to your local machine.

```sh
git clone https://github.com/kyrylodevshyrokov/posgresql-prisma-chat-api.git
cd posgresql-prisma-chat-api
```

3. Install dependencies using

```javascript
npm install
```

3. Create a `.env` file in the root of the project and fill it with the following example:

```javascript
DATABASE_URL=your_neon_db_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Sync the API Prisma schema with the serverless Postgres database:

```javascript
npx prisma db push
```

5. Start the server:

```javascript
npm start
```

## API Endpoints

Here are the routes that can be used for routing in the app.

### _Auth And Users_

###  _Messages_
