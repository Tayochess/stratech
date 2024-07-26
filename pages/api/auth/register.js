import { User } from '../../../models';

export const dynamic = 'force-dynamic';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { email, password } = req.body;

        const user = await User.create({ email, password });

        return res.status(201).json({ ok: true });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

