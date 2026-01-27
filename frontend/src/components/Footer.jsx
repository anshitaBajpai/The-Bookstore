import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} The Bookstore
      </p>

      <p className={styles.tech}>Built with React, Node.js & MongoDB</p>
    </footer>
  );
};

export default Footer;
