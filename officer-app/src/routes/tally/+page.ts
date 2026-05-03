import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
    return {
        province: url.searchParams.get('province'),
        city: url.searchParams.get('city'),
    };
};