import {createRewardfulClient} from "../src";
import nock from "nock";
import {
    aCommission,
    aCommissionItem, aCustumer,
    aCoupon,
    aLink,
    anAffiliate,
    aPayout,
    aReferral
} from "../src/mock/client.mock.data";
import {RewardfulCommission} from "../src/schemas/commission/schema";
import {RewardfulPayout} from "../src/schemas/payout/schema";

describe("Mocked Affiliate Tests", () => {

    const api = createRewardfulClient("mock-secret");

    describe("affiliates", () => {

        it("list affiliates with mocked response", async () => {
            const mockResponse = {
                data: [
                    {
                        id: "7da3be64-90d2-48cf-abad-2aeb173ee24a",
                        paypal_email: "john.doe@example.com",
                        created_at: "2023-01-01T12:00:00Z",
                        updated_at: "2023-01-01T12:00:00Z",
                        first_name: "John",
                        last_name: "Doe",
                        email: "john.doe@example.com",
                        state: "active",
                        visitors: 100,
                        leads: 42,
                        conversions: 18,
                    },
                ],
                pagination: {
                    previous_page: null,
                    current_page: 1,
                    total_pages: 1,
                    next_page: null,
                    total_count: 1,
                    count: 1,
                    limit: 25,
                },
            };

            nock("https://api.getrewardful.com")
                .get("/v1/affiliates")
                .query({expand: "campaign"})
                .reply(200, mockResponse);


            const {data} = await api.getAffiliates({
                queries: {expand: "campaign"},
            });

            expect(data).toBeDefined();
            expect(data?.length).toBeGreaterThan(0);
            expect(data?.[0].first_name).toBe("John");
        });

        it("get a single affiliate", async () => {
            const mockAffiliate = {
                id: "7da3be64-90d2-48cf-abad-2aeb173ee24a",
                first_name: "Jane",
                last_name: "Smith",
                email: "jane.smith@example.com",
                state: "active",

                visitors: 200,
                leads: 50,
                conversions: 20,

                created_at: "2023-01-01T12:00:00Z",
                updated_at: "2023-01-01T12:00:00Z",
                paypal_email: "example@gmail.com"
            };

            nock("https://api.getrewardful.com")
                .get("/v1/affiliates/7da3be64-90d2-48cf-abad-2aeb173ee24a")
                .reply(200, mockAffiliate);

            const affiliate = await api.getAffiliatesId({
                params: {id: "7da3be64-90d2-48cf-abad-2aeb173ee24a"},
            });

            expect(affiliate).toBeDefined();
            expect(affiliate.first_name).toBe("Jane");
            expect(affiliate.email).toBe("jane.smith@example.com");
        });

        it("create a new affiliate", async () => {
            const mockAffiliate = {
                id: "8bc3be64-90d2-48cf-abad-2aeb173ee29b",
                first_name: "James",
                last_name: "Bond",
                email: "jb007@mi6.co.uk",
                state: "active",

                visitors: 200,
                leads: 50,
                conversions: 20,

                created_at: "2023-01-01T12:00:00Z",
                updated_at: "2023-01-01T12:00:00Z",
                paypal_email: "example@gmail.com"
            };

            nock("https://api.getrewardful.com")
                .post("/v1/affiliates", {
                    first_name: "James",
                    last_name: "Bond",
                    email: "jb007@mi6.co.uk",
                    token: "jb007",
                })
                .reply(201, mockAffiliate);

            const affiliate = await api.postAffiliates({
                first_name: "James",
                last_name: "Bond",
                email: "jb007@mi6.co.uk",
                token: "jb007",
            });

            expect(affiliate).toBeDefined();
            expect(affiliate.first_name).toBe("James");
            expect(affiliate.email).toBe("jb007@mi6.co.uk");
        });

        it("update an existing affiliate", async () => {
            const mockUpdatedAffiliate = {
                id: "7da3be64-90d2-48cf-abad-2aeb173ee24a",
                first_name: "NewFirst",
                last_name: "NewLast",
                email: "new.email@example.com",
                state: "active",

                visitors: 200,
                leads: 50,
                conversions: 20,

                created_at: "2023-01-01T12:00:00Z",
                updated_at: "2023-01-01T12:00:00Z",
                paypal_email: "example@gmail.com"
            };

            nock("https://api.getrewardful.com")
                .put("/v1/affiliates/7da3be64-90d2-48cf-abad-2aeb173ee24a", {
                    first_name: "NewFirst",
                    last_name: "NewLast",
                    email: "new.email@example.com",
                })
                .reply(200, mockUpdatedAffiliate);

            const affiliate = await api.putAffiliatesId(
                {
                    first_name: "NewFirst",
                    last_name: "NewLast",
                    email: "new.email@example.com",
                },
                {
                    params: {id: "7da3be64-90d2-48cf-abad-2aeb173ee24a"},
                }
            );

            expect(affiliate).toBeDefined();
            expect(affiliate.first_name).toBe("NewFirst");
            expect(affiliate.email).toBe("new.email@example.com");
        });
    });

    describe("campaigns", () => {

        it("list campaigns with mocked response", async () => {
            const mockResponse = {
                data: [
                    {
                        id: "ceaef6d9-767e-49aa-a6ab-46c02aa79604",
                        name: "Best Friends of Rewardful",
                        url: "https://rewardful.com/",
                        private: false,
                        reward_type: "percent",
                        commission_percent: 30.0,
                        minimum_payout_cents: 0,
                        days_before_referrals_expire: 30,
                        days_until_commissions_are_due: 30,
                        created_at: "2021-11-24T06:31:06.672Z",
                        updated_at: "2022-02-22T23:17:55.119Z",
                        visitors: 150,
                        leads: 39,
                        conversions: 7,
                        affiliates: 12,

                        private_tokens: true,
                        affiliate_dashboard_text: '',
                        custom_reward_description: '',
                        welcome_text: '',
                        customers_visible_to_affiliates: false,
                        sale_description_visible_to_affiliates: false,
                        parameter_type: 'query',
                        minimum_payout_currency: 'USD',
                        default: true,
                    },
                ],
                pagination: {
                    previous_page: null,
                    current_page: 1,
                    total_pages: 1,
                    next_page: null,
                    total_count: 1,
                    count: 1,
                    limit: 25,
                },
            };

            nock("https://api.getrewardful.com")
                .get("/v1/campaigns")
                .reply(200, mockResponse);

            const {data} = await api.getCampaigns();

            expect(data).toBeDefined();
            expect(data?.length).toBeGreaterThan(0);
            expect(data?.[0].name).toBe("Best Friends of Rewardful");
            expect(data?.[0].url).toBe("https://rewardful.com/");
        });

        it("get a single campaign", async () => {
            const mockCampaign = {
                id: "ceaef6d9-767e-49aa-a6ab-46c02aa79604",
                name: "Special Friends of Rewardful",
                url: "https://rewardful.com/special",
                private: true,
                reward_type: "percent",
                commission_percent: 50.0,
                minimum_payout_cents: 1000,
                days_before_referrals_expire: 30,
                days_until_commissions_are_due: 30,
                created_at: "2021-11-24T06:31:06.672Z",
                updated_at: "2022-02-22T23:17:55.119Z",
                visitors: 200,
                leads: 60,
                conversions: 10,
                affiliates: 15,
                private_tokens: true,
                affiliate_dashboard_text: '',
                custom_reward_description: '',
                welcome_text: '',
                customers_visible_to_affiliates: false,
                sale_description_visible_to_affiliates: false,
                parameter_type: 'query',
                minimum_payout_currency: 'USD',
                default: true,
            };

            nock("https://api.getrewardful.com")
                .get("/v1/campaigns/ceaef6d9-767e-49aa-a6ab-46c02aa79604")
                .reply(200, mockCampaign);

            const campaign = await api.getCampaignsId({
                params: {id: "ceaef6d9-767e-49aa-a6ab-46c02aa79604"},
            });

            expect(campaign).toBeDefined();
            expect(campaign?.name).toBe("Special Friends of Rewardful");
            expect(campaign?.url).toBe("https://rewardful.com/special");
        });

        it("create a new campaign", async () => {
            const mockNewCampaign = {
                id: "d1b345f7-ae9a-4bd5-b8c3-67f9c6731f85",
                name: "Exclusive Rewardful Campaign",
                url: "https://rewardful.com/exclusive",
                private: true,
                reward_type: "flat",
                commission_percent: null,
                minimum_payout_cents: 5000,
                days_before_referrals_expire: 45,
                days_until_commissions_are_due: 30,
                created_at: "2023-01-01T12:00:00Z",
                updated_at: "2023-01-01T12:00:00Z",
                visitors: 0,
                leads: 0,
                conversions: 0,
                affiliates: 0,

                private_tokens: true,
                affiliate_dashboard_text: '',
                custom_reward_description: '',
                welcome_text: '',
                customers_visible_to_affiliates: false,
                sale_description_visible_to_affiliates: false,
                parameter_type: 'query',
                minimum_payout_currency: 'USD',
                default: true,
            };

            nock("https://api.getrewardful.com")
                .post("/v1/campaigns", {
                    name: "Exclusive Rewardful Campaign",
                    url: "https://rewardful.com/exclusive",
                    private: true,
                    reward_type: "flat",
                    minimum_payout_cents: 5000,
                })
                .reply(201, mockNewCampaign);

            const campaign = await api.postCampaigns({
                name: "Exclusive Rewardful Campaign",
                url: "https://rewardful.com/exclusive",
                private: true,
                reward_type: "flat",
                minimum_payout_cents: 5000,
            });

            expect(campaign).toBeDefined();
            expect(campaign?.name).toBe("Exclusive Rewardful Campaign");
            expect(campaign?.url).toBe("https://rewardful.com/exclusive");
            expect(campaign?.private).toBe(true);
        });

        it("update an existing campaign", async () => {
            const mockUpdatedCampaign = {
                id: "ceaef6d9-767e-49aa-a6ab-46c02aa79604",
                name: "Updated Campaign Name",
                url: "https://rewardful.com/updated",
                private: false,
                reward_type: "percent",
                commission_percent: 25.0,
                minimum_payout_cents: 2000,
                days_before_referrals_expire: 30,
                days_until_commissions_are_due: 30,
                created_at: "2021-11-24T06:31:06.672Z",
                updated_at: "2023-02-10T14:00:00Z",
                visitors: 250,
                leads: 80,
                conversions: 15,
                affiliates: 20,

                private_tokens: true,
                affiliate_dashboard_text: '',
                custom_reward_description: '',
                welcome_text: '',
                customers_visible_to_affiliates: false,
                sale_description_visible_to_affiliates: false,
                parameter_type: 'query',
                minimum_payout_currency: 'USD',
                default: true,
            };

            nock("https://api.getrewardful.com")
                .put("/v1/campaigns/ceaef6d9-767e-49aa-a6ab-46c02aa79604", {
                    name: "Updated Campaign Name",
                    minimum_payout_cents: 2000,
                })
                .reply(200, mockUpdatedCampaign);

            const campaign = await api.putCampaignsId(
                {
                    name: "Updated Campaign Name",
                    minimum_payout_cents: 2000,
                },
                {
                    params: {id: "ceaef6d9-767e-49aa-a6ab-46c02aa79604"},
                }
            );

            expect(campaign).toBeDefined();
            expect(campaign?.name).toBe("Updated Campaign Name");
            expect(campaign?.minimum_payout_cents).toBe(2000);
            expect(campaign?.updated_at).toBe("2023-02-10T14:00:00Z");
        });
    });

    describe("commissions", () => {

        it("list commissions with mocked response", async () => {
            const mockResponse = {
                data: [
                    {
                        ...aCommission,
                        id: "39e68c88-d84a-4510-b3b4-43c75016a080",
                        currency: "USD",
                        amount: 3000,

                    },
                ],
                pagination: {
                    previous_page: null,
                    current_page: 1,
                    next_page: null,
                    count: 1,
                    limit: 25,
                    total_pages: 1,
                    total_count: 1,
                },
            };

            nock("https://api.getrewardful.com")
                .get("/v1/commissions")
                .query({})
                .reply(200, mockResponse);

            const {data} = await api.getCommissions();

            expect(data).toBeDefined();
            expect(data?.length).toBeGreaterThan(0);
            expect(data?.[0].currency).toBe("USD");
            expect(data?.[0].amount).toBe(3000);
        });

        it("get a single commission", async () => {
            const mockCommission: RewardfulCommission = {
                ...aCommission,
                id: "39e68c88-d84a-4510-b3b4-43c75016a080",
                currency: "USD",
                amount: 3000,

            };

            nock("https://api.getrewardful.com")
                .get("/v1/commissions/39e68c88-d84a-4510-b3b4-43c75016a080")
                .reply(200, mockCommission);

            const commission = await api.getCommissionsId({
                params: {id: "39e68c88-d84a-4510-b3b4-43c75016a080"},
            });

            expect(commission).toBeDefined();
            expect(commission.currency).toBe("USD");
            expect(commission.amount).toBe(3000);
        });

        it("mark commission as paid", async () => {
            const mockPayoutResponse: RewardfulPayout = {
                ...aPayout,
                id: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca",
                state: "processing",
                commissions: [
                    {
                        ...aCommissionItem,
                        id: "3a4a775c-b660-4d7f-a733-6f259a2646a7",
                        paid_at: "2022-11-21T11:48:51.067Z",
                    },
                ]
            };

            nock("https://api.getrewardful.com")
                .put("/v1/payouts/3b03791a-3fb5-4bd6-8ec3-614c9fd978ca/pay")
                .reply(200, mockPayoutResponse);

            const payout = await api.putPayoutsIdpay(
                undefined,
                {params: {id: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca"}}
            );

            expect(payout).toBeDefined();
            expect(payout.state).toBe("processing");
            expect(payout?.commissions?.[0].paid_at).toBe("2022-11-21T11:48:51.067Z");
        });

        it("update commission due and paid date", async () => {
            const mockUpdatedCommission = {
                ...aCommission,
                id: "01342824-914a-4aee-9f42-de823a8b74e2",
                due_at: "2023-03-25T12:00:00.000Z",
                paid_at: "2023-03-20T12:00:00.000Z",
            };

            nock("https://api.getrewardful.com")
                .put("/v1/commissions/01342824-914a-4aee-9f42-de823a8b74e2")
                .reply(200, mockUpdatedCommission);

            const updatedCommission = await api.putCommissionsId(
                {due_at: "2023-03-25T12:00:00.000Z", paid_at: "2023-03-20T12:00:00.000Z"},
                {params: {id: "01342824-914a-4aee-9f42-de823a8b74e2"}}
            );

            expect(updatedCommission).toBeDefined();
            expect(updatedCommission.due_at).toBe("2023-03-25T12:00:00.000Z");
            expect(updatedCommission.paid_at).toBe("2023-03-20T12:00:00.000Z");
        });
    });

    describe("affiliate coupons", () => {

        it("list affiliate coupons with mocked response", async () => {
            const mockResponse = {
                data: [
                    {
                        ...aCoupon,
                        id: "75434e84-255b-4314-a278-820df5e76813",
                        affiliate_id: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca",
                        token: "CODE",
                    },
                ],
                pagination: {
                    previous_page: null,
                    current_page: 1,
                    next_page: null,
                    count: 1,
                    limit: 25,
                    total_pages: 1,
                    total_count: 1,
                },
            };

            nock("https://api.getrewardful.com")
                .get("/v1/affiliate_coupons")
                .reply(200, mockResponse);

            const {data} = await api.getAffiliate_coupons();

            expect(data).toBeDefined();
            expect(data?.length).toBeGreaterThan(0);
            expect(data?.[0].token).toBe("CODE");
            expect(data?.[0].affiliate_id).toBe("3b03791a-3fb5-4bd6-8ec3-614c9fd978ca");
        });

        it("get a single affiliate coupon", async () => {
            const mockCoupon = {
                ...aCoupon,
                id: "75434e84-255b-4314-a278-820df5e76813",
                affiliate_id: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca",
                token: "CODE",
            };

            nock("https://api.getrewardful.com")
                .get("/v1/affiliate_coupons/75434e84-255b-4314-a278-820df5e76813")
                .reply(200, mockCoupon);

            const coupon = await api.getAffiliate_couponsId({
                params: {id: "75434e84-255b-4314-a278-820df5e76813"},
            });

            expect(coupon).toBeDefined();
            expect(coupon.token).toBe("CODE");
            expect(coupon.affiliate_id).toBe("3b03791a-3fb5-4bd6-8ec3-614c9fd978ca");
        });

        it("create an affiliate coupon", async () => {
            const mockNewCoupon = {
                ...aCoupon,
                token: "MYCODE",
                affiliate_id: "f46a912b-08bc-4332-8771-c857e11ad9dd",
            };

            nock("https://api.getrewardful.com")
                .post("/v1/affiliate_coupons")
                .reply(201, mockNewCoupon);

            const newCoupon = await api.postAffiliate_coupons({
                affiliate_id: "f46a912b-08bc-4332-8771-c857e11ad9dd",
                token: "MYCODE",
            });

            expect(newCoupon).toBeDefined();
            expect(newCoupon.token).toBe("MYCODE");
            expect(newCoupon.affiliate_id).toBe("f46a912b-08bc-4332-8771-c857e11ad9dd");
        });

    });

    describe("affiliate links", () => {

        it("list affiliate links with mocked response", async () => {
            const mockResponse = {
                data: [
                    {
                        ...aLink,
                        id: "f46a912b-08bc-4332-8771-c857e11ad9dd",
                        affiliate_id: "aaac9869-4242-4db9-afb1-f3518ef627c5",
                        token: "luke",
                    },
                ],
                pagination: {
                    previous_page: null,
                    current_page: 1,
                    next_page: null,
                    count: 1,
                    limit: 25,
                    total_pages: 1,
                    total_count: 1,
                },
            };

            nock("https://api.getrewardful.com")
                .get("/v1/affiliate_links")
                .reply(200, mockResponse);

            const {data} = await api.getAffiliate_links();

            expect(data).toBeDefined();
            expect(data?.length).toBeGreaterThan(0);
            expect(data?.[0].token).toBe("luke");
            expect(data?.[0].affiliate_id).toBe("aaac9869-4242-4db9-afb1-f3518ef627c5");
        });

        it("get a single affiliate link", async () => {
            const mockLink = {
                ...aLink,
                id: "f46a912b-08bc-4332-8771-c857e11ad9dd",
                affiliate_id: "aaac9869-4242-4db9-afb1-f3518ef627c5",
                token: "luke",
            };

            nock("https://api.getrewardful.com")
                .get("/v1/affiliate_links/f46a912b-08bc-4332-8771-c857e11ad9dd")
                .reply(200, mockLink);

            const link = await api.getAffiliate_linksId({
                params: { id: "f46a912b-08bc-4332-8771-c857e11ad9dd" },
            });

            expect(link).toBeDefined();
            expect(link.token).toBe("luke");
            expect(link.affiliate_id).toBe("aaac9869-4242-4db9-afb1-f3518ef627c5");
        });

        it("create an affiliate link", async () => {
            const mockNewLink = {
                ...aLink,
                token: "luke-skywalker",
                affiliate_id: "f46a912b-08bc-4332-8771-c857e11ad9dd",
            };

            nock("https://api.getrewardful.com")
                .post("/v1/affiliate_links")
                .reply(201, mockNewLink);

            const newLink = await api.postAffiliate_links({
                affiliate_id: "f46a912b-08bc-4332-8771-c857e11ad9dd",
                token: "luke-skywalker",
            });

            expect(newLink).toBeDefined();
            expect(newLink.token).toBe("luke-skywalker");
            expect(newLink.affiliate_id).toBe("f46a912b-08bc-4332-8771-c857e11ad9dd");
        });

        it("update an affiliate link", async () => {
            const updatedLink = {
                ...aLink,
                token: "darth-vader",
                affiliate_id: "aaac9869-4242-4db9-afb1-f3518ef627c5",
            };

            nock("https://api.getrewardful.com")
                .put("/v1/affiliate_links/f46a912b-08bc-4332-8771-c857e11ad9dd")
                .reply(200, updatedLink);

            const link = await api.putAffiliate_linksId(
                { token: "darth-vader" },
                { params: { id: "f46a912b-08bc-4332-8771-c857e11ad9dd" } }
            );

            expect(link).toBeDefined();
            expect(link.token).toBe("darth-vader");
            expect(link.affiliate_id).toBe("aaac9869-4242-4db9-afb1-f3518ef627c5");
        });
    });

    describe("payouts", () => {

        it("list payouts with mocked response", async () => {
            const mockResponse = {
                data: [
                    {
                        ...aPayout,
                        id: "5768bd90-7953-493f-ae6c-6562eb4d7e72",
                        affiliate_id: "5768bd90-7953-493f-ae6c-6562eb4d7e72",

                        affiliate: {
                            ...anAffiliate,
                            id: "5768bd90-7953-493f-ae6c-6562eb4d7e72",
                        }
                    },
                ],
                pagination: {
                    previous_page: null,
                    current_page: 1,
                    next_page: null,
                    count: 1,
                    limit: 25,
                    total_pages: 1,
                    total_count: 1,
                },
            };

            nock("https://api.getrewardful.com")
                .get("/v1/payouts")
                .query(true) // Matches any query parameters
                .reply(200, mockResponse);

            const {data} = await api.getPayouts({
                queries: {
                    expand: ["affiliate", "commissions"],
                    page: 1,
                    limit: 25,
                },
            });

            expect(data).toBeDefined();
            expect(data?.length).toBeGreaterThan(0);
            expect(data?.[0].state).toBe("paid");
            expect(data?.[0].affiliate.id).toBe("5768bd90-7953-493f-ae6c-6562eb4d7e72");
        });

        it("get a single payout", async () => {
            const mockPayout = {
                ...aPayout,
                id: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca",
                affiliate_id: "5768bd90-7953-493f-ae6c-6562eb4d7e72",
                currency: "USD",
                amount: 1470,
                affiliate: {
                    ...anAffiliate,
                    id: "5768bd90-7953-493f-ae6c-6562eb4d7e72",
                }
            };

            nock("https://api.getrewardful.com")
                .get("/v1/payouts/3b03791a-3fb5-4bd6-8ec3-614c9fd978ca")
                .reply(200, mockPayout);

            const payout = await api.getPayoutsId({
                params: { id: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca" },
            });

            expect(payout).toBeDefined();
            expect(payout.currency).toBe("USD");
            expect(payout.amount).toBe(1470);
            expect(payout?.affiliate?.id).toBe("5768bd90-7953-493f-ae6c-6562eb4d7e72");
        });

        it("mark payout as paid", async () => {
            const mockPayoutResponse: RewardfulPayout = {
                ...aPayout,
                id: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca",
                state: "processing",
                commissions: [
                    {
                        ...aCommissionItem,
                        id: "3a4a775c-b660-4d7f-a733-6f259a2646a7",
                        paid_at: "2022-11-21T11:48:51.067Z",
                    },
                ],
            };

            nock("https://api.getrewardful.com")
                .put("/v1/payouts/3b03791a-3fb5-4bd6-8ec3-614c9fd978ca/pay")
                .reply(200, mockPayoutResponse);

            const payout = await api.putPayoutsIdpay(
                undefined,
                { params: { id: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca" } }
            );

            expect(payout).toBeDefined();
            expect(payout.state).toBe("processing");
            expect(payout?.commissions?.[0].paid_at).toBe("2022-11-21T11:48:51.067Z");
        });

    });

    describe("referrals", () => {

        it("list referrals with mocked response", async () => {
            const mockResponse = {
                data: [
                    {
                        ...aReferral,
                        id: "e523da29-6157-4aac-b4b5-05b3b7b14fb6",

                        customer: {
                            ...aCustumer,
                            name: "Fred Durst",

                        }
                    },
                ],
                pagination: {
                    previous_page: null,
                    current_page: 1,
                    next_page: null,
                    count: 1,
                    limit: 25,
                    total_pages: 1,
                    total_count: 1,
                },
            };

            nock("https://api.getrewardful.com")
                .get("/v1/referrals")
                .query(true) // Matches any query parameters
                .reply(200, mockResponse);

            const {data} = await api.getReferrals({
                queries: {
                    expand: ["affiliate"],
                    page: 1,
                    limit: 25,
                },
            });

            expect(data).toBeDefined();
            expect(data?.length).toBeGreaterThan(0);
            expect(data?.[0].conversion_state).toBe("conversion");
            expect(data?.[0].customer.name).toBe("Fred Durst");
        });

    });
});
