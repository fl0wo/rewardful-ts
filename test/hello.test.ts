// import {createRewardfulClient} from "../src";
// // @ts-ignore
// import {rewardfullSecret} from "../secret";
//
// describe('Live tests', () => {
//
//     describe('affiliates', () => {
//
//         it('list affiliates', async () => {
//             const api = createRewardfulClient(
//                 rewardfullSecret
//             );
//             const affiliates = await api
//                 .getAffiliates({
//                     queries: {
//                         expand: 'campaign',
//                     },
//                 });
//
//             console.log("My affiliates:", affiliates.data);
//
//             expect(affiliates.data).toBeDefined();
//         });
//
//         it('get affiliate', async () => {
//             const api = createRewardfulClient(
//                 rewardfullSecret
//             );
//             const affiliate = await api
//                 .getAffiliatesId({
//                     params: {
//                         id: "7da3be64-90d2-48cf-abad-2aeb173ee24a",
//                     }
//                 });
//
//             console.log("My affiliate:", affiliate);
//
//             expect(affiliate).toBeDefined();
//         });
//
//         it.skip('create affiliate', async () => {
//             const api = createRewardfulClient(
//                 rewardfullSecret
//             );
//
//             const affiliate = await api
//                 .postAffiliates({
//                     // 920cdc99-e4cc-4a7c-b79e-2a65c918de1c
//                     email: "don@joe.com",
//                     first_name: "Don",
//                     last_name: "Joe",
//
//                     // Stripe customer cus_ABCDEF123456 not found in account
//                     // stripe_customer_id: "cus_ABCDEF123456",
//                 });
//
//             console.log("My affiliate:", affiliate);
//
//             expect(affiliate).toBeDefined();
//         });
//
//         it('update affiliate', async () => {
//             const api = createRewardfulClient(
//                 rewardfullSecret
//             );
//
//             const affiliate = await api
//                 .putAffiliatesId(
//                     {
//                         email: "newjoe@doe.com",
//                         first_name: "NewJoe",
//                         last_name: "Doe",
//                     },
//                     {
//                         params: {
//                             id: "7da3be64-90d2-48cf-abad-2aeb173ee24a",
//                         }
//                     }
//                 );
//
//             console.log("My affiliate:", affiliate);
//
//             expect(affiliate).toBeDefined();
//         });
//
//         it('magic link', async () => {
//             const api = createRewardfulClient(
//                 rewardfullSecret
//             );
//
//             const magicLink = await api
//                 .getAffiliatesIdsso({
//                     params: {
//                         id: "7da3be64-90d2-48cf-abad-2aeb173ee24a",
//                     }
//                 });
//
//             console.log("My magic link:", magicLink);
//         });
//     });
//
//     describe('affiliate links', () => {
//
//         it('list links', async () => {
//
//             const api = createRewardfulClient(
//                 rewardfullSecret
//             );
//
//             const {data} = await api
//                 .getAffiliate_links();
//
//             console.log("My links:", data);
//
//             expect(data).toBeDefined();
//         });
//
//         it('get link', async () => {
//
//             const api = createRewardfulClient(
//                 rewardfullSecret
//             );
//
//             const link = await api
//                 .getAffiliate_linksId({
//                     params: {
//                         id: "392aaead-0936-47e3-a42c-fc90e1e3ac06",
//                     }
//                 });
//
//             console.log("My link:", link);
//
//             expect(link).toBeDefined();
//         });
//
//         it('create link', async () => {
//
//             const api = createRewardfulClient(
//                 rewardfullSecret
//             );
//
//             const link = await api
//                 .postAffiliate_links({
//                     token: "test-link",
//                     // my test user
//                     affiliate_id: "95a85853-6e19-4849-8239-9c8b4e7142a0"
//                 });
//
//             console.log("My link:", link);
//
//             expect(link).toBeDefined();
//
//         });
//
//         it('update link', async () => {
//
//                 const api = createRewardfulClient(
//                     rewardfullSecret
//                 );
//
//                 const link = await api
//                     .putAffiliate_linksId(
//                         {
//                             token: "new-test-link",
//                         },
//                         {
//                             params: {
//                                 id: "1d35e2ad-0d6c-4443-bda7-60a1f86e8435",
//                             }
//                         }
//                     );
//
//                 console.log("My link:", link);
//
//                 expect(link).toBeDefined();
//         });
//     });
//
//     describe('referrals', () => {
//
//         it('list referrals 1', async () => {
//
//         });
//     });
// });
//
describe('ok', () => {
    it('ok', () => {
        expect(1).toBe(1);
    });
});