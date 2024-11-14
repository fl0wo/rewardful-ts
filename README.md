# Rewardful API SDK for TypeScript

Unofficial Rewardful wrap library generated using [Zod & OpenAI](https://github.com/asteasolutions/zod-to-openapi) with 
[OpenAPI Generator](https://github.com/astahmer/openapi-zod-client) to interact with the [Rewardful API](https://www.rewardful.com/).


## Quick start
```typescript
import { createRewardfulClient } from 'rewardful-ts';

const api = createRewardfulClient(
    'my secret'
);

const affiliates = await api.getAffiliates();

console.log("My affiliates", affiliates.data);
```

## Installation

```bash
pnpm install rewardful-ts
```

## 