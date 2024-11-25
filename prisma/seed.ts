const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

const todoList = [
  {
    title: "Learning Hono",
    completed: false,
  },
  {
    title: "Implement Todo API",
    completed: true,
  },
  {
    title: "Write documentation",
    completed: false,
  },
];

async function run() {
  const promises = todoList.map(async (todo) => {
    try {
      await exec(
        `npx wrangler d1 execute hono-tutorial-db --command "INSERT INTO  \"Todo\" (\"id\", \"title\", \"completed\") VALUES  ('${todo.title}', '${todo.completed}');" --remote`
      );
    } catch (error) {
      console.error(error);
    }
  });
  await Promise.all(promises);
}

run();
