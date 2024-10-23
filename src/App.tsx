import 'bootstrap/dist/css/bootstrap.min.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider, 
  createHttpLink,
  useQuery} from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import './App.css';
import API_URL from './config';
import { useEffect, useState } from 'react';
import { IUser } from './interfaces';
import { GET_LOGGED_USER } from './graphql/queries';
import { UserContext } from './UserContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Wardrobe from './pages/Wardrobe/Wardrobe';


const httpLink = createHttpLink({
  uri: API_URL,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function Main() {
  const [user, setUser] = useState<IUser|null>(null);
  const { data, refetch, error } = useQuery(GET_LOGGED_USER);

  useEffect(() => {
    if (error) {
      setUser(null);
    }
  }, [error]);

  async function onTokenChange(token?: string) {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    try {
      const { data } = await refetch();
      setUser(data?.loggedUser);
    } catch (err: any) {
      if (err.message.includes("Access denied!")) {
        setUser(null);
      }
    }
  }

  useEffect(() => {
    setUser(data?.loggedUser);
  }, [data]);

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout onTokenChange={onTokenChange} />}>
            <Route path="/" element={<Home />} />
            <Route path="/creer-un-compte" element={<Register />} />
            <Route path="/connexion" element={<Login onTokenChange={onTokenChange} />} />
            <Route path="/ma-garde-robe" element={<Wardrobe />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Main />
    </ApolloProvider>
  );
}

export default App;
