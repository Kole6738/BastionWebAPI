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
