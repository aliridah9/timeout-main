import cors from "cors";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "./router";

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({ req, res });

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
export { createContext };
