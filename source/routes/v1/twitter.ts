/// <reference path="./twitter.d.ts"/>

"use strict";

import * as express from "express";
import * as request from "request-promise-native";

import redisClient from "../../redisClient";

module Route {
  export class Twitter {
    private account: string = 'TheBastionBot';
    private redisPrefix: string = 'twitter';
    private baseURL: string = 'https://api.twitter.com/1.1';

    public async main(_req: express.Request, res: express.Response, next: express.NextFunction) {
      let redisKey: string = `${this.redisPrefix}:${this.account}`;
      redisClient.get(redisKey, async (err, info) => {
        try {
          if (err) next(err);

          if (info) {
            res.json(JSON.parse(info));
          }
          else {
            let url: string = this.baseURL + '/users/show.json';
            let options: request.RequestPromiseOptions = {
              headers: {
                'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
              },
              qs: {
                screen_name: this.account,
                include_user_entities: true
              },
              json: true
            };

            let response: TwitterUser = await request(url, options);

            let info: User = {
              id: response.id_str,
              name: response.name,
              username: response.screen_name,
              location: response.location,
              description: response.description,
              url: response.url,
              followers_count: response.followers_count,
              following_count: response.friends_count,
              statuses_count: response.statuses_count,
              profile_background_color: response.profile_background_color,
              profile_image_url: response.profile_image_url_https.replace('_normal', '_400x400'),
              profile_banner_url: response.profile_banner_url,
            };

            redisClient.setex(redisKey, 86400, JSON.stringify(info));

            res.json(info);
          }
        }
        catch (e) {
          next(e);
        }
      });
    }

    public async followers(_req: express.Request, res: express.Response, next: express.NextFunction) {
      let redisKey: string = `${this.redisPrefix}:${this.account}:followers`;
      redisClient.get(redisKey, async (err, followers) => {
        try {
          if (err) next(err);

          if (followers) {
            res.json(JSON.parse(followers));
          }
          else {
            let url: string = this.baseURL + '/followers/list.json';
            let options: request.RequestPromiseOptions = {
              headers: {
                'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
              },
              qs: {
                screen_name: this.account,
                cursor: -1,
                count: 200,
                skip_status: true,
                include_user_entities: false
              },
              json: true
            };

            let response: Followers = await request(url, options);

            let followers: User[] = response.users.map((user: TwitterUser) => {
              return {
                id: user.id_str,
                name: user.name,
                username: user.screen_name,
                location: user.location,
                description: user.description,
                url: user.url,
                followers_count: user.followers_count,
                following_count: user.friends_count,
                statuses_count: user.statuses_count,
                profile_background_color: user.profile_background_color,
                profile_image_url: user.profile_image_url_https.replace('_normal', '_400x400'),
                profile_banner_url: user.profile_banner_url,
              }
            });

            redisClient.setex(redisKey, 86400, JSON.stringify(followers));

            res.json(followers);
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
