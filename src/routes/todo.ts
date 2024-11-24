import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { TodoParamSchema, TodoListSchema, TodoSchema, CreateTodoSchema } from "../models/todos";
import { MessageSchema } from "../models/error";

export const app = new OpenAPIHono();

const todoList = [
  {
    id: "1",
    title: "Learning Hono",
    completed: false,
  },
  {
    id: "2",
    title: "Implement Todo API",
    completed: true,
  },
  {
    id: "3",
    title: "Write documentation",
    completed: false,
  },
];

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
  (c) => {
    const { id } = c.req.valid("param");
    const todo = todoList.find((todo) => todo.id === id);

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
  (c) => {
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
    const { title } = await c.req.json();

    const newTodo = {
      id: String(todoList.length + 1),
      title,
      completed: false,
    };

    todoList.push(newTodo);
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
    const { id } = c.req.valid("param");

    const todo = todoList.find((todo) => todo.id === id);

    if (!todo) {
      return c.json({ code: 404, message: "Not Found" }, 404);
    }

    todo.completed = !todo.completed;

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
    const { id } = c.req.valid("param");

    const newTodoList = todoList.filter((todo) => todo.id !== id);

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
