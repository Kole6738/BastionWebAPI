/**
 * Interface for the User object returned by Discord API.
 *
 * @interface DiscordUser
 */
interface DiscordUser {
  readonly username: string,
  readonly discriminator: string,
  readonly id: string,
  readonly tag: string,
  readonly avatar: string,
}

/**
 * Interface for the Guild object returned by Discord API.
 *
 * @interface DiscordGuild
 */
interface DiscordGuild {
  readonly id: string,
  readonly name: string,
  readonly icon: string | null,
  readonly splash: string | null,
  readonly owner_id: string,
  readonly region: string,
}
