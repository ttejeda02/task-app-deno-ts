import { Application, Router } from "oak";
import { Client } from "mysql";
import "@std/dotenv";

const app = new Application();
const router = new Router();

router.get("/", (context) => {
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

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 8000;
console.log(`Server running in port ${PORT}`);
await app.listen({ port: PORT });
