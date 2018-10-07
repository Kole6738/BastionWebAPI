/**
 * @todo Add typings
 */

"use strict";

import * as express from "express";
import * as request from "request-promise-native";

import redisClient from "../../redisClient";
// import getDiscordUser from "../../methods/getDiscordUser";

module Route {
  export class Patreon {
    private redisPrefix: string = "patreon";
    private campaign: string = "754397";

    /**
     * @todo Return `social_connections` User attribute with the Patrons object
     * after this is fixed: https://www.patreondevelopers.com/t/1196
     *
     * @todo Return Discord user details along the Patrons object.
     */
    public async patrons(_req: express.Request, res: express.Response, next: express.NextFunction) {
      let redisKey: string = `${this.redisPrefix}:${this.campaign}:patrons`;

      redisClient.get(redisKey, async (err, patrons) => {
        try {
          if (err) next(err);

          if (patrons) {
            res.json(JSON.parse(patrons));
          }
          else {
            let url: string = 'https://www.patreon.com/api/oauth2/v2/campaigns/754397/members';
            let options: request.RequestPromiseOptions = {
              headers: {
                Authorization: `Bearer ${process.env.PATREON_ACCESS_TOKEN}`
              },
              qs: {
                include: 'user',
                'fields[member]': 'will_pay_amount_cents,pledge_relationship_start,full_name,is_follower,last_charge_date,last_charge_status,lifetime_support_cents,currently_entitled_amount_cents,patron_status',
                'fields[user]': 'image_url,vanity',
                // 'fields[user]': 'vanity,image_url,social_connections',
              },
              json: true,
            };
            let response = await request(url, options);

            let members = response.data
              .filter((entity: any) => entity.type === "member")
              .map((member: any) => {
                let user = response.included
                  .filter((entity: any) => entity.type === "user")
                  .find((user: any) => (
                    user.id === member.relationships.user.data.id
                  ));

                Object.assign(member.attributes, user.attributes);

                return member.attributes;
              });

            redisClient.setex(redisKey, 3600, JSON.stringify(members));

            res.json(members);
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
