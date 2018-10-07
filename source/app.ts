"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as dotenv from "dotenv";

import * as IndexRoute from "./routes/v1";
import * as TwitterRouter from "./routes/v1/twitter";
import * as PatreonRouter from "./routes/v1/patreon";

/**
 * The server.
 *
 * @class Server
 */
class Server {
  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // Create Express.js application
    this.app = express();

    // Configure application
    this.config();

    // Configure routes
    this.routes();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   * @return void
   */
  private config() {
    // Configure dotenv
    dotenv.config();

    // Use logger for server side logging
    this.app.use(logger("dev"));

    // Mount json form parser
    this.app.use(bodyParser.json());

    // Mount query string parser
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  /**
   * Configure routes
   *
   * @class Server
   * @method routes
   * @return void
   */
  private routes() {
    // Get router
    let router: express.Router;
    router = express.Router();

    // Create routes
    const Index: IndexRoute.Index = new IndexRoute.Index();
    const Twitter: TwitterRouter.Twitter = new TwitterRouter.Twitter();
    const Patreon: PatreonRouter.Patreon = new PatreonRouter.Patreon();

    // Routes
    router.get("/", Index.main.bind(Index));
    router.get("/patreon/patrons", Patreon.patrons.bind(Patreon));
    router.get("/twitter", Twitter.main.bind(Twitter));
    router.get("/twitter/followers", Twitter.followers.bind(Twitter));

    // Use router middleware
    this.app.use(router);

    // Catch 404 and forward to error handler
    this.app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.json({
        error: "404",
        message: "Not Found"
      });

      next();
    });
  }
}

const server = Server.bootstrap();
export = server.app;
