import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>

        <h2 className={styles.title}>Page Not Found</h2>

        <p className={styles.text}>
          The page you are looking for does not exist or the URL might be
          incorrect.
        </p>

        <div className={styles.actions}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Go Back
          </button>

          <button className={styles.homeBtn} onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
