import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config.js";
import { toast } from "react-hot-toast";
import styles from "./Profile.module.css";

function Profile() {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/profile`).then((res) => {
      setProfile(res.data);
      setUsername(res.data.username);
    });
  }, []);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);
    try {
      const res = await axios.put(`${API_URL}/profile`, { username });
      setProfile(res.data);
      localStorage.setItem("username", res.data.username);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoadingPass(true);
    try {
      await axios.put(`${API_URL}/profile/password`, { currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>My Profile</h1>

        {/* Account Info */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Account Information</h2>
          <form onSubmit={handleUpdateInfo} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={profile.email}
                className={`${styles.input} ${styles.inputReadonly}`}
                readOnly
              />
              <span className={styles.hint}>Email cannot be changed.</span>
            </div>
            <button type="submit" className={styles.btn} disabled={loadingInfo}>
              {loadingInfo ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Change Password</h2>
          <form onSubmit={handleChangePassword} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.input}
                required
                autoComplete="current-password"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className={styles.btn} disabled={loadingPass}>
              {loadingPass ? "Updating…" : "Update Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Profile;
