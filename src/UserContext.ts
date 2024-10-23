import { createContext } from "react";

interface UserContextInterface {
  id: number;
  email: string;
  username: string;
  password: string;
  role: string;
}

export const UserContext = createContext<UserContextInterface | null>(null) 
// TODO adding setUser to context can help with logging out anywhere from my app