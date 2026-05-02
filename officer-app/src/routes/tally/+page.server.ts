import { getData } from "$lib/ballot_data";
import type { PageServerLoad } from "./national/$types";

export const load: PageServerLoad = async ({ fetch }) => {
    const data = await getData(fetch, "Metro%Manila", "City%of%Manila");
    return { data };
};
