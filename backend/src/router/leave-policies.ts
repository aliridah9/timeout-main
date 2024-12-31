import { db } from "../../db";
import { router, publicProcedure } from "../trpc";

export default router({
  getLeavePolicies: publicProcedure.query(async () => {
    return db.query.leavePolicies.findMany();
  }),
});
