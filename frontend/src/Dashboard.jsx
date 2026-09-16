import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [message, setMessage] = useState("Loading wallet...");
  const [transactions, setTransactions] = useState([]);

  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [copied, setCopied] = useState(false);
  const fetchWallet = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login again.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4040/api/wallets",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setMessage("Unable to load wallet.");
        return;
      }

      const data = await response.json();

      setWallet(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to the backend.");
    }
  };
  const fetchTransactions = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "http://localhost:4040/api/wallets/transactions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Could not load transactions");
      return;
    }

    const data = await response.json();
    setTransactions(data);

  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
  fetchWallet();
  fetchTransactions();
}, []);

  const handleTransfer = async (event) => {
    event.preventDefault();

    setSendMessage("");
    setSending(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:4040/api/wallets/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverEmail: receiverEmail,
            amount: Number(amount),
          }),
        }
      );
      const fetchTransactions = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "http://localhost:4040/api/wallets/transactions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setTransactions(data);

  } catch (error) {
    console.error(error);
  }
};

      const result = await response.text();

      if (!response.ok) {
        setSendMessage(result || "Transfer failed.");
        return;
      }

      setSendMessage("Transfer successful!");

      setReceiverEmail("");
      setAmount("");

      // Refresh wallet balance
      await fetchWallet();

    } catch (error) {
      console.error(error);
      setSendMessage("Could not connect to the backend.");
    } finally {
      setSending(false);
    }
  };

  if (message) {
    return (
      <div className="dashboard">
        <div className="dashboard-message">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <header className="dashboard-header">

        <div>
          <div className="dashboard-brand">
            🛡 Crypto Wallet
          </div>

          <div className="dashboard-subtitle">
            SECURE DIGITAL WALLET
          </div>
        </div>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </button>

      </header>

      <main className="dashboard-content">

        <div className="welcome-section">
          <p>WALLET OVERVIEW</p>

          <h1>
            Welcome to your Wallet
          </h1>

          <span>
            Your wallet is securely connected.
          </span>
        </div>

        <div className="balance-card">

          <div>
            <p>AVAILABLE BALANCE</p>

            <h2>
              {wallet.balance}
            </h2>

            <span>
              Crypto Wallet Balance
            </span>
          </div>

          <div className="balance-icon">
            💰
          </div>

        </div>

        <div className="dashboard-grid">

          <div className="info-card">
            <h3>Wallet ID</h3>
            <p>{wallet.id}</p>
          </div>

          <div className="info-card">
            <h3>Wallet Owner</h3>
            <p>{wallet.user?.name}</p>
          </div>

          <div className="info-card">
            <h3>Email</h3>
            <p>{wallet.user?.email}</p>
          </div>

        </div>
            <div
  className="info-card"
  style={{
    marginTop: "25px",
    padding: "25px"
  }}
>
  <h3>Receive Crypto</h3>

  <p>
    Receive crypto using your wallet address.
  </p>

  <button
    type="button"
    className="logout-button"
    onClick={() => setShowReceive(!showReceive)}
  >
    {showReceive ? "Hide QR Code" : "Show QR Code"}
  </button>

  {showReceive && wallet?.walletAddress && (
    <div
      style={{
        marginTop: "20px",
        textAlign: "center"
      }}
    >
      <QRCodeCanvas
        value={wallet.walletAddress}
        size={180}
        level="H"
      />

      <p
        style={{
          marginTop: "15px",
          wordBreak: "break-all"
        }}
      >
        {wallet.walletAddress}
      </p>

      <button
        type="button"
        className="logout-button"
        onClick={async () => {
          await navigator.clipboard.writeText(
            wallet.walletAddress
          );

          setCopied(true);

          setTimeout(() => {
            setCopied(false);
          }, 2000);
        }}
      >
        {copied ? "Copied!" : "Copy Address"}
      </button>
    </div>
  )}
</div>
        {/* SEND CRYPTO */}

        <div
          className="info-card"
          style={{
            marginTop: "25px",
            padding: "25px"
          }}
        >

          <h3>Send Crypto</h3>

          <p>
            Transfer crypto securely to another wallet.
          </p>

          <form onSubmit={handleTransfer}>

            <input
              type="email"
              placeholder="Receiver email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "12px",
                marginBottom: "12px"
              }}
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.00000001"
              step="0.00000001"
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px"
              }}
            />

            <button
              type="submit"
              className="logout-button"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Crypto"}
            </button>

          </form>

          {sendMessage && (
            <p style={{ marginTop: "15px" }}>
              {sendMessage}
            </p>
          )}

        </div>

        <div
  className="info-card"
  style={{
    marginTop: "25px",
    padding: "25px"
  }}
>
  <h3>Transaction History</h3>

  {transactions.length === 0 ? (
    <p>No transactions yet.</p>
  ) : (
    transactions.map((transaction) => (
      <div
        key={transaction.id}
        style={{
          padding: "12px 0",
          borderBottom: "1px solid #ddd"
        }}
      >
        <strong>Amount: {transaction.amount}</strong>

        <p>
          From: {transaction.sender?.email}
        </p>

        <p>
          To: {transaction.receiver?.email}
        </p>

        <small>
          {transaction.createdAt}
        </small>
      </div>
    ))
  )}
</div>

        <div className="security-status">

          <span>●</span>

          JWT authenticated session

        </div>

      </main>

    </div>
  );
}

export default Dashboard;``