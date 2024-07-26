# Crypto Wallet Management

This project is a web application for managing cryptocurrency wallets and transactions using Next.js, Sequelize, and PostgreSQL. It includes user authentication, wallet management, and transaction tracking.

## Features

- User authentication with JWT
- Wallet management
- Transaction tracking
- API for handling transactions and user data
- Pagination for transaction lists

## Technologies Used

- Next.js
- React
- Sequelize
- PostgreSQL
- NextAuth.js
- Lodash (debounce)
- CSS for styling

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Tayochess/stratech.git
    cd crypto-wallet-management
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following:

    ```plaintext
    DATABASE_URL=postgres://username:password@localhost:5432/database_name
    JWT_SECRET=your_jwt_secret
    DB_USER=your_db_username
    DB_NAME=your_db_name
    DB_PASS=your_db_password
    DB_HOST=your_db_host
    ```

4. Run migrations to create the database schema:

    ```bash
    npx sequelize-cli db:migrate
    ```

### Running the Application

1. Start the development server:

    ```bash
    npm run dev
    ```

    The application will be available at [http://localhost:3000](http://localhost:3000).

### Usage

- **Login:** Users can log in using their email and password.
- **Register:** New users can register with their email and password.
- **Dashboard:** Users can view their wallets and manage transactions.
- **Wallet Management:** Users can add new wallets, view their balance, and manage transactions.
- **Transactions:** Users can view their transactions, add funds to their wallets, and transfer funds to other users.

### API Endpoints

- **Authentication:** `/api/auth/[...nextauth]`
- **Transaction commit:** `/api/commit-transactions`
- **Transactions list:** `/api/get-transactions`
- **Wallets:** `/api/wallets`
- **Users search:** `/api/search-users`