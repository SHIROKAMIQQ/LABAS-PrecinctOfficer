import { getTally } from '$lib/ballot_data';
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
