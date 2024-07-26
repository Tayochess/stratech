import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            router.push('/');
        }
        if (status === 'loading') return;
    }, [session, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result.error) {
            setError('Wrong credentials');
        } else {
            router.push('/');
        }
    };

    return (
        <form className='form' onSubmit={handleSubmit}>
            <input className='input' type="email" value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            <input className='input' type="password" value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            <button className='button large' type="submit">Login</button>

            {error && <div className='message error'>{error}</div>}
        </form>
    );
};

export default Login;
