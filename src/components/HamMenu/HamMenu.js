import styles from "./HamMenu.module.scss";
import { logOut } from '../../utilities/users-service';
import { Link, useNavigate } from 'react-router-dom';

export default function HamMenu({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    // I DONT WANT TO DO THIS. I WANT TO INSTEAD SET USER TO GUEST.
    setUser(null)
    navigate('/home');
  }

  return (
    <ul className={styles.menuContainer}>
      <li>
        {/* {user.isGuest === false ? ( */}
        {user ? (
          <ul className={styles.userOptions}>
            <li>
              <Link to="/profile" className={styles.auth}>
                MY ACCOUNT
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className={styles.auth}>
                WISHLIST
              </Link>
            </li>
            <li>
              <Link to="/orders" className={styles.auth}>
                ORDER HISTORY
              </Link>
            </li>
            <li onClick={handleLogOut}>LOGOUT</li>
          </ul>
        ) : (
          <Link to="/auth" className={styles.auth}>
            SIGN IN / SIGN UP
          </Link>
        )}
      </li>
      {/* <p>{result}</p> */}
      <li>
        <ul className={styles.info}>
          <li>
            <Link to="/faq" className={styles.faq}>FAQ</Link>
          </li>
          <li>
          <Link to="/aboutus" className={styles.faq}>ABOUT US</Link>
          </li>
        </ul>
      </li>
    </ul>
  );
}