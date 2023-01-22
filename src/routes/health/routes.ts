import type { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

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
    return { healthy: true };
  });
};
