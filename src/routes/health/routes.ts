import type { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { prisma } from "../../prisma.js";

export const healthRoutes: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
) => {
  const schema = {
    response: {
      200: {
        type: "object",
        required: ["healthy"],
        properties: {
          healthy: { type: "boolean" },
        },
      },
    },
  } as const;

  fastify.get("/", { schema }, async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { healthy: true };
    } catch (err) {
      return { healthy: false };
    }
  });
};
