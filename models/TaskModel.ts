import { Client } from "mysql";
import { Task } from "./Task.ts";
import "@std/dotenv";

const client = new Client();
await client.connect({
  hostname: Deno.env.get("DB_HOST"),
  username: Deno.env.get("DB_USER"),
  db: Deno.env.get("DB_NAME"),
  password: Deno.env.get("DB_PASSWORD"),
});

export const createTask = async (task: Task) => {
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

export const readTask = async () => {
  const tasks = await client.execute(`SELECT * FROM task`);
  return tasks as Task[];
}

export const updateTask = async (task: Task) => {
  const result = await client.execute(
    `UPDATE task SET title = ?, description = ?, status = ?, priority = ? WHERE id = ?;`,
    [
      task.title,
      task.description,
      task.status,
      task.priority,
      task.id
    ]
  )

  return result;
}

export const deleteTask = async (task: Task) => {
  const result = await client.execute(
    `DELETE FROM task WHERE id = ${task.id};`
  )

  return result;
}