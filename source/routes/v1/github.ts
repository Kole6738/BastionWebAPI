/**
 * @todo Add typings
 */

"use strict";

import * as express from "express";

import getContributors from "../../methods/getContributors";
import getRepositories from "../../methods/getRepositories";

module Route {
  export class GitHub {
    public async contributors(_req: express.Request, res: express.Response, next: express.NextFunction) {
      try {
        let repos = await getRepositories();
        let orgContributors: any = {};

        for (let repo of repos) {
          let contributors = await getContributors(repo.name);
          if (!contributors) continue;

          for (let user of contributors) {
            if (orgContributors.hasOwnProperty(user.id)) {
              orgContributors[user.id].contributions += user.contributions;
            }
            else {
              orgContributors[user.id] = {
                login: user.login,
                avatar: user.html_url + ".png",
                url: user.html_url,
                type: user.type,
                contributions: user.contributions,
              };
            }
          }
        }

        res.json(orgContributors);
      }
      catch (e) {
        next(e);
      }
    }

    public async repos(_req: express.Request, res: express.Response, next: express.NextFunction) {
      try {
        let repos = await getRepositories();

        repos = repos.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          url: repo.html_url,
          description: repo.description,
          fork: repo.fork,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          git_url: repo.git_url,
          ssh_url: repo.ssh_url,
          clone_url: repo.clone_url,
          homepage: repo.homepage,
          size: repo.size,
          stargazers: repo.stargazers_count,
          watchers: repo.watchers_count || repo.watchers,
          language: repo.language,
          forks: repo.forks_count || repo.forks,
          archived: repo.archived,
          open_issues_count: repo.open_issues_count,
          license: repo.license,
          open_issues: repo.open_issues,
          default_branch: repo.default_branch,
        }));

        res.json(repos);
      }
      catch (e) {
        next(e);
      }
    }
  }
}

export = Route;
