import { json } from '@sveltejs/kit';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function POST() {
    try {
        await execFileAsync('lpstat', ['-v']);
        return json({ ok: true });
    } catch (e) {
        console.error(e);
        return json({ ok: false });
    }
}