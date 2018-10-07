/**
 * Interface for the User object returned by Discord API.
 *
 * @interface DiscordUser
 */
interface DiscordUser {
  readonly username: string,
  readonly discriminator: string,
  readonly id: string,
  readonly avatar: string,
}
