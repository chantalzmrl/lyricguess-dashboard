const { db } = require('@vercel/postgres');
const {
  score,
  users,
} = require('../src/app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
          INSERT INTO users (id, name, email, password)
          VALUES (uuid_generate_v4(), ${user.name}, ${user.email}, ${hashedPassword})
          ON CONFLICT (email) DO NOTHING;
        `;
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedScore(client) {
  try {
    // Create the "score" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS score (
        id SERIAL PRIMARY KEY,
        number INT NOT NULL,
        date TIMESTAMP NOT NULL,
        user_id UUID,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

    console.log(`Created "score" table`);

    return {
      createTable
    };
  } catch (error) {
    console.error('Error seeding scores:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedScore(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
