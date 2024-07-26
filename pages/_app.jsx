import '../styles/base.css';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

function App({ Component, pageProps: { session, ...pageProps } }) {

    function LogoutButton() {
        const { data: session } = useSession();

        if (session) {
            return <button className='nav__link last' onClick={() => signOut()}>Logout</button>;
        }

        return null;
    }

    return (
        <SessionProvider session={session}>
            <div className='root'>
                <header className='header'>
                    <div className='container'>
                        <nav className='nav'>
                            <Link className='nav__link' href="/">Home</Link>
                            <Link className='nav__link' href="/login">Login</Link>
                            <Link className='nav__link' href="/register">Register</Link>
                            <LogoutButton />
                        </nav>
                    </div>
                </header>
                <main className='main'>
                    <div className='container'>
                        <Component {...pageProps} />
                    </div>
                </main>
            </div>
        </SessionProvider>
    );
}

export default App;
