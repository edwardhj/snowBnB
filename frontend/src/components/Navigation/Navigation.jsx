import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navigation-box'>
      <ul className='navigation-list'>
        <li>
          <NavLink style={{textDecoration: 'none'}} to="/">
            <div className='navigation-company'>
              <img 
              className='navigation-logo'
              src='https://www.shareicon.net/data/2017/05/24/886221_media_512x512.png'
              />
              <h4 className='navigation-h4'>snowbnb</h4>
            </div>
          </NavLink>
        </li>
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navigation;