import { getData } from '$lib/ballot_data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
    const province = url.searchParams.get('province');
    const city = url.searchParams.get('city');

    const data = await getData(fetch, province || '', city || '');
    return { data };
};
