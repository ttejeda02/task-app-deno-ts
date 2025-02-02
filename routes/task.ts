import { Router } from "oak";
import {
  createTask,
  getTaskById,
  getTasks,
  updateTask,
  deleteTask
} from "../models/TaskModel.ts";
import { Task } from "../models/Task.ts";

const taskRouter = new Router();

taskRouter
  .get("/tasks", async (context) => {
    try {
      const tasks = await getTasks();

      context.response.status = 200;
      context.response.body = tasks;
    } catch (_error) {
      context.response.status = 500;
      context.response.body = { error: "Error fetching tasks" };
    }
  })
  .post("/tasks", async (context) => {
    try {
      const body = await context.request.body.text();
      const newTask: Task = JSON.parse(body);
      const result = await createTask(newTask);

      context.response.status = 201;
      context.response.body = { message: "Task created", task: result };
    } catch (_error) {
      context.response.status = 400;
      context.response.body = { error: "Error creating task" };
    }
  })
  .get("/tasks/:id", async (context) => {
    try {
      const { id } = context.params;
      const result = (await getTaskById(parseInt(id))).rows;

      context.response.status = 200;
      context.response.body = { message: "Task found", task: result };
    } catch (_error) {
      context.response.status = 400;
      context.response.body = { error: "Error getting task" };
    }
  })
  .put("/tasks/:id", async (context) => {
    try {
      const { id } = context.params;
      const body = await context.request.body.text();
      const newInfoTask: Task = JSON.parse(body);
      const result = await updateTask(parseInt(id), newInfoTask);

      context.response.body = 200;
      context.response.body = { message: "Task updated", task: result };
    } catch (_error) {
      context.response.status = 400;
      context.response.body = { message: "Error updating task" };
    }
  })
  .delete("/tasks/:id", async (context) => {
    try {
      const { id } = context.params
      const result = await deleteTask(parseInt(id))

      context.response.body = 200
      context.response.body = { message: "Task deleted", task: result}
    } catch (_error) {
      context.response.status = 400
      context.response.body = { message: "Error deleting task" }
    }
  })
  
export default taskRouter;
