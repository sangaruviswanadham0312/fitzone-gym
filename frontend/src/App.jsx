import { useEffect, useState } from "react";
import "./App.css";

import Members from "./components/Members";
import Plans from "./components/Plans";
import Payments from "./components/Payments";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [activePage, setActivePage] = useState("dashboard");

  const username = localStorage.getItem("username") || "Admin";
  const role = localStorage.getItem("role") || "USER";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsLoggedIn(false);
    }
  }, []);

  // LOGIN
  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://fitzone-gym-gtl5.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid username or password"
        );
      }

      if (!data.token) {
        throw new Error("Login response lo token ledu.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      setPassword("");
      setIsLoggedIn(true);
      setActivePage("dashboard");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Backend server connect kaledu. Render free instance sleep mode lo undochu, 30-40 seconds aagi malli login click cheyyi."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setEmail("");
    setPassword("");
    setError("");
    setShowPassword(false);
    setActivePage("dashboard");
    setIsLoggedIn(false);
  };

  // PAGE NAVIGATION
  const navigateTo = (page) => {
    setActivePage(page);
  };

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="fitzone-page login-screen">
        <div className="gym-background"></div>

        <header className="fitzone-header">
          <div className="brand">
            <div className="brand-icon">F</div>

            <div>
              <h1>
                Fit<span>Zone</span>
              </h1>
              <p>GYM MEMBERSHIP MANAGEMENT</p>
            </div>
          </div>

          <div className="header-tag">
            <span className="online-dot"></span>
            YOUR FITNESS, YOUR FUTURE
          </div>
        </header>

        <main className="login-layout">
          <section className="hero-section">
            <p className="hero-label">
              WELCOME TO FITZONE
            </p>

            <h2>
              BUILD YOUR
              <br />
              <span>STRONGER</span>
              <br />
              SELF.
            </h2>

            <p className="hero-description">
              Your fitness journey starts here! Stay consistent,
              stay strong, and make every workout count.
            </p>

            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">✦</span>

                <div>
                  <strong>Smart Membership</strong>
                  <small>Manage your fitness plans</small>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">✓</span>

                <div>
                  <strong>Track Your Progress</strong>
                  <small>Stay on top of your goals</small>
                </div>
              </div>
            </div>
          </section>

          <section className="login-card">
            <div className="login-card-heading">
              <div className="login-symbol">↗</div>

              <p className="login-eyebrow">
                YOUR FITNESS JOURNEY
              </p>

              <h2>Welcome Back!</h2>

              <p className="login-subtitle">
                Sign in to access your FitZone account.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-username">
                  EMAIL ADDRESS / USERNAME
                </label>

                <div className="input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">
                  PASSWORD
                </label>

                <div className="input-wrapper">
                  <span className="input-icon">▣</span>

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                className="login-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "SIGNING IN..." : "LOGIN"}
                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="login-divider">
              <span></span>
              <p>FITNESS STARTS WITH YOU</p>
              <span></span>
            </div>

            <div className="security-note">
              <span>🔒</span>
              <p>
                Your account is protected with secure authentication.
              </p>
            </div>
          </section>
        </main>

        <footer className="fitzone-footer">
          <p>© 2026 FITZONE GYM MANAGEMENT</p>
          <p>STRONG BODY. STRONG MIND.</p>
        </footer>
      </div>
    );
  }

  // MAIN APPLICATION AFTER LOGIN
  return (
    <div className="fitzone-page app-screen">
      <div className="app-background"></div>

      <header className="fitzone-header app-header">
        <div className="brand">
          <div className="brand-icon">F</div>

          <div>
            <h1>
              Fit<span>Zone</span>
            </h1>
            <p>GYM MEMBERSHIP MANAGEMENT</p>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          ⇥ LOGOUT
        </button>
      </header>

      <nav className="dashboard-nav">
        <button
          type="button"
          className={activePage === "dashboard" ? "nav-active" : ""}
          onClick={() => navigateTo("dashboard")}
        >
          🏠 Dashboard
        </button>

        <button
          type="button"
          className={activePage === "members" ? "nav-active" : ""}
          onClick={() => navigateTo("members")}
        >
          👥 Members
        </button>

        <button
          type="button"
          className={activePage === "plans" ? "nav-active" : ""}
          onClick={() => navigateTo("plans")}
        >
          📋 Membership Plans
        </button>

        <button
          type="button"
          className={activePage === "payments" ? "nav-active" : ""}
          onClick={() => navigateTo("payments")}
        >
          💳 Payments
        </button>

        <button
          type="button"
          className={activePage === "expiry" ? "nav-active" : ""}
          onClick={() => navigateTo("expiry")}
        >
          📅 Membership Expiry
        </button>
      </nav>

      <main className="dashboard-content">
        {activePage === "dashboard" && (
          <>
            <section className="dashboard-welcome">
              <p className="hero-label">FITZONE ADMIN PANEL</p>

              <h2>
                Welcome Back, <span>{username}!</span>
              </h2>

              <p>
                Manage your gym members, plans and payments
                from one place.
              </p>
            </section>

            <section className="dashboard-cards">
              <button
                type="button"
                className="dashboard-card"
                onClick={() => navigateTo("members")}
              >
                <div className="dashboard-card-icon">👥</div>
                <h3>Members</h3>
                <p>
                  Add, update, search and manage gym members.
                </p>
                <span>Member Management →</span>
              </button>

              <button
                type="button"
                className="dashboard-card"
                onClick={() => navigateTo("plans")}
              >
                <div className="dashboard-card-icon">📋</div>
                <h3>Membership Plans</h3>
                <p>
                  Manage monthly, quarterly and yearly plans.
                </p>
                <span>Plan Management →</span>
              </button>

              <button
                type="button"
                className="dashboard-card"
                onClick={() => navigateTo("payments")}
              >
                <div className="dashboard-card-icon">💳</div>
                <h3>Payments</h3>
                <p>
                  Track membership payments and payment history.
                </p>
                <span>Payment Management →</span>
              </button>

              <button
                type="button"
                className="dashboard-card"
                onClick={() => navigateTo("expiry")}
              >
                <div className="dashboard-card-icon">📅</div>
                <h3>Membership Expiry</h3>
                <p>
                  Check active and expired memberships.
                </p>
                <span>Expiry Tracking →</span>
              </button>
            </section>

            <section className="dashboard-account">
              <h3>Account Information</h3>

              <p>
                <strong>Username:</strong> {username}
              </p>

              <p>
                <strong>Role:</strong> {role}
              </p>

              <p className="success-message">
                ✓ Successfully logged in.
              </p>
            </section>
          </>
        )}

        {activePage === "members" && (
          <Members />
        )}

        {activePage === "plans" && (
          <Plans />
        )}

        {activePage === "payments" && (
          <Payments />
        )}

        {activePage === "expiry" && (
          <section className="expiry-page">
            <div className="module-heading">
              <h2>📅 Membership Expiry</h2>
              <p>
                View members whose memberships are active or expired.
              </p>
            </div>

            <div className="expiry-options">
              <button
                type="button"
                className="dashboard-card"
                onClick={() => navigateTo("members")}
              >
                <div className="dashboard-card-icon">✓</div>
                <h3>View All Members</h3>
                <p>
                  Check member status and membership end dates.
                </p>
                <span>Open Members →</span>
              </button>

              <button
                type="button"
                className="dashboard-card"
                onClick={() => navigateTo("members")}
              >
                <div className="dashboard-card-icon">◷</div>
                <h3>Expired Memberships</h3>
                <p>
                  Open the Members page and search for EXPIRED status.
                </p>
                <span>Check Expired Members →</span>
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="fitzone-footer">
        <p>© 2026 FITZONE GYM MANAGEMENT</p>
        <p>STRONG BODY. STRONG MIND.</p>
      </footer>
    </div>
  );
}

export default App;