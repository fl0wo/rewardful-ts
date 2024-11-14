import {createRewardfulClient} from "../src";
// @ts-ignore
import {rewardfullSecret} from "../secret";

describe('Live tests', () => {

    it('list affiliates', async () => {
        const api = createRewardfulClient(
            rewardfullSecret
        );
        const affiliates = await api
            .getAffiliates({
                queries: {
                    expand: 'campaign',
                },
            });

        console.log("My affiliates:", affiliates.data);

        expect(affiliates.data).toBeDefined();
    });

    it('get affiliate', async () => {
        const api = createRewardfulClient(
            rewardfullSecret
        );
        const affiliate = await api
            .getAffiliatesId({
                params: {
                    id: "7da3be64-90d2-48cf-abad-2aeb173ee24a",
                }
            });

        console.log("My affiliate:", affiliate);

        expect(affiliate).toBeDefined();
    });

});

// describe('ok', () => {
//     it('ok', () => {
//         expect(1).toBe(1);
//     });
// });