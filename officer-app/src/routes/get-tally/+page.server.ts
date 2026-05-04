import { parse } from 'valibot';
import { GetTallyResultSchema } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
    const province = url.searchParams.get('province');
    const city = url.searchParams.get('city');

    try {
        const data = await getTally(fetch, province || '', city || '');
        return { data };
    } catch (e) {
        console.error(`getTally failed with error: ${e}`);
        return { data: null };
    }
};

// for fetching tally data
async function getTally(fetchFn: typeof fetch, province: string, city: string) {
    const response = await fetchFn(
        `http://165.245.190.93:8000/get-tally?province=${province}&city=${city}`,
    );
    parse(GetTallyResultSchema, JSON.parse(await response.text()));
}