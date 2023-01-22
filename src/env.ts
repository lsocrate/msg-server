import { z } from "zod";

const parsedEnv = z
  .object({
    NODE_ENV: z.enum(["production", "development", "test"]),
    PORT: z.coerce.number().int(),
  })
  .safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error("Environment variables misconfigured", {
    cause: parsedEnv.error.format(),
  });
}

export const { NODE_ENV: nodeEnv, PORT: port } = parsedEnv.data;
