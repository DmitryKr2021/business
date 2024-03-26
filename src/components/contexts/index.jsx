import { createContext, useContext } from 'react';

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { useAuth };
export default AuthContext;
