/**
 * Interface for the Paypal donor object.
 *
 * @interface Donor
 */
interface Donor {
  readonly donor_relationship_start: number,
  readonly last_donation_date: number,
  readonly lifetime_support_cents: number,
  readonly discord_id: string,
  discord_tag: string,
  discord_avatar: string,
}
