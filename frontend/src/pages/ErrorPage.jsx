import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #43c6ac 0%, #191654 60%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "rgba(35, 41, 70, 0.85)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "48px 40px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          maxWidth: "480px",
          width: "100%",
          border: "1px solid rgba(127, 255, 212, 0.2)",
        }}
      >
        {/* Big 404 */}
        <h1
          style={{
            fontSize: "5rem",
            fontWeight: 900,
            background: "linear-gradient(90deg, #7fffd4, #43c6ac)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "12px",
            letterSpacing: "4px",
          }}
        >
          404
        </h1>

        <h2
          style={{
            color: "#a3bffa",
            fontSize: "1.6rem",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          Page Not Found
        </h2>

        <p
          style={{
            color: "#eebbc3",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            marginBottom: "32px",
          }}
        >
          The page you are looking for does not exist, was removed, or the URL
          might be incorrect.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              border: "1.5px solid #7fffd4",
              background: "transparent",
              color: "#7fffd4",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#7fffd4";
              e.currentTarget.style.color = "#134e4a";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#7fffd4";
            }}
          >
            ← Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(90deg, #43c6ac, #7fffd4)",
              color: "#134e4a",
              fontWeight: 800,
              cursor: "pointer",
              fontSize: "1rem",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 6px 18px rgba(67, 198, 172, 0.5)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 26px rgba(67, 198, 172, 0.7)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 18px rgba(67, 198, 172, 0.5)";
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
