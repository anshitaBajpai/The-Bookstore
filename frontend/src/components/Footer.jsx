const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "auto",
        background: "#134e4a",
        color: "#e0ffef",
        padding: "20px 16px",
        textAlign: "center",
        borderTop: "4px solid #43c6ac",
        boxShadow: "0 -4px 16px #134e4a55",
      }}
    >
      <p style={{ margin: 0, fontWeight: 600 }}>
        © {new Date().getFullYear()} The Bookstore
      </p>

      <p
        style={{
          margin: "6px 0 0",
          fontSize: "0.9rem",
          color: "#7fffd4",
        }}
      >
        Built with React, Node.js & MongoDB
      </p>
    </footer>
  );
};

export default Footer;
