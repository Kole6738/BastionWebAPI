/// <reference path="./discord.d.ts"/>

import * as request from "request-promise-native";

import redisClient from "../redisClient";

export default (userID: string): Promise<DiscordUser> => {
  return new Promise(async (resolve, reject) => {
    let redisKey: string = `discord:user:${userID}`;

    redisClient.get(redisKey, async (error, user): Promise<void> => {
      try {
        if (error) reject(error);

        if (user) {
          resolve(JSON.parse(user));
        }
        else {
          let url: string = 'https://discordapp.com/api/users/' + userID;
          let options: request.RequestPromiseOptions = {
            headers: {
              Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
            },
            json: true,
          };

          let response: DiscordUser = await request(url, options);

          Object.defineProperties(response, {
            tag: {
              value: response.username + "#" + response.discriminator,
            },
            avatar: {
              value: response.avatar
                ? "https://cdn.discordapp.com/avatars/"
                  + response.id + "/" + response.avatar
                  + "." + (response.avatar.startsWith("a_") ? "gif" : "png")
                : "https://cdn.discordapp.com/embed/avatars/"
                  + parseInt(response.discriminator) % 5 + ".png",
            },
          });

          redisClient.setex(redisKey, 86400, JSON.stringify(response));

          resolve(response);
        }
      }
      catch (e) {
        if (e.name === "StatusCodeError") {
          delete e.options;
          delete e.response;
        }

        reject(e);
      }
    });
  });
};
