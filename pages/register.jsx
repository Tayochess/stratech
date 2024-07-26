import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setError('');

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            setSuccess('Registration successful')
            setTimeout(() => {
                router.push('/login');
            }, 5000);
        } else {
            if (res.status === 400) {
                setError('Invalid credentials: password should be at least 8 symbols long');
            } else {
                setError('Registration failed');
            }
        }
    };

    return (
        <form className='form' onSubmit={handleSubmit}>
            <input className='input' type="email" value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            <input className='input' type="password" value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            <button className='button large' type="submit">Register</button>

            {error && <div className='message error'>{error}</div>}
            {success && <div className='message success'>{success}</div>}
        </form>
    );
};

export default Register;
