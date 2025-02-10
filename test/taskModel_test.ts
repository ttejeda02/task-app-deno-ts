import { assertEquals, assertNotEquals } from "@std/assert";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../models/TaskModel.ts";
import { Task } from "../models/Task.ts";
import { createDbConnection } from "../db/dbConnection.ts";

const newTask: Task = {
  id: 0, // id field is auto-increment
  title: "Create task test",
  description: "The task was created successfully",
  status: "pending",
  created_at: new Date(),
  updated_at: new Date(),
  id_user: null, // user is not necessary
  priority: "medium",
};

const updatedTask: Task = {
  id: 0,
  title: "Update task test",
  description: "The task was UPDATED successfully",
  status: "completed",
  created_at: new Date(),
  updated_at: new Date(),
  id_user: null,
  priority: "high",
};

Deno.test({
  name: "database operation task table",
  fn: async (t) => {
    const client = await createDbConnection();

    //select * from task
    await t.step("select * from tasks", async () => {
      try {
        const result = await getTasks(client);

        assertNotEquals(result, undefined);
        assertNotEquals(result, null);

        console.log("Get tasks was completed successfully");
      } catch (error) {
        console.error("Error to execute getTasks", error);
      }
    });

    //insert into task
    await t.step("insert into task", async () => {
      try {
        const result = await createTask(client, newTask);

        assertNotEquals(result, undefined);
        assertNotEquals(result, null);

        assertEquals(result.affectedRows?.toString() !== "0", true);
        updatedTask.id = result.lastInsertId ?? 0;
        console.log("The task was created successfully");
      } catch (error) {
        console.error("Error to execute createTask:", error);
      }
    });

    //get task by id
    await t.step("get task by id", async () => {
      try {
        const result = await getTaskById(client, updatedTask.id);

        assertNotEquals(result, undefined);
        assertNotEquals(result, null);

        console.log("The task was found successfully;", result);
      } catch (error) {
        console.error("Error to execute getTaskById", error);
      }
    });

    //update task
    await t.step("update task", async () => {
      try {
        const result = await updateTask(client, updatedTask.id, updatedTask);

        assertNotEquals(result, undefined);
        assertNotEquals(result, null);

        console.log("The task was updated successfully:", result);
      } catch (error) {
        console.error("Error to execute updateTask", error);
      }
    });

    //delete task
    await t.step("delete task", async () => {
      try {
        const result = await deleteTask(client, updatedTask.id);

        assertNotEquals(result, undefined);
        assertNotEquals(result, null);

        console.log("The task was deleted successfully", result);
      } catch (error) {
        console.error("Error to execute deleteTask", error);
      }
    });

    client.close();
  },
});
