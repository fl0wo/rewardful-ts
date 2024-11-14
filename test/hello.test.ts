// import {createRewardfulClient} from "../src";
// // @ts-ignore
// import {rewardfullSecret} from "../secret";
//
// describe('Live tests', () => {
//
//     it('list affiliates', async () => {
//         const api = createRewardfulClient(
//             rewardfullSecret
//         );
//         const affiliates = await api
//             .getAffiliates({
//                 queries: {
//                     expand: 'campaign',
//                 },
//             });
//
//         console.log("My affiliates:", affiliates.data);
//
//         expect(affiliates.data).toBeDefined();
//     });
//
//     it('get affiliate', async () => {
//         const api = createRewardfulClient(
//             rewardfullSecret
//         );
//         const affiliate = await api
//             .getAffiliatesId({
//                 params: {
//                     id: "7da3be64-90d2-48cf-abad-2aeb173ee24a",
//                 }
//             });
//
//         console.log("My affiliate:", affiliate);
//
//         expect(affiliate).toBeDefined();
//     });
//
//     it.skip('create affiliate', async () => {
//         const api = createRewardfulClient(
//             rewardfullSecret
//         );
//
//         const affiliate = await api
//             .postAffiliates({
//                 // 920cdc99-e4cc-4a7c-b79e-2a65c918de1c
//                 email: "don@joe.com",
//                 first_name: "Don",
//                 last_name: "Joe",
//
//                 // Stripe customer cus_ABCDEF123456 not found in account
//                 // stripe_customer_id: "cus_ABCDEF123456",
//             });
//
//         console.log("My affiliate:", affiliate);
//
//         expect(affiliate).toBeDefined();
//     });
//
//     it('update affiliate', async () => {
//         const api = createRewardfulClient(
//             rewardfullSecret
//         );
//
//         const affiliate = await api
//             .putAffiliatesId(
//                 {
//                     email: "newjoe@doe.com",
//                     first_name: "NewJoe",
//                     last_name: "Doe",
//                 },
//                 {
//                     params: {
//                         id: "7da3be64-90d2-48cf-abad-2aeb173ee24a",
//                     }
//                 }
//             );
//
//         console.log("My affiliate:", affiliate);
//
//         expect(affiliate).toBeDefined();
//     });
//
// });

describe('ok', () => {
    it('ok', () => {
        expect(1).toBe(1);
    });
});