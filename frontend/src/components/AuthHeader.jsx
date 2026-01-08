const AuthHeader = () => {
  return (
    <header
      style={{
        background: "#134e4a",
        padding: "32px 0",
        textAlign: "center",
        boxShadow: "0 6px 24px #134e4a55",
        borderBottom: "4px solid #43c6ac",
      }}
    >
      <h1
        style={{
          color: "#e0ffef",
          fontSize: "2.4rem",
          fontWeight: 800,
          letterSpacing: "1px",
        }}
      >
        📚 The BookStore
      </h1>
      <p
        style={{
          marginTop: "8px",
          color: "#b2f1e6",
          fontSize: "1rem",
          fontWeight: 500,
        }}
      >
        Login or create an account to continue
      </p>
    </header>
  );
};

export default AuthHeader;
