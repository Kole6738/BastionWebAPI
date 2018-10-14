"use strict";

import * as express from "express";

import getDiscordGuild from "../../methods/getDiscordGuild";

module Route {
  export class Info {
    private guildID: string = "267022940967665664";

    public async guild(_req: express.Request, res: express.Response, next: express.NextFunction) {
      try {
        let guild: DiscordGuild = await getDiscordGuild(this.guildID);

        res.json({
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          splash: guild.splash,
          invite: 'https://discord.gg/fzx8fkt',
          owner_id: guild.owner_id,
        });
      }
      catch (e) {
        next(e);
      }
    }
  }
}

export = Route;
