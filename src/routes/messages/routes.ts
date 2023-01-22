import type { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { z } from "zod";
import * as Messages from "../../db/messages.js";

export const messageRoutes: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
) => {
  fastify.register(postMessage);
  fastify.register(getUnread);
  fastify.register(getPaginated);
  fastify.register(deleteMessage);
  fastify.register(deleteQuery);
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
    const newMessage = await Messages.createMessage(req.body);
    reply.code(201).send(newMessage);
  });
};

const getUnread: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  const schema = {
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            recipient: { type: "string" },
            content: { type: "string" },
          },
        },
      },
    },
  } as const;
  fastify.get("/unread", { schema }, async (req, reply) => {
    const messages = await Messages.fetchUnreadMessages();
    reply.code(200).send(messages);
  });
};

const getPaginated: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  const schema = {
    querystring: {
      type: "object",
      required: ["start", "stop"],
      properties: {
        start: { type: "integer" },
        stop: { type: "integer" },
      },
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            recipient: { type: "string" },
            content: { type: "string" },
          },
        },
      },
    },
  } as const;
  fastify.get("/paginated", { schema }, async (req, reply) => {
    if (req.query.start > req.query.stop) {
      return reply.code(400).send();
    }

    const messages = await Messages.fetchPaginated(
      req.query.start,
      req.query.stop
    );
    reply.code(200).send(messages);
  });
};

const deleteMessage: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  const schema = {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "integer" },
      },
    },
  } as const;

  fastify.delete("/:id", { schema }, async (req, reply) => {
    await Messages.deleteMessages([req.params.id]);
    reply.code(204).send();
  });
};

const deleteQuery: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  const schema = {
    querystring: {
      type: "object",
      required: ["ids"],
      properties: {
        ids: { type: "string" },
      },
    },
  } as const;

  fastify.delete("/", { schema }, async (req, reply) => {
    try {
      const parsedIds = req.query.ids
        .split(",")
        .map((str) => z.coerce.number().parse(str));
      await Messages.deleteMessages(parsedIds);
      reply.code(204).send();
    } catch (error) {
      reply.code(400).send();
    }
  });
};
