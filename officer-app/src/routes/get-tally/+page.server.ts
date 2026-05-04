import { parse } from 'valibot';
import { GetTallyResultSchema } from '$lib/types';
import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
    const province = url.searchParams.get('province');
    const city = url.searchParams.get('city');

    const params = new URLSearchParams('');
    if (province !== null) params.set('province', province);
    if (city !== null) params.set('city', city);
    
    const data = await getTally(fetch, params);
    return { data };
};

// for fetching tally data
async function getTally(fetchFn: typeof fetch, params: URLSearchParams) {
    const response = await fetchFn(
        `http://${PUBLIC_API_IP}:${PUBLIC_API_PORT}/get-tally?${params}`,
    );
    
    if (!response.ok) throw error(response.status, response.statusText);

    parse(GetTallyResultSchema, JSON.parse(await response.text()));
}