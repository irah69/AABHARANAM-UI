<section style={{
        fontFamily: "'Playfair Display', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: "48px 24px",
        textAlign: "center",
        background: "#fff",
      }}>

        <div style={{
          width: "52px",
          height: "52px",
          border: "1.5px solid #111",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
          marginBottom: "28px",
          opacity: 0.5,
        }}>◻</div>

        <h1 style={{
          fontSize: "clamp(1.6rem, 6vw, 2.4rem)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: "0 0 12px",
          color: "#111",
        }}>
          Sign in to view your orders
        </h1>

        <p style={{
          fontSize: "0.88rem",
          color: "#999",
          margin: "0 0 36px",
          maxWidth: "300px",
          fontWeight: 400,
          lineHeight: 1.7,
        }}>
          Your past purchases will appear here once you sign in.
        </p>

        <Link
          href="/signin?next=/orders"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "13px 36px",
            background: "#111",
            color: "#fff",
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign in
        </Link>

      </section>