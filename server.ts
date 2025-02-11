import { Application, Router } from "oak";
import taskRouter from "./routes/task.ts";
import userRouter from "./routes/user.ts";
import "@std/dotenv";

const app = new Application();
const router1 = new Router();

router1.get("/", (context) => {
  context.response.body = "Hello, cruel world!";
});

app.use(router1.routes());
app.use(router1.allowedMethods());

app.use(taskRouter.routes());
app.use(taskRouter.allowedMethods());

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

const PORT = 8000;
console.log(`Server running in port ${PORT}`);
await app.listen({ port: PORT });
