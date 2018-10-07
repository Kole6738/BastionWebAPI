/// <reference path="./paypal.d.ts"/>

"use strict";

import * as express from "express";

import redisClient from "../../redisClient";
import getDiscordUser from "../../methods/getDiscordUser";
import * as paypalDonors from "../../data/paypalDonors.json";

module Route {
  export class PayPal {
    private redisPrefix: string = "paypal";

    public async donors(_req: express.Request, res: express.Response, next: express.NextFunction) {
      let redisKey: string = this.redisPrefix + ":donors";

      redisClient.get(redisKey, async (error, donors) => {
        try {
          if (error) next(error);

          if (donors) {
            res.json(JSON.parse(donors));
          }
          else {
            let donors: Donor[] = paypalDonors as Donor[];

            for (let donor of donors) {
              if (!donor.discord_id) continue;

              let user: DiscordUser | void =
                await getDiscordUser(donor.discord_id).catch(() => {});

              if (!user) continue;

              donor.discord_tag = user.tag;
              donor.discord_avatar = user.avatar;
            }

            redisClient.setex(redisKey, 3600, JSON.stringify(donors));

            res.json(donors);
          }
        }
        catch (e) {
          next(e);
        }
      });
    }
  }
}

export = Route;
