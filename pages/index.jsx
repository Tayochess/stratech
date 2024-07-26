import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import WalletManager from '../components/WalletManager';
import TransactionsList from '../components/TransactionsList';

const Wallets = () => {
    const [wallets, setWallets] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [showCryptoList, setShowCryptoList] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [showTransactions, setShowTransactions] = useState(false);
    const [error, setError] = useState('');
    const { data: session, status } = useSession();
    const router = useRouter();

    const popularCryptos = [
        'Bitcoin (BTC)',
        'Ethereum (ETH)',
        'Tether (USDT)',
        'Binance Coin (BNB)',
        'USD Coin (USDC)',
        'XRP (XRP)',
        'Cardano (ADA)',
        'Solana (SOL)',
        'Dogecoin (DOGE)',
        'Polkadot (DOT)'
    ];

    useEffect(() => {
        if (!session) {
            router.push('/login');
        }
        if (status === 'loading') return;

        if (session) {
            fetchWallets();
        }
    }, [session, status, router]);

    const handleAddWallet = async (currency) => {
        const res = await fetch('/api/wallets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({ currency }),
        });

        if (res.ok) {
            const newWallet = await res.json();
            setWallets((prevWallets) => [...prevWallets, newWallet]);
            setCurrencies((prevCurrencies) => [...prevCurrencies, newWallet.currency]);
            setShowCryptoList(false);
        } else {
            setError('Failed to add wallet');
        }
    };

    const fetchWallets = async () => {
        const res = await fetch('/api/wallets', {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        });

        if (res.ok) {
            const data = await res.json();
            setWallets(data);
            setCurrencies(data.map(item => item.currency));
        } else {
            setError('Failed to fetch wallets');
        }
    };

    const openCryptoList = () => {
        setShowCryptoList(true);
        setShowTransactions(false);
    };

    const openTransactions = () => {
        setShowCryptoList(false);
        setShowTransactions(true);
    };

    if (status === 'loading') return <p>Loading...</p>;

    return (
        <div>
            <h1 className='title'>Wallets</h1>
            <div className='wrapper'>
                {wallets?.length > 0 ? (
                    <ul className='list'>
                        {wallets.map((wallet) => (
                            <li className='list__item wallet' key={wallet.id} onClick={() => setSelectedWallet(wallet)}>
                                <div className='wallet__currency'>{wallet.currency}</div>
                                <div className='wallet__balance'>{wallet.balance}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className='notification'>No wallets yet</div>
                )}
            </div>

            <div className='row'>
                <button className='row__item button' onClick={openCryptoList}>
                    Add Wallet
                </button>
                <button className='row__item button' onClick={openTransactions}>
                    Transactions
                </button>
            </div>

            {showCryptoList && (
                <div className='modal'>
                    <div className='modal__header'>
                        <h2 className='subtitle modal__title'>Select a Cryptocurrency</h2>
                        <button className='button round' onClick={() => setShowCryptoList(false)} aria-label='Back'>x</button>
                    </div>

                    <ul className='list row'>
                        {popularCryptos.filter((crypto) => !currencies.includes(crypto)).map((crypto) => (
                            <li className='row__item' key={crypto}>
                                <button className='button' onClick={() => handleAddWallet(crypto)}>
                                    {crypto}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedWallet && (
                <WalletManager wallet={selectedWallet} session={session} onClose={() => setSelectedWallet(null)} onUpdate={() => fetchWallets()} />
            )}

            {showTransactions && (
                <TransactionsList session={session} onClose={() => setShowTransactions(false)} />
            )}

            {error && <div className='message error'>{error}</div>}
        </div>
    );
};

export default Wallets;
