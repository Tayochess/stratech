import { getToken } from 'next-auth/jwt';
import { User, Wallet } from '../../models';
import { Op } from 'sequelize';

export const dynamic = 'force-dynamic';

export default async function handler(req, res) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    if (!token) {
        return res.status(401).json({ message: 'User is not authenticated' });
    }

    const { currency, email } = req.query;

    try {
        const users = await User.findAll({
            where: {
                email: { [Op.like]: `%${email}%` },
                id: { [Op.ne]: token.id },
            },
            include: {
                model: Wallet,
                as: 'wallets',
                where: { currency },
            },
        });

        return res.status(200).json(users.map(user => ({
            id: user.id,
            email: user.email,
            walletId: user.wallets[0].id,
        })));
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
