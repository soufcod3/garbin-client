import { useContext } from "react";
import { UserContext } from "../../UserContext";

function Home() {
  // Getting current user from context
  const user = useContext(UserContext);

  return (
    <main>
      <p>Hello world (logged as : {user?.email} )</p>
    </main>
  );
}

export default Home;