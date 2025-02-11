import { Router } from "oak";
import { createUser, getUserById, updateUser } from "../models/UserModel.ts";
import { createDbConnection } from "../db/dbConnection.ts";
import { User } from "../models/User.ts";

const userRouter = new Router();

const client = await createDbConnection();

userRouter
  .get("/user/:id", async (ctx) => {
    try {
      const { id } = ctx.params;

      const result = await getUserById(client, parseInt(id));
      if (result?.length == 0) {
        ctx.response.status = 404;
        ctx.response.body = {
          status: "error",
          message: `User with ID ${id} not found`,
        };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = {
        status: "success",
        message: "User found",
        user: result,
      };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Error getting user",
      };
    }
  })
  .post("/user", async (ctx) => {
    try {
      const body = await ctx.request.body.text();

      const newUser: User = JSON.parse(body);
      const validateUserResult = validateUser(newUser);

      if (validateUserResult) {
        ctx.response.status = 400;
        ctx.response.body = {
          status: "error",
          message: validateUserResult,
        };
        return;
      }

      const result = await createUser(client, newUser);
      if (result.lastInsertId == undefined) {
        ctx.response.status = 500;
        ctx.response.body = {
          status: "error",
          message: "Internal server error",
        };
        return;
      }

      const user = await getUserById(client, result.lastInsertId);

      ctx.response.status = 201;
      ctx.response.body = {
        status: "success",
        message: "User created",
        user: user,
      };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Error creating user",
      };
    }
  })
  .put("/user/:id", async (ctx) => {
    try {
      const { id } = ctx.params;
      const body = await ctx.request.body.text();

      const newInfoUser: User = JSON.parse(body);
      const validateUserResult = validateUser(newInfoUser);
      if (validateUserResult) {
        ctx.response.status = 400;
        ctx.response.body = {
          status: "error",
          message: validateUserResult,
        };
        return;
      }

      const result = await updateUser(client, parseInt(id), newInfoUser);
      if (result.affectedRows == 0) {
        ctx.response.status = 404;
        ctx.response.body = {
          status: "error",
          message: "User not found",
        };
        return;
      }

      const user = await getUserById(client, parseInt(id));

      ctx.response.status = 200;
      ctx.response.body = {
        status: "success",
        message: "User updated",
        user: user,
      };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = {
        status: "error",
        message: "Error updating user",
      };
    }
  });

function validateUser(user: User): string | null {
  //Validate name
  if (!user.name || user.name.trim() == "") {
    return "Name is required";
  }

  //Validate email
  const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!mailRegex.test(user.mail) || !user.mail || user.mail.trim() == "") {
    return "Email is required or is invalid";
  }

  //Validate password
  if (!user.password || user.password.trim() == "") {
    return "Password is required";
  }

  return null;
}

export default userRouter;
