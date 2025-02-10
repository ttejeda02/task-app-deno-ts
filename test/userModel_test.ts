import { assertEquals, assertNotEquals } from "@std/assert";
import { createDBClient } from "../models/TaskModel.ts";
import {
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from "../models/UserModel.ts";
import { User } from "../models/User.ts";

const newUser: User = {
  id: 0,
  name: "eonoz",
  mail: "test@mail.dom",
  password: "c0ntr453ñ4",
  created_at: new Date(),
  update_at: new Date(),
};

const updatedUser: User = {
  id: 0,
  name: "Eonoz Rit",
  mail: "utest@email.ts",
  password: "p455w0rd123",
  created_at: new Date(),
  update_at: new Date(),
};

Deno.test({
  name: "database operation user table",
  fn: async (t) => {
    const client = await createDBClient();

    //insert into user
    await t.step("create new user", async () => {
      try {
        const result = await createUser(client, newUser);

        assertNotEquals(result, undefined);
        assertNotEquals(result, null);

        assertEquals(result.affectedRows?.toString() !== "0", true);
        updatedUser.id = result.lastInsertId ?? 0;
        console.log("The user was created successfully");
      } catch (error) {
        console.log("Error to execute createUser", error);
      }
    });

    //get user by id
    await t.step("get user", async () => {
      try {
        const result = await getUserById(client, updatedUser.id);

        assertNotEquals(result, undefined);
        assertNotEquals(result, null);

        console.log("Task was found successfully:", result);
      } catch (error) {
        console.log("Error to execute getUserById", error);
      }
    });

    //update user
    await t.step("update user", async () => {
      try {
        const result = await updateUser(client, updatedUser.id, updatedUser);

        assertNotEquals(result, undefined);
        assertNotEquals(result, null);

        console.log("Task was updated successfully", result);
      } catch (error) {
        console.log("Error to execute updateUser", error);
      }
    });

    //delete user
    await t.step("delete user", async () => {
      try {
        const result = await deleteUser(client, updatedUser.id);

        assertNotEquals(result, undefined);
        assertNotEquals(result, null);

        console.log("Task was deleted successfully", result);
      } catch (error) {
        console.log("Error to execute deleteUser", error);
      }
    });

    client.close();
  },
});
