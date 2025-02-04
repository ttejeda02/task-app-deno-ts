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
      if (tasks.length == 0) {
        ctx.response.body = { status: "success", message: "No tasks found", tasks: tasks };
        return;
      }

      ctx.response.body = { status: "success", message: "Tasks found", tasks: tasks };
    } catch (_error) {
      ctx.response.status = 500;
      ctx.response.body = { status: "error", message: "Error fetching tasks" };
    }
  })
  .post("/tasks", async (ctx) => {
    try {
      const body = await ctx.request.body.text();

      const newTask: Task = JSON.parse(body);
      const validateTaskResult = validateTask(newTask);

      if (validateTaskResult) {
        ctx.response.status = 400;
        ctx.response.body = { status: "error", message: validateTaskResult };
        return;
      }

      const result = await createTask(newTask);
      if (result.lastInsertId == undefined) {
        ctx.response.status = 500;
        ctx.response.body = { status: "error", message: "Internal server error" };
        return;
      }

      const task = (await getTaskById(result.lastInsertId)).rows;

      ctx.response.status = 201;
      ctx.response.body = { status: "success", message: "Task created", task: task };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = { status: "error", message: "Error creating task" };
    }
  })
  .get("/tasks/:id", async (ctx) => {
    try {
      const { id } = ctx.params;

      const result = (await getTaskById(parseInt(id))).rows;
      if (result?.length == 0) {
        ctx.response.status = 404;
        ctx.response.body = { status: "error", message: `Task with ID ${id} not found` };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = { status: "success", message: "Task found", task: result };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = { status: "error", message: "Error getting task" };
    }
  })
  .put("/tasks/:id", async (ctx) => {
    try {
      const { id } = ctx.params;
      const body = await ctx.request.body.text();

      const newInfoTask: Task = JSON.parse(body);
      const validateTaskResult = validateTask(newInfoTask);
      if (validateTaskResult) {
        ctx.response.status = 400;
        ctx.response.body = { status: "error", message: validateTaskResult };
        return;
      }

      const result = await updateTask(parseInt(id), newInfoTask);
      if (result.affectedRows == 0) {
        ctx.response.status = 404;
        ctx.response.body = { status: "error", message: "Task not found" };
        return;
      }

      const task = (await getTaskById(parseInt(id))).rows;

      ctx.response.status = 200;
      ctx.response.body = { status: "success", message: "Task updated", task: task };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = { status: "error", message: "Error updating task" };
    }
  })
  .delete("/tasks/:id", async (ctx) => {
    try {
      const { id } = ctx.params;
      const result = await deleteTask(parseInt(id));

      if (result.affectedRows == 0) {
        ctx.response.status = 404;
        ctx.response.body = { status: "error", message: "Task not found" };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = { status: "success",  message: "Task deleted", taskId: id };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = { status: "error", message: "Error deleting task" };
    }
  });

function validateTask(task: Task): string | null {
  //Validate title
  if (!task.title || task.title.trim() == "") {
    return "Title is required";
  }

  //Validate status
  if (
    task.status &&
    !["pending", "ongoing", "completed", "archived"].includes(task.status)
  ) {
    return "Invalid status value. Use 'pending', 'ongoing', 'completed' or 'archived'";
  }

  //Validate priority
  if (task.priority && !["low", "medium", "high"].includes(task.priority)) {
    return "Invalid priority value. Use 'low', 'medium' or 'high'";
  }

  return null;
}
export default taskRouter;
