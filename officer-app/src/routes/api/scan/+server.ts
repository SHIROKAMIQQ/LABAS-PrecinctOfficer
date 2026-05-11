import { json } from '@sveltejs/kit';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { readFile, unlink } from 'fs/promises';
import { PUBLIC_API_IP, PUBLIC_API_PORT, NAPS2_ } from '$env/static/public';
import { NAPS2_PATH, NAPS2_DRIVER, NAPS2_DEVICE, NAPS2_SOURCE } from '$env/static/private';

const execFileAsync = promisify(execFile);

export async function POST({ request }) {
    const { uin } = await request.json();
    const tmp = `/tmp/ballot_${uin}.png`;

    try {
        await execFileAsync(NAPS2_PATH, [
            'console', '-o', tmp, '-f',
            '--noprofile', '--driver', NAPS2_DRIVER,
            '--device', NAPS2_DEVICE, '--source', NAPS2_SOURCE,
        ]);

        const imageBytes = await readFile(tmp);
        const base64 = imageBytes.toString('base64');
        await unlink(tmp);

        const response = await fetch(`http://${PUBLIC_API_IP}:${PUBLIC_API_PORT}/scan-ballot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uin, image: base64 }),
        });

        return json(await response.json());
    } catch (e) {
        console.error(e);
        return json({ detail: String(e) }, { status: 500 });
    }
}