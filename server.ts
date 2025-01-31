import { Application, Router } from "oak";
import { Client } from "mysql";
import taskRouter from "./routes/task.ts";
import "@std/dotenv";

const app = new Application();
const router1 = new Router();

router1.get("/", (context) => {
  context.response.body = "Hello, cruel world!";
});

const client = await new Client().connect({
  hostname: Deno.env.get("DB_HOST"),
  username: Deno.env.get("DB_USER"),
  db: Deno.env.get("DB_NAME"),
  password: Deno.env.get("DB_PASSWORD"),
});

await client.execute(`USE ${Deno.env.get("DB_NAME")}`);
console.log("Connected to the db");

app.use(router1.routes());
app.use(router1.allowedMethods());

app.use(taskRouter.routes());
app.use(taskRouter.allowedMethods());

const PORT = 8000;
console.log(`Server running in port ${PORT}`);
await app.listen({ port: PORT });
