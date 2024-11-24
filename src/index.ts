import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { app as todoRoute } from "./routes/todo";

const app = new OpenAPIHono();

app.get("/", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono",
  });
});

app.route("/todo", todoRoute);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My TODO API with Hono",
  },
});

app.get("/ui", swaggerUI({ url: "/doc" }));

export default app;
