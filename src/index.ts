import {createApiClient} from "./client";

export function createRewardfulClient(
    secret:string,
) {
    const auth = 'Basic ' + Buffer.from(secret + ':' + '').toString('base64');

    // FIXME: body might need some tweeks // body: new URLSearchParams(body)
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