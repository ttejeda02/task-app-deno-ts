import { Client } from "mysql";
import { User } from "./User.ts";

export const createUser = async (client: Client, user: User) => {
  const result = await client.execute(
    `INSERT INTO user (name, mail, password) VALUES (?, ?, ?);`,
    [
      user.name,
      user.mail,
      user.password,
    ],
  );

  return result;
};

export const getUserById = async (client: Client, id: number) => {
  const user = await client.execute(`SELECT * FROM user WHERE id = ${id}`);

  return user.rows;
};

export const updateUser = async (client: Client, id: number, user: User) => {
  const result = await client.execute(
    `UPDATE user SET name = ?, mail = ?, password = ? WHERE id = ?`,
    [
      user.name,
      user.mail,
      user.password,
      id,
    ],
  );

  return result;
};

export const deleteUser = async (client: Client, id: number) => {
  const result = await client.execute(
    `DELETE FROM user WHERE id = ${id}`,
  );

  return result;
};
