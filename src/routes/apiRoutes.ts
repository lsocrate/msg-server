import type { FastifyPluginAsync } from "fastify";

import { healthRoutes } from "./health/routes.js";

export const apiRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(healthRoutes, { prefix: "/health" });
};
