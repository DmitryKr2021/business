import React, { useState } from "react";
import { Button } from "react-bootstrap";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { AdminPage, LoginPage, ManagerPage } from "./components/Pages";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import AuthContext, { useAuth } from "./components/contexts/index";
import * as routes from "./routes";

localStorage.removeItem("user");

const AuthProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [activeUser, setActiveUser] = useState(user?.username);
  
  const setUser = (thisUser) => {
    const { username } = thisUser;
    setActiveUser(username);
    window.localStorage.setItem("user", JSON.stringify(thisUser));
  };

  const logOut = () => {
    setActiveUser(null);
    localStorage.removeItem("user");
  };

  return (
    // eslint-disable-next-line
    <AuthContext.Provider value={{ logOut, activeUser, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const WrapPage = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return auth.activeUser ? (
    children
  ) : (
    <Navigate to={routes.loginPath()} state={{ from: location }} replace />
  );
};

WrapPage.propTypes = {
  children: PropTypes.node.isRequired,
};

const OutButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  return auth.user ? (
    <Button onClick={auth.logOut}>{t("app.goOut")}</Button>
  ) : null;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={routes.root()} element={null}>
      <Route path={routes.root()} element={<WrapPage>{null}</WrapPage>} />
      <Route path={routes.loginPath()} element={<LoginPage />} />
      <Route
        path={routes.managerPath()}
        element={
          <WrapPage>
            <ManagerPage />
          </WrapPage>
        }
      />
      <Route
        path={routes.adminPath()}
        element={
          <WrapPage>
            <AdminPage />
          </WrapPage>
        }
      />
    </Route>,
  ),
);

document.querySelector("body").className = "bg-light h-100";

const App = () => (
  <AuthProvider>
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="h-100 d-flex flex-column">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                Business desk
              </a>
              <OutButton />
            </div>
          </nav>
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  </AuthProvider>
);

export default App;
