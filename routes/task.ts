import { Router } from "oak";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../models/TaskModel.ts";
import { Task } from "../models/Task.ts";

const taskRouter = new Router();

taskRouter
  .get("/tasks", async (ctx) => {
    try {
      const tasks = await getTasks();

      ctx.response.status = 200;
      ctx.response.body = tasks;
    } catch (_error) {
      ctx.response.status = 500;
      ctx.response.body = { error: "Error fetching tasks" };
    }
  })
  .post("/tasks", async (ctx) => {
    try {
      const body = await ctx.request.body.text();
      const newTask: Task = JSON.parse(body);
      const result = await createTask(newTask);

      ctx.response.status = 201;
      ctx.response.body = { message: "Task created", task: result };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Error creating task" };
    }
  })
  .get("/tasks/:id", async (ctx) => {
    try {
      const { id } = ctx.params;
      const result = (await getTaskById(parseInt(id))).rows;

      ctx.response.status = 200;
      ctx.response.body = { message: "Task found", task: result };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Error getting task" };
    }
  })
  .put("/tasks/:id", async (ctx) => {
    try {
      const { id } = ctx.params;
      const body = await ctx.request.body.text();
      const newInfoTask: Task = JSON.parse(body);
      const result = await updateTask(parseInt(id), newInfoTask);

      ctx.response.body = 200;
      ctx.response.body = { message: "Task updated", task: result };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Error updating task" };
    }
  })
  .delete("/tasks/:id", async (ctx) => {
    try {
      const { id } = ctx.params;
      const result = await deleteTask(parseInt(id));

      ctx.response.body = 200;
      ctx.response.body = { message: "Task deleted", task: result };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Error deleting task" };
    }
  });

export default taskRouter;
