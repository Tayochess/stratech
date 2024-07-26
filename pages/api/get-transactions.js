import { getToken } from 'next-auth/jwt';
import { Transaction, Wallet, User } from '../../models';
import { Op } from 'sequelize';

export const dynamic = 'force-dynamic';

export default async function handler(req, res) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    if (!token) {
        return res.status(401).json({ message: 'User is not authenticated' });
    }

    const { walletId, page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        let transactions;
        if (walletId) {
            transactions = await Transaction.findAndCountAll({
                where: {
                    [Op.or]: [
                        { fromWalletId: walletId },
                        { toWalletId: walletId },
                    ],
                },
                include: [
                    { model: Wallet, as: 'fromWallet', include: { model: User, as: 'user' } },
                    { model: Wallet, as: 'toWallet', include: { model: User, as: 'user' } },
                ],
                limit,
                offset,
                distinct: true,
            });
        } else {
            const wallets = await Wallet.findAll({
                where: { userId: token.id },
                attributes: ['id'],
            });

            const walletIds = wallets.map(wallet => wallet.id);

            transactions = await Transaction.findAndCountAll({
                where: {
                    [Op.or]: [
                        { fromWalletId: { [Op.in]: walletIds } },
                        { toWalletId: { [Op.in]: walletIds } },
                    ],
                },
                include: [
                    { model: Wallet, as: 'fromWallet', include: { model: User, as: 'user' } },
                    { model: Wallet, as: 'toWallet', include: { model: User, as: 'user' } },
                ],
                limit,
                offset,
                distinct: true,
            });
        }

        const formattedTransactions = transactions.rows.map((transaction) => ({
            id: transaction.id,
            sum: transaction.sum,
            transfer: transaction.transfer,
            currency: transaction.fromWallet ? transaction.fromWallet.currency : transaction.toWallet.currency,
            toUserEmail: transaction.toWallet ? transaction.toWallet.user.email : null,
        }));

        return res.status(200).json({ transactions: formattedTransactions, total: transactions.count });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
