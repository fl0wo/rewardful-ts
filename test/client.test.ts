import {createRewardfulClient} from "../src";
import nock from "nock";
import {aCommission, aCommissionItem, aPayout} from "../src/mock/client.mock.data";
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
            const mockCommission:RewardfulCommission = {
                ...aCommission,
                id: "39e68c88-d84a-4510-b3b4-43c75016a080",
                currency: "USD",
                amount: 3000,

            };

            nock("https://api.getrewardful.com")
                .get("/v1/commissions/39e68c88-d84a-4510-b3b4-43c75016a080")
                .reply(200, mockCommission);

            const commission = await api.getCommissionsId({
                params: { id: "39e68c88-d84a-4510-b3b4-43c75016a080" },
            });

            expect(commission).toBeDefined();
            expect(commission.currency).toBe("USD");
            expect(commission.amount).toBe(3000);
        });

        it("mark commission as paid", async () => {
            const mockPayoutResponse:RewardfulPayout = {
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
                { params: { id: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca" } }
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
                { due_at: "2023-03-25T12:00:00.000Z", paid_at: "2023-03-20T12:00:00.000Z" },
                { params: { id: "01342824-914a-4aee-9f42-de823a8b74e2" } }
            );

            expect(updatedCommission).toBeDefined();
            expect(updatedCommission.due_at).toBe("2023-03-25T12:00:00.000Z");
            expect(updatedCommission.paid_at).toBe("2023-03-20T12:00:00.000Z");
        });
    });
});
