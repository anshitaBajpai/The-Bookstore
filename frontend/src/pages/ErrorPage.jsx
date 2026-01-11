import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(120deg, #e0ffef 0%, #43c6ac 60%, #191654 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#232946",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <h1
          style={{ fontSize: "3rem", color: "#7fffd4", marginBottom: "12px" }}
        >
          404
        </h1>

        <h2 style={{ color: "#a3bffa", marginBottom: "12px" }}>
          Page Not Found
        </h2>

        <p style={{ color: "#eebbc3", marginBottom: "24px" }}>
          The page you are looking for does not exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            background: "#43c6ac",
            color: "#134e4a",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#134e4a";
            e.currentTarget.style.color = "#43c6ac";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#43c6ac";
            e.currentTarget.style.color = "#134e4a";
          }}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
