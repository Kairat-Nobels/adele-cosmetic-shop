import React, { useState, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import "./LoginPage.scss";
import { useAdmin } from "../../../context/AdminContext";
import { useTranslation } from "../../../hooks/useTranslation";

function LoginPage() {
  const { translate } = useTranslation();
  const { isAuthenticated, login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/products" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError(translate("admin.invalidCredentials"));
      }
    } catch (err) {
      setError(translate("admin.loginError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-page__form" onSubmit={handleSubmit}>
        <h1 className="login-page__title">{translate("admin.adminPanel")}</h1>
        {error && <div className="login-page__error">{error}</div>}
        <div className="login-page__group">
          <label className="login-page__label" htmlFor="username">
            {translate("admin.username")}
          </label>
          <input
            className="login-page__input"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="login-page__group">
          <label className="login-page__label" htmlFor="password">
            {translate("admin.password")}
          </label>
          <input
            className="login-page__input"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className={`login-page__submit ${
            isSubmitting ? "login-page__submit--disabled" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? translate("admin.loggingIn")
            : translate("admin.login")}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
