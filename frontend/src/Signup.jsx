import { useState } from "react";

function Signup({ onSignup, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:4040/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully. Please login.");
        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          onSignup();
        }, 1000);
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">🛡</div>

          <div>
            <div className="brand-name">
              Crypto Wallet
            </div>

            <div className="brand-subtitle">
              SECURE DIGITAL WALLET
            </div>
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="main-container">

        <div className="login-layout">

          <section className="login-panel">

            <div className="wallet-heading">

              <div className="shield-box">
                🛡
              </div>

              <div>
                <div className="small-title">
                  CRYPTO WALLET
                </div>

                <div className="security-label">
                  CREATE ACCOUNT
                </div>
              </div>

            </div>

            <h1>
              Create your Wallet
            </h1>

            <p className="description">
              Create a secure account to start managing
              your crypto wallet.
            </p>

            <form onSubmit={handleSignup}>

              <div className="form-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    👤
                  </span>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <div className="form-group">

                <label htmlFor="signup-email">
                  Email Address
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    @
                  </span>

                  <input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <div className="form-group">

                <label htmlFor="signup-password">
                  Password
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    id="signup-password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    minLength={8}
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Wallet →"}
              </button>

            </form>

            {message && (
              <div className="message">
                {message}
              </div>
            )}

            <div className="demo-info">
              Passwords are protected using BCrypt.
              <br />
              Authentication uses JWT.
            </div>

            <button
              type="button"
              className="forgot-button"
              style={{
                display: "block",
                margin: "20px auto 0"
              }}
              onClick={onBackToLogin}
            >
              ← Back to Login
            </button>

          </section>

          <section className="security-panel">

            <div className="security-heading">

              <span className="large-shield">
                🛡
              </span>

              <div>
                <h2>
                  Account Security
                </h2>

                <span>
                  Your wallet starts here
                </span>
              </div>

            </div>

            <div className="security-card">

              <div className="security-card-icon">
                🔐
              </div>

              <div>
                <h3>
                  Secure Password
                </h3>

                <p>
                  Your password is hashed with BCrypt
                  before being stored in MySQL.
                </p>
              </div>

            </div>

            <div className="security-card">

              <div className="security-card-icon">
                🪪
              </div>

              <div>
                <h3>
                  JWT Authentication
                </h3>

                <p>
                  After login, a JWT securely identifies
                  your authenticated session.
                </p>
              </div>

            </div>

            <div className="security-card">

              <div className="security-card-icon">
                🗄
              </div>

              <div>
                <h3>
                  MySQL Database
                </h3>

                <p>
                  Your account information is persisted
                  using Spring Data JPA.
                </p>
              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Signup;