import { Application, Router } from "oak";

const app = new Application();
const router = new Router();

router.get("/", (context) => {
  context.response.body = "Hello, cruel world!";
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 8000;
console.log(`Server running in port ${PORT}`);
await app.listen({ port: PORT });
