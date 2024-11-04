import * as SQLite from 'expo-sqlite';

// Abre ou cria o banco de dados
const db = SQLite.openDatabaseAsync('webmarker.db');

// Inicializa o banco de dados e cria a tabela
export const init = async (): Promise<void> => {
  const database = await db; // Aguarda a abertura do banco de dados

  return new Promise((resolve, reject) => {
    database.execAsync(`
      CREATE TABLE IF NOT EXISTS webmarker (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        chaptersRead INTEGER NOT NULL,
        status TEXT NOT NULL,
        releaseDay TEXT NOT NULL,
        link TEXT NOT NULL
      );
    `).then(() => resolve())
      .catch(error => reject(error));
  });
};

// Função para inserir uma leitura
export const insertReading = async (reading: { title: string; chaptersRead: number; status: string; releaseDay: string; link: string; }) => {
  const database = await db; // Aguarda a abertura do banco de dados
  return new Promise((resolve, reject) => {
    database.runAsync(
      `INSERT INTO webmarker (title, chaptersRead, status, releaseDay, link) VALUES (?, ?, ?, ?, ?)`,
      [reading.title, reading.chaptersRead, reading.status, reading.releaseDay, reading.link]
    )
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

// Função para buscar leituras
export const fetchReadings = async () => {
  const database = await db; // Aguarda a abertura do banco de dados
  return new Promise<{ id: number; title: string; chaptersRead: number; status: string; releaseDay: string; link: string; }[]>((resolve, reject) => {
    database.getAllAsync(`SELECT * FROM webmarker;`)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

// Função para atualizar uma leitura
export const updateReading = async (id: number, updatedReading: { title: string; chaptersRead: number; status: string; releaseDay: string; link: string; }) => {
  const database = await db; // Aguarda a abertura do banco de dados
  return new Promise((resolve, reject) => {
    database.runAsync(
      `UPDATE webmarker SET title = ?, chaptersRead = ?, status = ?, releaseDay = ?, link = ? WHERE id = ?`,
      [updatedReading.title, updatedReading.chaptersRead, updatedReading.status, updatedReading.releaseDay, updatedReading.link, id]
    )
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

// Função para excluir uma leitura
export const deleteReading = async (id: number) => {
  const database = await db; // Aguarda a abertura do banco de dados
  return new Promise((resolve, reject) => {
    database.runAsync(`DELETE FROM webmarker WHERE id = ?`, [id])
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

// Função para adicionar +1 na quantidade de capítulos lidos
export const incrementChaptersRead = async (id: number) => {
  const database = await db; // Aguarda a abertura do banco de dados
  return new Promise((resolve, reject) => {
    database.runAsync(`UPDATE webmarker SET chaptersRead = chaptersRead + 1 WHERE id = ?`, [id])
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};
