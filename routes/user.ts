import { Router } from "oak";
import { getUserById } from "../models/UserModel.ts";
import { createDbConnection } from "../db/dbConnection.ts";

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
  });

export default userRouter;
