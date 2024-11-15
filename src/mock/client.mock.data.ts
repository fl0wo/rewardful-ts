import {RewardfulCommission, RewardfulCommissionItem, RewardfulSale} from "../schemas/commission/schema";
import {RewardfulAffiliate, RewardfulCoupon, RewardfulLink} from "../schemas/affiliate/schema";
import {RewardfulCustomer, RewardfulReferral} from "../schemas/referral/schema";
import {RewardfulPayout} from "../schemas/payout/schema";

export const aDateString = "2022-10-12T14:54:52.148Z";
export const anUUID = "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca";
export const aURL = "http://www.example.com/?via=adam";
export const anEmail = "examle@gmail.com";

export const anAffiliate:RewardfulAffiliate = {
    id: anUUID,
    created_at: aDateString,
    updated_at: aDateString,
    first_name: "",
    last_name: "",
    email: anEmail,
    paypal_email: null,
    state: "active",
    visitors: 0,
    leads: 0,
    conversions: 0,
    confirmed_at: null,
    paypal_email_confirmed_at: null,
    wise_email: null,
    wise_email_confirmed_at: null,
    receive_new_commission_notifications: false,
    sign_in_count: 0,
    unconfirmed_email: null,
    stripe_customer_id: null,
    stripe_account_id: null
}

export const aCustumer:RewardfulCustomer = {
    id: anUUID,
    email: anEmail,
    name: "",
    platform: ""
}

export const aLink:RewardfulLink = {
    id: anUUID,
    url: aURL,
    token: "",
    visitors: 0,
    leads: 0,
    conversions: 0
}


export const aCoupon:RewardfulCoupon = {
    id: anUUID,
    token: "",
    leads: 0,
    conversions: 0,
    external_id: anUUID,
    affiliate_id: anUUID
}

export const aReferral:RewardfulReferral = {
    id: anUUID,
    created_at: aDateString,
    updated_at: aDateString,
    stripe_customer_id: null,
    stripe_account_id: null,
    link: {
        ...aLink
    },
    visits: 0,
    customer: {
        ...aCustumer,
        name: "Fred Durst",
        email: anEmail,
        platform: "stripe"

    },
    affiliate: {
        ...anAffiliate,
    },
    became_lead_at: null,
    became_conversion_at: null,
    expires_at: null,
    deactivated_at: null,
    conversion_state: "conversion"
}

export const aCompaign:RewardfulCommission['campaign'] = {
    default: false,
    name: "",
    id: anUUID,
    leads: 0,
    conversions: 0,
    url: aURL,
    visitors: 0,
    created_at: aDateString,
    updated_at: aDateString,
    private: false,
    private_tokens: false,
    minimum_payout_cents: 0,
    days_before_referrals_expire: 0,
    days_until_commissions_are_due: 0,
    affiliate_dashboard_text: "",
    custom_reward_description: "",
    welcome_text: "",
    customers_visible_to_affiliates: false,
    sale_description_visible_to_affiliates: false,
    parameter_type: "path",
    reward_type: "flat",
    minimum_payout_currency: "",
    affiliates: 0
}

export const aSale:RewardfulSale = {
    id: anUUID,
    created_at: aDateString,
    updated_at: aDateString,
    currency: "",
    charged_at: aDateString,
    stripe_account_id: null,
    stripe_charge_id: null,
    invoiced_at: null,
    charge_amount_cents: 0,
    refund_amount_cents: 0,
    tax_amount_cents: 0,
    sale_amount_cents: 0,
    affiliate: {
        ...anAffiliate,
    },
    referral: {
        ...aReferral,
    }
}

export const aCommission:RewardfulCommission = {
    id: anUUID,
    created_at: aDateString,
    updated_at: aDateString,
    campaign: {
        ...aCompaign
    },
    amount: 0,
    currency: "",
    due_at: null,
    paid_at: null,
    sale: {
        ...aSale
    }
}

export const aCommissionItem:RewardfulCommissionItem = {
    id: anUUID,
    created_at: aDateString,
    updated_at: aDateString,
    stripe_account_id: null,
    amount: 0,
    currency: "",
    due_at: null,
    paid_at: null
}

export const aPayout:RewardfulPayout = {
    id: anUUID,
    currency: "",
    paid_at: null,
    state: "paid",
    paid_by_id: null,
    created_at: aDateString,
    updated_at: aDateString,
    amount: 0,
    affiliate: {
        ...anAffiliate
    },
    commissions: []
}