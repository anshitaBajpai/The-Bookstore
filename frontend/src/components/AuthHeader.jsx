import React from "react";
import styles from "./AuthHeader.module.css";

const AuthHeader = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>📚 The BookStore</h1>
      <p className={styles.subtitle}>Login or create an account to continue</p>
    </header>
  );
};

export default AuthHeader;
