import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignUpForm.css';

function SignupFormModal({ NavigateHome }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(() => {
          closeModal();
          NavigateHome();
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  const disableButton = username.length < 4 || password.length < 6 || !email || !username || !firstName || !lastName;

  return (
    <div className='signup-box'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className='signup-details'>
        <label className='user-credential'>
          <input
            type="text"
            className='credential-sizing'
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="signup-error">{errors.email}</p>}
        <label className='user-credential'>
          <input
            type="text"
            className='credential-sizing'
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="signup-error">{errors.username}</p>}
        <label className='user-credential'>
          <input
            type="text"
            className='credential-sizing'
            value={firstName}
            placeholder='First Name'
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="signup-error">{errors.firstName}</p>}
        <label className='user-credential'>
          <input
            type="text"
            className='credential-sizing'
            value={lastName}
            placeholder='Last name'
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="signup-error">{errors.lastName}</p>}
        <label className='pass-credential'>
          <input
            type="password"
            className='credential-sizing'
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="signup-error">{errors.password}</p>}
        <label className='pass-credential'>
          <input
            type="password"
            className='credential-sizing'
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="signup-error">{errors.confirmPassword}</p>
        )}
        <button className="signup-submission" type="submit" disabled={disableButton}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;