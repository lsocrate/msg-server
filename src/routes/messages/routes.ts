import type { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { createMessage } from "../../db/messages.js";

export const messageRoutes: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
) => {
  fastify.register(postMessage);
};

const postMessage: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  const schema = {
    body: {
      type: "object",
      required: ["recipient", "content"],
      properties: {
        recipient: { type: "string" },
        content: { type: "string" },
      },
    },
    response: {
      201: {
        type: "object",
        required: ["recipient", "content"],
        properties: {
          id: { type: "number" },
          recipient: { type: "string" },
          content: { type: "string" },
        },
      },
    },
  } as const;

  fastify.post("/", { schema }, async (req, reply) => {
    const newMessage = await createMessage(req.body);
    reply.code(201).send(newMessage);
  });
};
