import { Client } from "mysql";
import { Task } from "./Task.ts";
import "@std/dotenv";

export const createDBClient = async (): Promise<Client> => {
  const client = new Client();
  await client.connect({
    hostname: Deno.env.get("DB_HOST"),
    username: Deno.env.get("DB_USER"),
    db: Deno.env.get("DB_NAME"),
    password: Deno.env.get("DB_PASSWORD"),
    poolSize: 3,
  });

  return client;
};

export const createTask = async (client: Client, task: Task) => {
  const result = await client.execute(
    `INSERT INTO task (title, description, status, priority, id_user) VALUES (?, ?, ?, ?, ?);`,
    [
      task.title,
      task.description,
      task.status,
      task.priority,
      task.id_user,
    ],
  );

  return result;
};

export const getTaskById = async (client: Client, id: number) => {
  const task = await client.execute(`SELECT * FROM task WHERE id = ${id}`);

  return task.rows;
};

export const getTasks = async (client: Client) => {
  const tasks = await client.execute(`SELECT * FROM task`);

  return tasks.rows as Task[];
};

export const updateTask = async (client: Client, id: number, task: Task) => {
  const result = await client.execute(
    `UPDATE task SET title = ?, description = ?, status = ?, priority = ? WHERE id = ?;`,
    [
      task.title,
      task.description,
      task.status,
      task.priority,
      id,
    ],
  );

  return result;
};

export const deleteTask = async (client: Client, id: number) => {
  const result = await client.execute(
    `DELETE FROM task WHERE id = ${id};`,
  );

  return result;
};
