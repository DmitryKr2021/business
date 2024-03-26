import React, { useRef, useState } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./contexts/index";
import img from "../imgs/autorization.jpg";
import getLogins from "../fixtures/logins";
import * as routes from "../routes";

const logPass = getLogins();
const users = Object.keys(logPass);
const logins = users.map((user) => logPass[user].login);
const adminPass = logPass.admin.password;
const managerPasses = logPass.managers.password;

const choosePassword = (login) => {
  if (login === "admin") {
    return adminPass;
  }
  return [...managerPasses];
};

const LoginPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const inpLogin = useRef();

  const handleBlurLog = (e) => {
    setUsername(e.target.value);
  };
  const handleBlurPass = (e) => {
    setPassword(e.target.value);
  };

  const Schema = Yup.object().shape({
    username: Yup.string()
      .required(t("errors.required"))
      .oneOf([...logins], t("errors.login")),
    password: Yup.string()
      .required(t("errors.required"))
      .oneOf(
        [...choosePassword(inpLogin.current?.value), null],
        t("errors.password"),
      ),
  });

  return (
    <Formik
      initialValues={{ username, password }}
      validationSchema={Schema}
      onSubmit={() => {
        auth.setUser({username, password});
        const rout = username === 'admin' ? routes.adminPath : routes.managerPath;
        navigate(rout());
      }}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        touched,
        errors,
      }) => (
        <div className="d-flex flex-column">
          <div className="container-fluid h-100">
            <div
              className="row justify-content-center align-content-center h-100"
              style={{ marginTop: 200 }}
            >
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img
                        src={img}
                        className="rounded-circle"
                        alt="Войти/Enter"
                      />
                    </div>
                    <Form
                      onSubmit={handleSubmit}
                      className="col-12 col-md-6 mt-3 mt-mb-0"
                    >
                      <h1 className="text-center mb-4">{t("login.enter")}</h1>
                      <Form.Group className="mb-3">
                        <div className="form-floating mb-3">
                          <Form.Control
                            name="username"
                            autoComplete="username"
                            required
                            placeholder={t("login.nik")}
                            id="username"
                            onChange={handleChange}
                            onBlur={handleBlurLog}
                            value={values.username}
                            isInvalid={touched.username && errors.username}
                            autoFocus
                            ref={inpLogin}
                          />
                          <Form.Label htmlFor="username">
                            {t("login.nik")}
                          </Form.Label>
                          <ErrorMessage name="username">
                            {(msg) => (
                              <div className="invalid-tooltip">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <div className="form-floating mb-3">
                          <Form.Control
                            name="password"
                            type="password"
                            autoComplete="password"
                            placeholder={t("login.password")}
                            required
                            id="password"
                            onChange={handleChange}
                            onBlur={handleBlurPass}
                            value={values.password}
                            isInvalid={touched.password && errors.password}
                          />
                          <Form.Label htmlFor="password">
                            {t("login.password")}
                          </Form.Label>
                          <ErrorMessage name="password">
                            {(msg) => (
                              <div className="invalid-tooltip">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 mb-3 btn btn-outline-primary"
                        variant="outline-primary"
                      >
                        {t("login.enter")}
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default LoginPage;
