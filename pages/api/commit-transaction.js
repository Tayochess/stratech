import { getToken } from 'next-auth/jwt';
import { sequelize, Transaction, Wallet } from '../../models';

export const dynamic = 'force-dynamic';

export default async function handler(req, res) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    if (!token) {
        return res.status(401).json({ message: 'User is not authenticated' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const transaction = await sequelize.transaction();

    try {
        const { fromWalletId, toWalletId, sum, transfer } = req.body;

        const toWallet = await Wallet.findByPk(toWalletId);
        if (!toWallet) {
            throw new Error('Target wallet not found');
        }

        if (fromWalletId) {
            const fromWallet = await Wallet.findByPk(fromWalletId);
            if (!fromWallet) {
                throw new Error('Source wallet not found');
            }

            if (fromWallet.balance < sum) {
                throw new Error('Insufficient funds');
            }

            fromWallet.balance -= sum;
            await fromWallet.save({ transaction });
        }

        toWallet.balance += sum;
        await toWallet.save({ transaction });

        await Transaction.create({
            fromWalletId,
            toWalletId,
            sum,
            transfer,
        }, { transaction });

        await transaction.commit();

        return res.status(201).json({ message: 'Transaction successful', sum: sum });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
