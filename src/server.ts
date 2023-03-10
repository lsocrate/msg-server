import { fastify } from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

import * as env from "./env.js";
import { prisma } from "./prisma.js";
import { apiRoutes } from "./routes/apiRoutes.js";

export const createServer = async () => {
  console.log("SERVER: creating");
  const server = fastify({ logger: env.nodeEnv !== "production" });
  server.register(fastifySwagger);
  server.register(fastifySwaggerUi, { routePrefix: "/docs" });
  server.register(apiRoutes, { prefix: "/api" });

  return {
    start: async (): Promise<void> => {
      console.log("SERVER: starting");
      await server.listen({ host: "0.0.0.0", port: env.port });
      console.log(`SERVER: running on :${env.port}`);
    },
    shutdown: async (): Promise<void> => {
      console.log("SERVER: shutdown started");
      await Promise.allSettled([server.close(), prisma.$disconnect()]);
      console.log("SERVER: shutdown done");
    },
  };
};
