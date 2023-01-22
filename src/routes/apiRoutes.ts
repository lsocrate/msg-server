import type { FastifyPluginAsync } from "fastify";

import { healthRoutes } from "./health/routes.js";
import { messageRoutes } from "./messages/routes.js";

export const apiRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(healthRoutes, { prefix: "/health" });
  fastify.register(messageRoutes, { prefix: "/messages" });
};
