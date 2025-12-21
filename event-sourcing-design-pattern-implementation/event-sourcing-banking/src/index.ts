import { Hono } from "hono";
import { accountService } from "./services/accountService";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/deposit/:accountID", async (c) => {
  const accountId = c.req.param("accountId");
  const { amount } = c.req.json();

  if (!accountId || !amount) {
    throw new Error("Amount or accountId missing");
  }
  const res = accountService.deposit(accountId, amount);

  return c.json(
    {
      response: res,
    },
    200
  );
});

app.post("/withdraw/:accountID", async (c) => {
  const accountId = c.req.param("accountId");
  const { amount } = c.req.json();

  if (!accountId || !amount) {
    return c.json(
      {
        response: "Amount or accountId missing",
      },
      400
    );
  }
  const res = accountService.withdraw(accountId, amount);

  return c.json(
    {
      response: res,
    },
    200
  );
});

app.get("/balance/:accountID", async (c) => {
  const accountId = c.req.param("accountId");

  if (!accountId) {
    return c.json(
      {
        response: "accountID not found",
      },
      400
    );
  }
  const res = accountService.getBalance(accountId);

  return c.json(
    {
      response: res,
    },
    200
  );
});

app.get("/getHistory/:accountID", async (c) => {
  const accountId = c.req.param("accountId");

  if (!accountId) {
    return c.json(
      {
        response: "accountID not found",
      },
      400
    );
  }
  const history = accountService.getUserHistory(accountId);

  return c.json(
    {
      history,
    },
    200
  );
});

export default app;
