import styles from "./ShimmerCard.module.css";

function ShimmerCard() {
  return (
    <div className={styles.card}>
      <div className={styles.image}></div>
      <div className={styles.text}></div>
      <div className={styles.textSmall}></div>
      <div className={styles.button}></div>
    </div>
  );
}

export default ShimmerCard;
