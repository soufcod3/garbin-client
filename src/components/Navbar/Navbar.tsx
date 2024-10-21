import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { useContext } from "react";
import { UserContext } from "../../UserContext";

function Navbar(props: {
  onTokenChange: () => void;
}) {
  const user = useContext(UserContext);

  return (
    <nav className={styles.navbarmain}>
      <Link className={styles.linklogo} to={"/"}>
        <img className={styles.logo} src="/logo512.png" alt="logo starBlog" />
      </Link>

    </nav>
  );
}

export default Navbar;