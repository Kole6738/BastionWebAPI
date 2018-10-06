"use strict";

import * as express from "express";
import * as request from "request-promise-native";

import redisClient from "../../redisClient";

/**
 * Interface for User object returned by Twitter API.
 *
 * @interface TwitterUser
 */
interface TwitterUser {
  readonly id_str: string,
  readonly name: string,
  readonly screen_name: string,
  readonly location: string,
  readonly description: string,
  readonly url: string,
  readonly followers_count: number,
  readonly friends_count: number,
  readonly statuses_count: number,
  readonly profile_background_color: string,
  readonly profile_image_url_https: string,
  readonly profile_banner_url: string,
}

/**
 * Interface for Followers response returned by Twitter API.
 *
 * @interface Followers
 */
interface Followers {
  readonly users: TwitterUser[]
}

/**
 * Interface for wrapping a Twitter User object.
 *
 * @interface User
 * @see TwitterUser
 */
interface User {
  readonly id: TwitterUser["id_str"],
  readonly name: TwitterUser["name"],
  readonly username: TwitterUser["screen_name"],
  readonly location: TwitterUser["location"],
  readonly description: TwitterUser["description"],
  readonly url: TwitterUser["url"],
  readonly followers_count: TwitterUser["followers_count"],
  readonly following_count: TwitterUser["friends_count"],
  readonly statuses_count: TwitterUser["statuses_count"],
  readonly profile_background_color: TwitterUser["profile_background_color"],
  readonly profile_image_url: TwitterUser["profile_image_url_https"],
  readonly profile_banner_url: TwitterUser["profile_banner_url"],
}

module Route {
  export class Twitter {
    private account: string = 'TheBastionBot';
    private redisPrefix: string = 'twitter';

    public async main(_req: express.Request, res: express.Response, next: express.NextFunction) {
      let redisKey: string = `${this.redisPrefix}:${this.account}`;
      redisClient.get(redisKey, async (err, info) => {
        try {
          if (err) next(err);

          if (info) {
            res.json(JSON.parse(info));
          }
          else {
            let url: string = 'https://api.twitter.com/1.1/users/show.json';
            let options: request.RequestPromiseOptions = {
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
              },
              qs: {
                screen_name: 'TheBastionBot',
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
            let url: string = 'https://api.twitter.com/1.1/followers/list.json';
            let options: request.RequestPromiseOptions = {
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
              },
              qs: {
                screen_name: 'TheBastionBot',
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
