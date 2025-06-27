import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    // Simulate browser-style 404 by rewriting path
  
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111",
        color: "#fff",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.5rem" }}>
        Page Not Found or Not Accessible on Refresh.
      </p>
    </div>
  );
};

export default NotFound;
