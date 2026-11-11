
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllPayments,
  addPayment,
  updatePayment,
  deletePayment,
  getAllMembers,
} from "../services/api";

const emptyPayment = {
  memberId: "",
  amount: "",
  paymentDate: new Date().toISOString().slice(0, 10),
  paymentMethod: "UPI",
  paymentStatus: "SUCCESS",
};

function formatAmount(amount) {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function formatDate(date) {
  return date ? String(date).slice(0, 10) : "—";
}

function Payments() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyPayment);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        getAllPayments(),
        getAllMembers(),
      ]);

      if (results[0].status === "fulfilled") {
        setPayments(
          Array.isArray(results[0].value.data)
            ? results[0].value.data
            : []
        );
      } else {
        throw results[0].reason;
      }

      if (results[1].status === "fulfilled") {
        setMembers(
          Array.isArray(results[1].value.data)
            ? results[1].value.data
            : []
        );
      } else {
        setMembers([]);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load payment history."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const successfulPayments = payments.filter(
    (payment) =>
      String(payment.paymentStatus || payment.status).toUpperCase() ===
      "SUCCESS"
  );

  const successfulAmount = successfulPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return payments;

    return payments.filter((payment) =>
      [
        payment.id,
        payment.memberId,
        payment.amount,
        payment.paymentDate,
        payment.paymentMethod,
        payment.paymentStatus,
        payment.status,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      )
    );
  }, [payments, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...emptyPayment,
      paymentDate: new Date().toISOString().slice(0, 10),
    });
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.memberId) {
      setError("Please select a member.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (!form.paymentDate) {
      setError("Please select payment date.");
      return;
    }

    const payload = {
      memberId: Number(form.memberId),
      amount: Number(form.amount),
      paymentDate: form.paymentDate,
      paymentMethod: form.paymentMethod,
      paymentStatus: form.paymentStatus,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await updatePayment(editingId, payload);
        setSuccess("Payment updated successfully!");
      } else {
        await addPayment(payload);
        setSuccess("Payment added successfully!");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to save payment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (payment) => {
    setEditingId(payment.id);

    setForm({
      memberId: String(payment.memberId ?? ""),
      amount: String(payment.amount ?? ""),
      paymentDate: formatDate(payment.paymentDate) === "—"
        ? ""
        : formatDate(payment.paymentDate),
      paymentMethod: payment.paymentMethod || "UPI",
      paymentStatus:
        String(payment.paymentStatus || payment.status || "SUCCESS")
          .toUpperCase(),
    });

    setError("");
    setSuccess("");

    document
      .getElementById("payment-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (payment) => {
    if (!window.confirm(`Delete payment record #${payment.id}?`)) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deletePayment(payment.id);

      if (editingId === payment.id) {
        resetForm();
      }

      setSuccess("Payment deleted successfully!");
      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete payment."
      );
    }
  };

  return (
    <div className="payments-page">
      {/* HEADER */}
      <div className="payments-page-header">
        <div className="payments-title-group">
          <div className="payments-title-icon">💳</div>

          <div>
            <h1>
              Payments <span>Management</span>
            </h1>
            <p>Manage membership payments and payment history.</p>
          </div>
        </div>

        <button
          type="button"
          className="payments-refresh-button"
          onClick={loadData}
          disabled={loading}
        >
          ⟳ {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="payments-alert payments-error">
          ⚠ {error}
        </div>
      )}

      {success && (
        <div className="payments-alert payments-success">
          ✓ {success}
        </div>
      )}

      {/* SUMMARY */}
      <section className="payments-summary-grid">
        <div className="payments-summary-card payments-total-card">
          <div className="payments-summary-icon">▤</div>
          <div>
            <p>Total Payment Records</p>
            <h2>{payments.length}</h2>
            <small>All recorded transactions</small>
          </div>
        </div>

        <div className="payments-summary-card payments-success-card">
          <div className="payments-summary-icon">✓</div>
          <div>
            <p>Successful Payments</p>
            <h2>{successfulPayments.length}</h2>
            <small>Completed transactions</small>
          </div>
        </div>

        <div className="payments-summary-card payments-amount-card">
          <div className="payments-summary-icon">₹</div>
          <div>
            <p>Total Successful Amount</p>
            <h2>₹{formatAmount(successfulAmount)}</h2>
            <small>Successful payments only</small>
          </div>
        </div>
      </section>

      {/* ADD / EDIT PAYMENT */}
      <section className="payments-panel" id="payment-form">
        <div className="payments-panel-heading">
          <div className="payments-panel-icon">
            {editingId !== null ? "✎" : "+"}
          </div>

          <div>
            <h2>
              {editingId !== null ? "Edit Payment" : "Add New Payment"}
            </h2>
            <p>
              {editingId !== null
                ? "Update the selected payment details."
                : "Enter the membership payment information below."}
            </p>
          </div>
        </div>

        <form className="payments-form" onSubmit={handleSubmit}>
          <div className="payments-field">
            <label htmlFor="payment-member">Member *</label>

            <select
              id="payment-member"
              name="memberId"
              value={form.memberId}
              onChange={handleChange}
              required
            >
              <option value="">Select Member</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  #{member.id} — {member.name || member.fullName || member.email}
                </option>
              ))}
            </select>
          </div>

          <div className="payments-field">
            <label htmlFor="payment-amount">Amount (₹) *</label>

            <input
              id="payment-amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="payments-field">
            <label htmlFor="payment-date">Payment Date *</label>

            <input
              id="payment-date"
              name="paymentDate"
              type="date"
              value={form.paymentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="payments-field">
            <label htmlFor="payment-method">Payment Method</label>

            <select
              id="payment-method"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="UPI">UPI</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="NET_BANKING">Net Banking</option>
            </select>
          </div>

          <div className="payments-field">
            <label htmlFor="payment-status">Payment Status</label>

            <select
              id="payment-status"
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
            >
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div className="payments-form-actions">
            <button
              type="submit"
              className="payments-submit-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "✓ Update Payment"
                  : "+ Add Payment"}
            </button>

            <button
              type="button"
              className="payments-reset-button"
              onClick={resetForm}
            >
              ✕ {editingId !== null ? "Cancel Edit" : "Reset"}
            </button>
          </div>
        </form>
      </section>

      {/* PAYMENT HISTORY */}
      <section className="payments-panel">
        <div className="payments-table-heading">
          <div className="payments-table-title">
            <div className="payments-list-icon">▤</div>

            <div>
              <h2>Payment History</h2>
              <p>View and manage all recorded payments.</p>
              <span className="payments-total-count">
                Total records: {filteredPayments.length}
              </span>
            </div>
          </div>

          <div className="payments-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search ID, member, method or status..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="payments-table-scroll">
          <table className="payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>MEMBER ID</th>
                <th>AMOUNT</th>
                <th>DATE</th>
                <th>METHOD</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="payments-empty">
                    Loading payments...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="payments-empty">
                    {search
                      ? "No payments match your search."
                      : "No payment records found."}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const status = String(
                    payment.paymentStatus || payment.status || "PENDING"
                  ).toUpperCase();

                  return (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>#{payment.memberId}</td>

                      <td className="payments-amount-cell">
                        ₹{formatAmount(payment.amount)}
                      </td>

                      <td>{formatDate(payment.paymentDate)}</td>

                      <td>
                        <span className="payments-method-badge">
                          {payment.paymentMethod || "—"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`payments-status-badge payment-status-${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="payments-action-buttons">
                          <button
                            type="button"
                            className="payments-edit-button"
                            onClick={() => handleEdit(payment)}
                          >
                            ✎ Edit
                          </button>

                          <button
                            type="button"
                            className="payments-delete-button"
                            onClick={() => handleDelete(payment)}
                          >
                            ▤ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Payments;

