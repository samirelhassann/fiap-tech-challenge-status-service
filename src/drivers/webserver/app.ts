import fastify from "fastify";

import { env } from "@/config/env";

import { cookieConfig } from "./config/cookieConfig";
import { errorHandling } from "./config/errorHandling";
import { jwtConfig } from "./config/jwtConfig";
import { redocConfig } from "./config/redocConfig";
import { routes } from "./config/routes";
import { subscribers } from "./config/subscribers";
import { swaggerConfig } from "./config/swaggerConfig";

console.log(`• [LOG] - env`, JSON.stringify(env, null, 2));

export const app = fastify();

swaggerConfig(app);
redocConfig(app);
jwtConfig(app);
cookieConfig(app);

routes(app);
errorHandling(app);

subscribers();
