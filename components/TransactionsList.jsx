import { useEffect, useState } from 'react';

const TransactionsList = ({ session, walletId, onClose }) => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch(`/api/get-transactions?walletId=${walletId || ''}&page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(prevTransactions => [
                        ...prevTransactions,
                        ...data.transactions,
                    ]);
                    setTotal(data.total);
                } else {
                    const errorData = await res.json();
                    setError('Failed to fetch transactions');
                }
            } catch (error) {
                setError('Failed to fetch transactions');
            }
        };

        fetchTransactions();
    }, [walletId, page, session.accessToken]);

    return (
        <div className="modal">
            <div className='modal__header'>
                <h2 className='subtitle modal__title'>Transactions</h2>
                <button className='button round' onClick={onClose} aria-label='Back'>x</button>
            </div>

            <ul className='list'>
                {transactions.map((transaction, index) => (
                    <li className='list__item transaction' key={index}>
                        <div className='transaction__heading'>
                            <div className='transaction__currency'>
                                Wallet {transaction.currency}
                            </div>
                            {transaction.transfer && (
                                <div className='transaction__receiver'>
                                    to {transaction.toUserEmail}
                                </div>
                            )}
                        </div>
                        <div className={`transaction__sum ${transaction.transfer ? 'red' : 'green'}`}>{(transaction.transfer ? '-' : '+') + transaction.sum}</div>
                    </li>
                ))}
            </ul>

            <button
                className='button large'
                onClick={() => setPage(page + 1)}
                disabled={itemsPerPage * page >= total}
            >
                Show more
            </button>

            {error && <div className='message error'>{error}</div>}
        </div>
    );
};

export default TransactionsList;
