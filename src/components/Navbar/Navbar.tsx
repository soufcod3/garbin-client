import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { useContext } from "react";
import { UserContext } from "../../UserContext";
import { Dropdown } from "react-bootstrap";

function Navbar(props: { onTokenChange: () => void }) {
  const user = useContext(UserContext);

  return (
    <nav className={styles.navbarmain}>
      <Link className={styles.linklogo} to={"/"}>
        <img className={styles.logo} src="/logo.png" alt="Logo de Garbin" />
      </Link>
      {user && (
        <>
          <Link to={"/mes-tenues"}>Mes tenues</Link>
          <Link to={"/ma-garde-robe"}>Ma garde-robe</Link>
        </>
      )}
      <Dropdown>
        <Dropdown.Toggle className={styles.dropdown} id="dropdown-basic">
          {user ? (
            user.username
          ) : (
            <Link to={"/connexion"}>Me connecter</Link>
          )}
        </Dropdown.Toggle>

        {user && (
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => props.onTokenChange()}>Se déconnecter</Dropdown.Item>
          </Dropdown.Menu>
        )}
      </Dropdown>
    </nav>
  );
}

export default Navbar;
