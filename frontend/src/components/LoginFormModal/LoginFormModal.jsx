import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data);
        }
      });
  };

  const disableButton = credential.length < 4 || password.length < 6;

  return (
      <div className='login-box'>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit} className='login-details'>
          <label className='user-credential'>
            <input
              type="text"
              className='credential-sizing'
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder='Username or Email'
              required
            />
          </label>
          <label className='pass-credential'>
            <input
              type="password"
              className='credential-sizing'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
            />
          </label>
          {errors.message && (
            <p className='login-error'>{errors.message}</p>
          )}
          <button className="login-submission" type="submit" disabled={disableButton}>Log In</button>
        </form>
      </div>
  );
}

export default LoginFormModal;