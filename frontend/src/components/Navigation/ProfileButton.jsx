import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css';

function ProfileButton({ user, NavigateHome, NavigateToNewSpot, NavigateToCurrent }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    NavigateHome();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className='profile-button-container'>
      {user && <button className='manage-spots' onClick={() => NavigateToNewSpot()}>Create a New Spot</button>}
      <button className="profile-button" onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
            <div>
              <li className='user-login'>Hello, {user.firstName}</li>
              <li className='user-login user-login2'>{user.email}</li>
              <li className='menu-button-li'>
              <button
                  onClick={NavigateToCurrent}
                  className="menu-button">
                  Manage Spots
                </button>
                </li>
              <li className='menu-button-li'>
                <button className="menu-button" onClick={logout}>Log Out</button>
              </li>
            </div>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal NavigateHome={NavigateHome} />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;