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

### Sign Up

- Method: **POST**
- URL: {{URL}}/api/auth/signup
- Data:
```bash
{
    "fullName": "Low Doe",
    "username": "lowdoe",
    "gender": "male",
    "password": "123456",
    "confirmPassword": "123456"
}
```
- Requires Auth: **NO**
- Description: This endpoint enables users to register by sending a POST request containing their chosen fullName, username, gender, password, and confirmPassword.

### Log In

- Method: **POST**
- URL: {{URL}}/api/auth/login
- Data:
```bash
{
    "username": "lowdoe",
    "password": "123456"
}
```
- Requires Auth: **NO**
- Description: This endpoint enables users authenticate by sending a POST request with their username and password; upon successful authentication, an access token is stored in cookies.

### Log Out

- Method: **POST**
- URL: {{URL}}/api/auth/logout
- Requires Auth: **YES**
- Description: This endpoint enables authenticated users to log out; upon successful log out, an access token is deleted from cookies.

### Get Current User Profile

- Method: **GET**
- URL: {{URL}}/api/auth/me
- Requires Auth: **YES**
- Description: This endpoint retrieves the profile information of the currently authenticated user. 


###  _Messages_

### Send Message

- Method: **POST**
- URL: {{URL}}/api/messages/send/:id
- Data:
```bash
{
    "message": "Hello there! This is my first message from Low Doe"
}
```
- Requires Auth: **YES**
- Description: This endpoint allows authenticated users to send a message to another user with filled following field: message. The id of receiver is located in URL.

### Get All Messages Sent By User To Another Specific User

- Method: **GET**
- URL: {{URL}}/api/messages/:id
- Requires Auth: **YES**
- Description: This endpoint allows user to see all messages that were sent by her/him to another specific user.

### Get All Users For Conversation Sidebar

- Method: **GET**
- URL: {{URL}}/api/messages/conversations
- Requires Auth: **YES**
- Description: This endpoint allows user to get a list of users with whom he/she can correspond.

