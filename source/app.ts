"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as dotenv from "dotenv";

import * as ChatRoute from "./routes/v1/chat";
import * as IndexRoute from "./routes/v1";
import * as InfoRoute from "./routes/v1/info";
import * as PatreonRouter from "./routes/v1/patreon";
import * as PayPalRouter from "./routes/v1/paypal";
import * as TwitterRouter from "./routes/v1/twitter";

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
    const Chat: ChatRoute.Chat = new ChatRoute.Chat();
    const Index: IndexRoute.Index = new IndexRoute.Index();
    const Info: InfoRoute.Info = new InfoRoute.Info();
    const Twitter: TwitterRouter.Twitter = new TwitterRouter.Twitter();
    const Patreon: PatreonRouter.Patreon = new PatreonRouter.Patreon();
    const PayPal: PayPalRouter.PayPal = new PayPalRouter.PayPal();

    // Routes
    router.get("/", Index.main.bind(Index));
    router.get("/chat", Chat.main.bind(Chat));
    router.get("/info/guild", Info.guild.bind(Info));
    router.get("/patreon/patrons", Patreon.patrons.bind(Patreon));
    router.get("/paypal/donors", PayPal.donors.bind(PayPal));
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
