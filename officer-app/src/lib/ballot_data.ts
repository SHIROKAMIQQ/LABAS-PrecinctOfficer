// for fetching ballot data
export async function getData(fetchFn: typeof fetch, province: string, city: string) {
    const response = await fetchFn(
        `http://165.245.190.93:8000/ballot?province=${province}&city=${city}`,
    );

    return response.json();
}

// for Tally Component
export function getVotes(input: { name: string; vote: number }[]) {
    return input.map((item) => ({
        name: item.name,
        vote: item.vote,
    }));
}
