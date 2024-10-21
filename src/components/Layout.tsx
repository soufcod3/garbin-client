import { useContext } from "react";
import { Outlet } from "react-router-dom";
import  Navbar from "./Navbar/Navbar";
import { UserContext } from "../UserContext";

const Layout = (props: { onTokenChange: () => void }) => {
  const user = useContext(UserContext);

  return (
    <>
      <Navbar onTokenChange={props.onTokenChange} />
      <Outlet />
    </>
  );
};

export default Layout;