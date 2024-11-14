import { createRewardfulClient } from "../src";
import nock from "nock";

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
                .query({ expand: "campaign" })
                .reply(200, mockResponse);

            const affiliates = await api.getAffiliates({
                queries: { expand: "campaign" },
            });

            expect(affiliates.data).toBeDefined();
            expect(affiliates.data.length).toBeGreaterThan(0);
            expect(affiliates.data[0].first_name).toBe("John");
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
                params: { id: "7da3be64-90d2-48cf-abad-2aeb173ee24a" },
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
                    params: { id: "7da3be64-90d2-48cf-abad-2aeb173ee24a" },
                }
            );

            expect(affiliate).toBeDefined();
            expect(affiliate.first_name).toBe("NewFirst");
            expect(affiliate.email).toBe("new.email@example.com");
        });
    });
});
