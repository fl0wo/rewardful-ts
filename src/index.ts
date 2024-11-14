import {createApiClient} from "./client";

export function createRewardfulClient(
    secret:string,
) {
    const auth = 'Basic ' + Buffer.from(secret + ':' + '').toString('base64');

    return createApiClient(
        "https://api.getrewardful.com/v1",
        {
            axiosConfig: {
                headers: {
                    'Authorization': auth,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        }
    );
}