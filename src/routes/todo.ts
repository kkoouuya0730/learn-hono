import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { TodoParamSchema, TodoListSchema, TodoSchema, CreateTodoSchema } from "../models/todos";
import { MessageSchema } from "../models/error";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";

type Bindings = {
  DB: D1Database;
};

export const app = new OpenAPIHono<{ Bindings: Bindings }>();

const getTodoRoute = createRoute({
  method: "get",
  path: "/{id}",
  request: {
    params: TodoParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TodoSchema,
        },
      },
      description: "Get Todo",
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: MessageSchema,
        },
      },
    },
    404: {
      content: {
        "application/json": {
          schema: MessageSchema,
        },
      },
      description: "Not Found",
    },
  },
  tags: ["todo"],
});

app.openapi(
  getTodoRoute,
  async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });

    const { id } = c.req.valid("param");

    const todo = await prisma.todo.findUnique({ where: { id: Number(id) } });

    if (!todo) return c.json({ code: 404, message: "Not Found" }, 404);

    return c.json(todo, 200);
  },
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
);

const getTodoListRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TodoListSchema,
        },
      },
      description: "Get Todo List",
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: MessageSchema,
        },
      },
    },
    404: {
      content: {
        "application/json": {
          schema: MessageSchema,
        },
      },
      description: "Not Found",
    },
  },
  tags: ["todo"],
});

app.openapi(
  getTodoListRoute,
  async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });

    const todoList = await prisma.todo.findMany();
    return c.json(todoList, 200);
  },
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
);

const createTodoRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTodoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TodoSchema,
        },
      },
      description: "Create Todo",
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: MessageSchema,
        },
      },
    },
  },
  tags: ["todo"],
});

app.openapi(
  createTodoRoute,
  async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
    const { title } = await c.req.json();

    const newTodo = await prisma.todo.create({
      data: {
        title,
        completed: false,
      },
    });

    return c.json(newTodo, 200);
  },
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
);

const updateTodoRoute = createRoute({
  method: "put",
  path: "/{id}",
  request: {
    params: TodoParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TodoSchema,
        },
      },
      description: "Update Todo Status",
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: MessageSchema,
        },
      },
    },
    404: {
      content: {
        "application/json": {
          schema: MessageSchema,
        },
      },
      description: "Not Found",
    },
  },
  tags: ["todo"],
});

app.openapi(
  updateTodoRoute,
  async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
    const { id } = c.req.valid("param");

    const todo = await prisma.todo.findUnique({ where: { id: Number(id) } });

    if (!todo) {
      return c.json({ code: 404, message: "Not Found" }, 404);
    }

    const updatedTodo = await prisma.todo.update({ where: { id: Number(id) }, data: { completed: !todo.completed } });

    return c.json(updatedTodo, 200);
  },
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
);

const deleteTodoRoute = createRoute({
  method: "delete",
  path: "/{id}",
  request: {
    params: TodoParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TodoListSchema,
        },
      },
      description: "Delete Todo",
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: MessageSchema,
        },
      },
    },
    404: {
      content: {
        "application/json": {
          schema: MessageSchema,
        },
      },
      description: "Not Found",
    },
  },
  tags: ["todo"],
});

app.openapi(
  deleteTodoRoute,
  async (c) => {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
    const { id } = c.req.valid("param");

    const todo = await prisma.todo.findUnique({ where: { id: Number(id) } });

    if (!todo) {
      return c.json({ code: 404, message: "Not Found" }, 404);
    }

    await prisma.todo.delete({ where: { id: Number(id) } });

    const newTodoList = await prisma.todo.findMany();

    return c.json(newTodoList, 200);
  },
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
);
