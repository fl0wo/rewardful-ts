import { z } from "zod";

export type Affiliate = {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  paypal_email: string | null;
  state: "active" | "inactive";
  stripe_customer_id?: (string | null) | undefined;
  stripe_account_id?: (string | null) | undefined;
  visitors: number;
  leads: number;
  conversions: number;
  campaign?: Campaign | undefined;
  links?: Array<Link> | undefined;
  coupon?: Coupon | undefined;
};
export type Campaign = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  url: string;
  private: boolean;
  private_tokens: boolean;
  commission_amount_cents?: (number | null) | undefined;
  commission_amount_currency?: (string | null) | undefined;
  minimum_payout_cents: number;
  max_commission_period_months?: (number | null) | undefined;
  max_commissions?: (number | null) | undefined;
  days_before_referrals_expire: number;
  days_until_commissions_are_due: number;
  affiliate_dashboard_text: string;
  custom_reward_description: string;
  welcome_text: string;
  customers_visible_to_affiliates: boolean;
  sale_description_visible_to_affiliates: boolean;
  parameter_type: "query" | "hash" | "path";
  stripe_coupon_id?: (string | null) | undefined;
  default: boolean;
  reward_type: "percent" | "flat";
  commission_percent?: (number | null) | undefined;
  minimum_payout_currency: string;
  visitors: number;
  leads: number;
  conversions: number;
  affiliates: number;
};
export type Link = {
  id: string;
  url: string;
  token: string;
  visitors: number;
  leads: number;
  conversions: number;
};
export type Coupon = {
  id: string;
  external_id: string;
  token: string;
  leads: number;
  conversions: number;
  affiliate_id: string;
};
export type Customer = {
  id: string;
  name: string;
  email: string;
  platform: string;
};
export type Referral = {
  id: string;
  link: Link;
  visits: number;
  customer: Customer;
  affiliate: Affiliate;
  created_at: string;
  became_lead_at: string | null;
  became_conversion_at: string | null;
  expires_at: string | null;
  updated_at: string;
  deactivated_at: string | null;
  conversion_state: "conversion" | "lead" | "visitor";
  stripe_account_id: string | null;
  stripe_customer_id: string | null;
};
export type Pagination = {
  previous_page: number | null;
  current_page: number;
  next_page: number | null;
  count: number;
  limit: number;
  total_pages: number;
  total_count: number;
};

export const Pagination = z.object({
  previous_page: z.number().nullable(),
  current_page: z.number(),
  next_page: z.number().nullable(),
  count: z.number(),
  limit: z.number(),
  total_pages: z.number(),
  total_count: z.number(),
});
export const Campaign = z.object({
  id: z.string().uuid().describe("The unique identifier of the campaign."),
  created_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the campaign was created."),
  updated_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the campaign was last updated."),
  name: z.string().describe("The name of the campaign."),
  url: z.string().url().describe("The URL associated with the campaign."),
  private: z.boolean().describe("Indicates if the campaign is private."),
  private_tokens: z
    .boolean()
    .describe("Indicates if the campaign uses private tokens."),
  commission_amount_cents: z
    .number()
    .describe("The fixed commission amount in cents, if applicable.")
    .nullish(),
  commission_amount_currency: z
    .string()
    .describe("The currency for the fixed commission amount.")
    .nullish(),
  minimum_payout_cents: z
    .number()
    .int()
    .describe("The minimum payout amount in cents."),
  max_commission_period_months: z
    .number()
    .describe(
      "The maximum period in months for commissions to be paid, if applicable."
    )
    .nullish(),
  max_commissions: z
    .number()
    .describe(
      "The maximum number of commissions allowed for the campaign, if applicable."
    )
    .nullish(),
  days_before_referrals_expire: z
    .number()
    .int()
    .describe("Number of days before referrals expire."),
  days_until_commissions_are_due: z
    .number()
    .int()
    .describe("Number of days until commissions become due."),
  affiliate_dashboard_text: z
    .string()
    .describe("Text displayed on the affiliate dashboard for this campaign."),
  custom_reward_description: z
    .string()
    .describe(
      "Custom description for the reward associated with the campaign."
    ),
  welcome_text: z
    .string()
    .describe("Welcome text for affiliates in the campaign."),
  customers_visible_to_affiliates: z
    .boolean()
    .describe("Indicates if customers are visible to affiliates."),
  sale_description_visible_to_affiliates: z
    .boolean()
    .describe("Indicates if the sale description is visible to affiliates."),
  parameter_type: z
    .enum(["query", "hash", "path"])
    .describe("Parameter type used by the campaign."),
  stripe_coupon_id: z
    .string()
    .describe(
      "The Stripe coupon ID associated with the campaign, if applicable."
    )
    .nullish(),
  default: z.boolean().describe("Indicates if this is the default campaign."),
  reward_type: z
    .enum(["percent", "flat"])
    .describe(
      "Type of reward for the campaign, either a percentage or a flat amount."
    ),
  commission_percent: z
    .number()
    .describe("Commission percentage if the reward type is 'percent'.")
    .nullish(),
  minimum_payout_currency: z
    .string()
    .describe("Currency for the minimum payout amount."),
  visitors: z
    .number()
    .int()
    .describe("The number of visitors associated with the campaign."),
  leads: z
    .number()
    .int()
    .describe("The number of leads generated by the campaign."),
  conversions: z
    .number()
    .int()
    .describe("The number of conversions generated by the campaign."),
  affiliates: z
    .number()
    .int()
    .describe("The number of affiliates participating in the campaign."),
});
export const Link = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  token: z.string(),
  visitors: z.number().int(),
  leads: z.number().int(),
  conversions: z.number().int(),
});
export const Coupon = z.object({
  id: z.string().uuid(),
  external_id: z.string(),
  token: z.string(),
  leads: z.number().int(),
  conversions: z.number().int(),
  affiliate_id: z.string().uuid(),
});
export const Affiliate = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  paypal_email: z.string().email().nullable(),
  state: z.enum(["active", "inactive"]),
  stripe_customer_id: z.string().nullish(),
  stripe_account_id: z.string().nullish(),
  visitors: z.number().int(),
  leads: z.number().int(),
  conversions: z.number().int(),
  campaign: Campaign.nullish(),
  links: z.array(Link).optional(),
  coupon: Coupon.nullish(),
});
export const id = z.string().uuid();
export const affiliate_id = z.string().uuid().optional();
export const page = z.number().optional();
export const limit = z.number().optional();
export const Customer = z.object({
  id: z
    .string()
    .describe("The unique identifier for the customer on the platform."),
  name: z.string().describe("The customer's full name."),
  email: z.string().email().describe("The customer's email address."),
  platform: z
    .string()
    .describe("The platform associated with this customer (e.g., Stripe)."),
});
export const Referral = z.object({
  id: z.string().uuid().describe("The unique identifier for the referral."),
  link: Link,
  visits: z
    .number()
    .int()
    .describe("The number of visits generated by the referral."),
  customer: Customer,
  affiliate: Affiliate,
  created_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the referral was created."),
  became_lead_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the referral became a lead.")
    .nullable(),
  became_conversion_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the referral became a conversion.")
    .nullable(),
  expires_at: z
    .string()
    .datetime({ offset: true })
    .describe("Expiration timestamp of the referral.")
    .nullable(),
  updated_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the referral was last updated."),
  deactivated_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the referral was deactivated, if applicable.")
    .nullable(),
  conversion_state: z
    .enum(["conversion", "lead", "visitor"])
    .describe(
      "The current state of the referral, indicating if it is a conversion, lead, or visitor."
    ),
  stripe_account_id: z
    .string()
    .describe("The Stripe account ID associated with the referral.")
    .nullable(),
  stripe_customer_id: z
    .string()
    .describe("The Stripe customer ID associated with the referral.")
    .nullable(),
});
export const ErrorResponse = z.object({
  error: z.string().describe("Description of the error."),
});
