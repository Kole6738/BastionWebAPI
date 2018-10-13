/// <reference path="./discord.d.ts"/>

import * as request from "request-promise-native";

import redisClient from "../redisClient";

export default (guildID: string): Promise<DiscordGuild> => {
  return new Promise(async (resolve, reject) => {
    let redisKey: string = `discord:guild:${guildID}`;

    redisClient.get(redisKey, async (error, guild): Promise<void> => {
      try {
        if (error) reject(error);

        if (guild) {
          resolve(JSON.parse(guild));
        }
        else {
          let url: string = 'https://discordapp.com/api/guilds/' + guildID;
          let options: request.RequestPromiseOptions = {
            headers: {
              Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
            },
            json: true,
          };

          let response: DiscordGuild = await request(url, options);

          Object.defineProperties(response, {
            icon: {
              value: response.icon
                ? "https://cdn.discordapp.com/icons/"
                  + response.id + "/" + response.icon + ".png"
                : null,
            },
            splash: {
              value: response.splash
                ? "https://cdn.discordapp.com/splashes/"
                  + response.id + "/" + response.splash + ".png"
                : null,
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
