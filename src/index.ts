import {Zodios} from "@zodios/core";
import {endpoints as affiliateEndpoints} from "./client/Affiliate";
import {endpoints as affiliateLinkEndpoints} from "./client/AffiliateLink";
import {endpoints as affiliateCouponEndpoints} from "./client/AffiliateCoupon";
import {endpoints as campaignEndpoints} from "./client/Campaign";
import {endpoints as commissionEndpoints} from "./client/Commission";
import {endpoints as payoutEndpoints} from "./client/Payout";
import {endpoints as referralEndpoints} from "./client/Referral";


export function createRewardfulClient(
    secret:string,
) {
    const auth = 'Basic ' + Buffer.from(secret + ':' + '').toString('base64');

    const baseUrl ="https://api.getrewardful.com/v1";
    const options = {
        axiosConfig: {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    };

    // FIXME: I'm forced to do this, as mergeApi does not support "single join point" api
    // instead mergeApi is designed to map different api creating a new root one, and
    // each other api is a sub api of the root one with a "named branch"
    const api = [
        ...affiliateEndpoints,
        ...affiliateLinkEndpoints,
        ...affiliateCouponEndpoints,
        ...campaignEndpoints,
        ...commissionEndpoints,
        ...payoutEndpoints,
        ...referralEndpoints
    ];

    return new Zodios(
        baseUrl,
        api,
        options
    );
}