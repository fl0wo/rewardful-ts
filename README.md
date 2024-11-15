# Rewardful API SDK for TypeScript

An unofficial TypeScript SDK for the Rewardful API, providing a streamlined and type-safe interface to interact with Rewardful's resources.

Built with [Zod & OpenAPI](https://github.com/asteasolutions/zod-to-openapi) and [OpenAPI Generator](https://github.com/astahmer/openapi-zod-client).

## Installation

```bash
pnpm install rewardful-ts
```

## Feature Support
| Method                 | Implemented | Mock Tested | Live Tested |
|------------------------|-------------|-------------|-------------|
| getAffiliates          | ✅           | ✅           | ✅           |
| getAffiliatesId        | ✅           | ✅           | ✅           |
| postAffiliates         | ✅           | ✅           | ✅           |
| putAffiliatesId        | ✅           | ✅           | ✅           |
| getCampaigns           | ✅           | ✅           | ✅           |
| getCampaignsId         | ✅           | ✅           | ✅           |
| postCampaigns          | ✅           | ✅           | ✅           |
| putCampaignsId         | ✅           | ✅           | ✅           |
| getCommissions         | ✅           | ✅           | ✅           |
| getCommissionsId       | ✅           | ✅           | ✅           |
| putCommissionsId       | ✅           | ✅           | ❌           |
| getAffiliate_coupons   | ✅           | ✅           | ❌           |
| getAffiliate_couponsId | ✅           | ✅           | ❌           |
| postAffiliate_coupons  | ✅           | ✅           | ❌           |
| getAffiliate_links     | ✅           | ✅           | ❌           |
| getAffiliate_linksId   | ✅           | ✅           | ❌           |
| postAffiliate_links    | ✅           | ✅           | ❌           |
| putAffiliate_linksId   | ✅           | ✅           | ❌           |
| getPayouts             | ✅           | ✅           | ❌           |
| getPayoutsId           | ✅           | ✅           | ❌           |
| putPayoutsIdpay        | ✅           | ✅           | ❌           |
| getReferrals           | ✅           | ✅           | ❌           |



## Quick Start

```typescript
import { createRewardfulClient } from 'rewardful-ts';

const api = createRewardfulClient('my-secret-api-key');

const affiliates = await api.getAffiliates();
console.log("My affiliates", affiliates.data);
```

## API Methods

This SDK provides an intuitive way to access Rewardful resources, categorized by endpoint:

### Affiliates

**List Affiliates:**
```typescript
const affiliates = await api.getAffiliates({ queries: { expand: 'campaign' } });
```

**Get Affiliate by ID:**
```typescript
const affiliate = await api.getAffiliatesId({ params: { id: "affiliate_id" } });
```

**Create Affiliate:**
```typescript
const newAffiliate = await api.postAffiliates({
  first_name: "Jane",
  last_name: "Doe",
  email: "jane@example.com",
});
```

**Update Affiliate:**
```typescript
const updatedAffiliate = await api.putAffiliatesId(
  { first_name: "John", last_name: "Doe" },
  { params: { id: "affiliate_id" } }
);
```

### Campaigns

**List Campaigns:**
```typescript
const campaigns = await api.getCampaigns();
```

**Get Campaign by ID:**
```typescript
const campaign = await api.getCampaignsId({ params: { id: "campaign_id" } });
```

**Create Campaign:**
```typescript
const newCampaign = await api.postCampaigns({
  name: "Exclusive Campaign",
  url: "https://rewardful.com/exclusive",
  private: true,
  reward_type: "percent",
  commission_percent: 20.0,
});
```

**Update Campaign:**
```typescript
const updatedCampaign = await api.putCampaignsId(
  { name: "Updated Campaign" },
  { params: { id: "campaign_id" } }
);
```

### Commissions

**List Commissions:**
```typescript
const commissions = await api.getCommissions({ queries: { page: 1, limit: 50 } });
```

**Get Commission by ID:**
```typescript
const commission = await api.getCommissionsId({ params: { id: "commission_id" } });
```

**Mark Commission as Paid:**
```typescript
const payout = await api.putPayoutsIdpay(undefined, { params: { id: "payout_id" } });
```

**Update Commission:**
```typescript
const updatedCommission = await api.putCommissionsId(
  { paid_at: "2023-01-01T00:00:00Z" },
  { params: { id: "commission_id" } }
);
```

### Affiliate Coupons

**List Affiliate Coupons:**
```typescript
const coupons = await api.getAffiliate_coupons();
```

**Get Affiliate Coupon by ID:**
```typescript
const coupon = await api.getAffiliate_couponsId({ params: { id: "coupon_id" } });
```

**Create Affiliate Coupon:**
```typescript
const newCoupon = await api.postAffiliate_coupons({
  affiliate_id: "affiliate_id",
  token: "NEWCODE",
});
```

### Affiliate Links

**List Affiliate Links:**
```typescript
const links = await api.getAffiliate_links();
```

**Get Affiliate Link by ID:**
```typescript
const link = await api.getAffiliate_linksId({ params: { id: "link_id" } });
```

**Create Affiliate Link:**
```typescript
const newLink = await api.postAffiliate_links({
  affiliate_id: "affiliate_id",
  token: "mylinktoken",
});
```

**Update Affiliate Link:**
```typescript
const updatedLink = await api.putAffiliate_linksId(
  { token: "new-token" },
  { params: { id: "link_id" } }
);
```

### Payouts

**List Payouts:**
```typescript
const payouts = await api.getPayouts({ queries: { expand: ["affiliate", "commissions"] } });
```

**Get Payout by ID:**
```typescript
const payout = await api.getPayoutsId({ params: { id: "payout_id" } });
```

**Mark Payout as Paid:**
```typescript
const markedPayout = await api.putPayoutsIdpay(undefined, { params: { id: "payout_id" } });
```

### Referrals

**List Referrals:**
```typescript
const referrals = await api.getReferrals({ queries: { expand: ["affiliate"], page: 1 } });
```

## Testing

This SDK includes comprehensive unit tests using mocked responses to ensure reliable functionality.

To run the tests:

```bash
pnpm test
```

Tests are structured to verify each API endpoint, simulating responses to ensure consistency with expected API behavior.

## License

MIT License