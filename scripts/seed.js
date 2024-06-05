const { db } = require('@vercel/postgres');
const {
  score,
  users,
  songs,  // Assurez-vous d'ajouter les données placeholder pour les chansons
  params, // Assurez-vous d'ajouter les données placeholder pour les paramètres
  dates   // Assurez-vous d'ajouter les données placeholder pour les dates
} = require('../src/app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    // Create the "User" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS User (
        ID_user SERIAL PRIMARY KEY,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(50) NOT NULL,
        pseudo VARCHAR(50) NOT NULL
      );
    `;

    console.log(`Created "User" table`);

    // Insert data into the "User" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
          INSERT INTO User (email, password, pseudo)
          VALUES (${user.email}, ${hashedPassword}, ${user.pseudo})
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

async function seedSongs(client) {
  try {
    // Create the "Chansons" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS Chansons (
        ID_chanson SERIAL PRIMARY KEY,
        paroles TEXT NOT NULL,
        artiste VARCHAR(50) NOT NULL,
        titre VARCHAR(50) NOT NULL
      );
    `;

    console.log(`Created "Chansons" table`);

    // Insert data into the "Chansons" table
    const insertedSongs = await Promise.all(
      songs.map(async (song) => {
        return client.sql`
          INSERT INTO Chansons (paroles, artiste, titre)
          VALUES (${song.paroles}, ${song.artiste}, ${song.titre})
          ON CONFLICT (titre) DO NOTHING;
        `;
      })
    );

    console.log(`Seeded ${insertedSongs.length} songs`);

    return {
      createTable,
      songs: insertedSongs,
    };
  } catch (error) {
    console.error('Error seeding songs:', error);
    throw error;
  }
}

async function seedParams(client) {
  try {
    // Create the "Parametres" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS Parametres (
        ID_params SERIAL PRIMARY KEY,
        temps INT NOT NULL,
        nbChanson INT NOT NULL
      );
    `;

    console.log(`Created "Parametres" table`);

    // Insert data into the "Parametres" table
    const insertedParams = await Promise.all(
      params.map(async (param) => {
        return client.sql`
          INSERT INTO Parametres (temps, nbChanson)
          VALUES (${param.temps}, ${param.nbChanson})
          ON CONFLICT (ID_params) DO NOTHING;
        `;
      })
    );

    console.log(`Seeded ${insertedParams.length} params`);

    return {
      createTable,
      params: insertedParams,
    };
  } catch (error) {
    console.error('Error seeding params:', error);
    throw error;
  }
}

async function seedDates(client) {
  try {
    // Create the "Dates" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS Dates (
        timer TIMESTAMP PRIMARY KEY
      );
    `;

    console.log(`Created "Dates" table`);

    // Insert data into the "Dates" table
    const insertedDates = await Promise.all(
      dates.map(async (date) => {
        return client.sql`
          INSERT INTO Dates (timer)
          VALUES (${date.timer})
          ON CONFLICT (timer) DO NOTHING;
        `;
      })
    );

    console.log(`Seeded ${insertedDates.length} dates`);

    return {
      createTable,
      dates: insertedDates,
    };
  } catch (error) {
    console.error('Error seeding dates:', error);
    throw error;
  }
}

async function seedScores(client) {
  try {
    // Create the "Score" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS Score (
        ID_user INT,
        ID_chanson INT,
        timer TIMESTAMP,
        ID_params INT,
        number INT,
        PRIMARY KEY(ID_user, ID_chanson, timer, ID_params),
        FOREIGN KEY(ID_user) REFERENCES User(ID_user),
        FOREIGN KEY(ID_chanson) REFERENCES Chansons(ID_chanson),
        FOREIGN KEY(timer) REFERENCES Dates(timer),
        FOREIGN KEY(ID_params) REFERENCES Parametres(ID_params)
      );
    `;

    console.log(`Created "Score" table`);

    // Insert data into the "Score" table
    const insertedScores = await Promise.all(
      score.map(async (sc) => {
        return client.sql`
          INSERT INTO Score (ID_user, ID_chanson, timer, ID_params, number)
          VALUES (${sc.ID_user}, ${sc.ID_chanson}, ${sc.timer}, ${sc.ID_params}, ${sc.number})
          ON CONFLICT DO NOTHING;
        `;
      })
    );

    console.log(`Seeded ${insertedScores.length} scores`);

    return {
      createTable,
      scores: insertedScores,
    };
  } catch (error) {
    console.error('Error seeding scores:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedSongs(client);
  await seedParams(client);
  await seedDates(client);
  await seedScores(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});