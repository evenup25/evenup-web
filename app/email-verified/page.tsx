"use client";

export default function EmailVerifiedPage() {
  const openApp = () => {
    window.location.href = "evenup://(tabs)";
  };

  const isMobile =
    typeof navigator !== "undefined" && /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1>✅ Email verified</h1>

      <p style={{ marginTop: 12 }}>Your email has been successfully verified.</p>

      {isMobile ? (
        <>
          <button
            onClick={openApp}
            style={{
              marginTop: 24,
              padding: "12px 20px",
              fontSize: 16,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Open EvenUp App
          </button>

          <p style={{ marginTop: 12, fontSize: 14, opacity: 0.7 }}>
            If the app doesn’t open, make sure it’s installed.
          </p>
        </>
      ) : (
        <p style={{ marginTop: 24, opacity: 0.8 }}>
          You can now return to the EvenUp app on your phone.
        </p>
      )}
    </div>
  );
}
