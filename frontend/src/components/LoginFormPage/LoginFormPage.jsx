import { useState } from "react";
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import './LoginForm.css';

function LoginFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] =useState({});

    if (sessionUser) return <Navigate to='/' replace={true} />;

    const handleSubmit = async e => {
        e.preventDefault();
        setErrors({});
        return await dispatch(sessionActions.login({ credential, password }))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data?.errors) setErrors(data.errors);
                }
            );
    };

    return (
        <div className='loginForm'>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>

                <div className='credential'>
                    <label>
                        Username or Email
                        <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                        />
                    </label>
                </div>

                <div className='credential'>
                    <label>
                        Password
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </label>
                </div>

            {errors.credential && <p>{errors.credential}</p>}
            <button className='submission' type="submit">Log In</button>
            </form>
        </div>
    )
}

export default LoginFormPage;