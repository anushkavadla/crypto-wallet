import { useState } from "react";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:4040/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
  localStorage.setItem("token", data.token);

  setLoggedIn(true);

  console.log("Logged in user:", data);
} else {
        setMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

if (loggedIn) {
  return <Dashboard />;
}

if (showSignup) {
  return (
    <Signup
      onSignup={() => setShowSignup(false)}
      onBackToLogin={() => setShowSignup(false)}
    />
  );
}

  return (
    <div className="app">

      {/* Header */}
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

      {/* Main */}
      <main className="main-container">

        <div className="security-bar">

          <span>
            🔐 Secure Authentication
          </span>

          <span>
            JWT Protected
          </span>

          <span>
            Spring Security
          </span>

        </div>

        <div className="login-layout">

          {/* Login Section */}
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
                  SECURE ACCESS
                </div>
              </div>

            </div>

            <h1>
              Sign in to your Wallet
            </h1>

            <p className="description">
              Access your secure digital wallet and manage
              your crypto assets.
            </p>

            <form onSubmit={handleLogin}>

              {/* Email */}
              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    @
                  </span>

                  <input
                    id="email"
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

              {/* Password */}
              <div className="form-group">

                <div className="label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-button"
                    onClick={() =>
                      setMessage(
                        "Password recovery will be implemented later."
                      )
                    }
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* Remember */}
              <div className="remember-row">

                <label>
                  <input type="checkbox" />

                  <span>
                    Remember this device
                  </span>
                </label>

              </div>

              {/* Login button */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Authenticating..."
                  : "Sign In to Wallet →"}
              </button>

            </form>

            {/* Message */}
            {message && (
              <div className="message">
                {message}
              </div>
            )}

            <div className="demo-info">
              Backend: Spring Boot REST API
              <br />
              Authentication: JWT
            </div>
            <div
  style={{
    marginTop: "20px",
    textAlign: "center",
    color: "#929aa8",
    fontSize: "12px"
  }}
>
  Don't have an account?{" "}

  <button
    type="button"
    className="forgot-button"
    onClick={() => setShowSignup(true)}
  >
    Create one
  </button>
</div>

          </section>

          {/* Security Information */}
          <section className="security-panel">

            <div className="security-heading">
              <span className="large-shield">
                🛡
              </span>

              <div>
                <h2>
                  Wallet Security
                </h2>

                <span>
                  Authentication & Protection
                </span>
              </div>
            </div>

            <div className="security-card">

              <div className="security-card-icon">
                🔑
              </div>

              <div>
                <h3>
                  JWT Authentication
                </h3>

                <p>
                  Every protected request is authenticated
                  using a JSON Web Token.
                </p>
              </div>

            </div>

            <div className="security-card">

              <div className="security-card-icon">
                🔐
              </div>

              <div>
                <h3>
                  Password Protection
                </h3>

                <p>
                  Passwords are securely hashed using
                  BCrypt before being stored.
                </p>
              </div>

            </div>

            <div className="security-card">

              <div className="security-card-icon">
                🗄
              </div>

              <div>
                <h3>
                  Database Security
                </h3>

                <p>
                  User and wallet data are persisted in
                  MySQL through Spring Data JPA.
                </p>
              </div>

            </div>

            <div className="security-flow">

              <div>LOGIN</div>
              <span>→</span>
              <div>JWT</div>
              <span>→</span>
              <div>PROTECTED API</div>

            </div>

          </section>

        </div>

      </main>

      <footer className="footer">
        <span>Crypto Wallet</span>
        <span>Spring Boot + React + MySQL</span>
      </footer>

    </div>
  );
}

export default App;