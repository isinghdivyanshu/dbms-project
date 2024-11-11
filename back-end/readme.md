<p align="center">
<a href="https://dscvit.com">
	<img width="400" src="https://user-images.githubusercontent.com/56252312/159312411-58410727-3933-4224-b43e-4e9b627838a3.png#gh-light-mode-only" alt="GDSC VIT"/>
</a>
	<h2 align="center">  FolksFlow - Backend  </h2>
	<h4 align="center">  Backend for check-in <h4>
</p>

---



# Project Setup Instructions

## Clone the Repository

```bash
git clone https://github.com/yourusername/folksflow-backend.git
cd folksflow-backend
```

# FolksFlow Backend

This is the backend for the FolksFlow application. It is built using Node.js, Express, and Prisma ORM.

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

```env
DATABASE_URL="CONNECTION_URL"
PORT=port_number
SALT_ROUNDS=10
JWT_SECRET_KEY="Your_Secret_Key"
```

## Install Dependencies

```bash
npm install
```

## Set Up Environment Variables

Set up the environment variables as mentioned above.

## Prisma Setup

1. **Initialize Prisma:**

   ```bash
   npx prisma init
   ```

2. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

3. **Apply Migrations to Create Tables in the Database:**

   ```bash
   npx prisma migrate dev --name init
   ```

3. **Prisma Studio:**

   ```bash
   npx prisma studio
   ```


## Running the Application

1. **Start the Development Server:**

   ```bash
   npm run dev
   ```

2. **Build the Project:**

   ```bash
   npm run build
   ```

3. **Start the Production Server:**

   ```bash
   npm start
   ```

## Hosting on Render

1. **Create a New Web Service on Render and Connect Your GitHub Repository.**

2. **Set the Build Command:**

   ```bash
   npm install
   ```

3. **Set the Start Command:**

   ```bash
   npm run build && node dist/index.js
   ```

4. **Add the Environment Variables in the Render Dashboard as Mentioned Above.**

5. **Deploy the Service.**

## Additional Commands

- **To Check TypeScript Types:**

  ```bash
  npm run ts:check
  ```

- **To Run the Pre-Commit Hooks:**

  ```bash
  npm run pre-commit
  ```

---

For more information, refer to:

[How can I configure the database connection in my Prisma schema file?](https://www.prisma.io/docs/concepts/components/prisma-schema/database-connection)
