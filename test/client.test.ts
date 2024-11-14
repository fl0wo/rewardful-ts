import { createRewardfulClient } from "../src";
import nock from "nock";

describe("Mocked tests", () => {
    describe("affiliates", () => {
        it("list affiliates with mocked response", async () => {
            // Arrange: Set up the mock response
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
                    previous_page: 0,
                    current_page: 1,
                    total_pages: 1,
                    next_page: 2,
                    total_count: 2,
                    count: 1,
                    limit: 25,
                },
            };

            nock("https://api.getrewardful.com")
                .get("/v1/affiliates")
                .query({ expand: "campaign" })
                .reply(200, mockResponse);

            // Act: Call the SDK method
            const api = createRewardfulClient("mock-secret");
            const affiliates = await api.getAffiliates({
                queries: {
                    expand: "campaign",
                },
            });

            // Assert: Verify the response structure and data
            expect(affiliates.data).toBeDefined();
            expect(affiliates.data.length).toBeGreaterThan(0);
            expect(affiliates.data[0].first_name).toBe("John");
            expect(affiliates.data[0].email).toBe("john.doe@example.com");
        });
    });
});


