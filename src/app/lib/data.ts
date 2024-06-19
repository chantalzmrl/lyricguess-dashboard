'use server';

import { sql } from '@vercel/postgres';
import {
  Score,
  User,
  Chansons,
  Parametres,
  Dates
} from './definitions';

import { unstable_noStore as noStore } from 'next/cache';

export async function InsertDataChansons(Titre: any, artiste: any, paroles: any) {

  if (Titre.length !== artiste.length || artiste.length !== paroles.length) {
    throw new Error('All input arrays must have the same length.');
  }

  try {
    const insertPromises = Titre.map((titre: any, index: any) => {
      const artist = artiste[index];
      const lyric = paroles[index];

      return sql<Chansons>`
        INSERT INTO Chansons (titre, artiste, paroles)
        VALUES (${titre}, ${artist}, ${lyric})
        RETURNING id_chanson;
      `;
    });

    const results = await Promise.all(insertPromises);
    const insertedIds = results.map(result => result.rows[0].id_chanson);
    return insertedIds;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert data into the database.');
  }
}

export async function InsertDataDates() {
  try {
    const date = new Date().toISOString(); // Convertir en format ISO
    const result = await sql<Dates>`
        INSERT INTO Dates (timer)
        VALUES (${date})
        RETURNING timer;
      `;

    const insertedTimer = result.rows[0].timer;
    return insertedTimer;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert data into the database.');
  }
}

export async function InsertDataParams(time: number, manches: number) {
  try {
    const result = await sql<Parametres>`
      INSERT INTO Parametres (temps, nbchanson)
      VALUES (${time}, ${manches})
      RETURNING id_params;
    `;

    const insertedId = result.rows[0].id_params;
    return insertedId;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert data into the database.');
  }
}

export async function InsertDatas(Titre: any[], artiste: any[], paroles: any[], time: number, manches: number, score: number) {
  try {
    // Insert music data and parameters asynchronously
    const idMusics = await InsertDataChansons(Titre, artiste, paroles);
    const idParams = await InsertDataParams(time, manches);
    const timer = await InsertDataDates();

    if (idMusics && idParams) {
      const insertPromises = idMusics.map((idMusic: any) => {
        return sql<Score>`
          INSERT INTO Score (ID_user, ID_chanson, timer, ID_params, number)
          VALUES (1, ${idMusic}, ${timer}, ${idParams}, ${score});
          `;
      });

      // Wait for all insert promises to complete
      const results = await Promise.all(insertPromises);
      console.log('Inserted into Score:', results.length, 'records');
    } else {
      throw new Error('Failed to get IDs from InsertDataChansons or InsertDataParams');
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert data into the database.');
  }
}


export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchBestScores() {
  noStore();
  try {
    const data = await sql<Score>
      `SELECT number
      FROM Score
      ORDER BY number DESC
      LIMIT 3`;

    const bestScores = data.rows.map((score) => ({
      ...score
    }));
    return bestScores;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the best scores.');
  }
}

export async function theBestScore(currentScore: number) {
  noStore();
  try {
    const data = await sql<Score>
      `SELECT number
      FROM Score
      ORDER BY number DESC
      LIMIT 1`;

    const bestScore = data.rows[0].number;
    console.log("bestScore : ", bestScore );
    console.log("currentScore : ", currentScore );
    if (bestScore < currentScore) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the best scores.');
  }
}
export async function fetchScores() {
  noStore();
  try {
    const data = await sql<Score>`
      SELECT Score.number,
      Score.timer, 
      Score.ID_user, 
      Score.ID_params,
      array_agg(DISTINCT Score.id_chanson) AS id_chansons,
      array_agg(DISTINCT chansons.titre) AS titres
      FROM Score
      JOIN Chansons ON Score.id_chanson = chansons.id_chanson
      GROUP BY Score.id_user, Score.timer, Score.id_params, Score.number
      ORDER BY timer DESC
      `;

    const Scores = data.rows.map((score) => ({
      ...score,
      titres: score.titres || []
    }));

    return Scores;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the best quiz.tsx.');
  }
}
