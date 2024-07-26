import { getToken } from 'next-auth/jwt';
import { Wallet } from '../../models';

export const dynamic = 'force-dynamic';

export default async function handler(req, res) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    if (!token) {
        return res.status(401).json({ message: 'User is not authenticated' });
    }

    if (req.method === 'GET') {
        try {
            const wallets = await Wallet.findAll({ where: { userId: token.id } });
            return res.status(200).json(wallets);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { currency } = req.body;
            const wallet = await Wallet.create({ currency, balance: 0, userId: token.id });
            return res.status(201).json(wallet);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
