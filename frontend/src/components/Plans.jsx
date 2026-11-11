import React, { useEffect, useState } from "react";

import {
  getAllPlans,
  addPlan,
  updatePlan,
  deletePlan,
} from "../services/api";

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const emptyForm = {
    planName: "",
    durationMonths: "",
    price: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  // Component open ayinappudu plans load avuthayi
  useEffect(() => {
    loadPlans();
  }, []);

  // Backend nunchi plans fetch cheyyadam
  const loadPlans = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllPlans();

      setPlans(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Plans load avvaledu. Backend server check cheyyi.");
    } finally {
      setLoading(false);
    }
  };

  // Input fields values update cheyyadam
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add Plan / Update Plan
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Validation
    if (!form.planName.trim()) {
      setError("Please enter the plan name.");
      return;
    }

    if (
      !form.durationMonths ||
      Number(form.durationMonths) <= 0
    ) {
      setError("Duration must be greater than zero.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setError("Please enter a valid plan price.");
      return;
    }

    const planData = {
      planName: form.planName.trim(),
      durationMonths: Number(form.durationMonths),
      price: Number(form.price),
      description: form.description.trim(),
    };

    try {
      if (editingId !== null) {
        // Existing plan update
        await updatePlan(editingId, planData);

        setMessage("Membership plan updated successfully!");
      } else {
        // New plan add
        await addPlan(planData);

        setMessage("New membership plan added successfully!");
      }

      // Form reset
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      // Updated plans fetch cheyyadam
      await loadPlans();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Plan save cheyyadam fail ayyindi. Backend API check cheyyi."
      );
    }
  };

  // Add New Plan popup open cheyyadam
  const handleAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);

    setMessage("");
    setError("");
  };

  // Edit button click chesinappudu popup open cheyyadam
  const handleEdit = (plan) => {
    setEditingId(plan.id);

    setForm({
      planName: plan.planName || "",
      durationMonths: String(plan.durationMonths ?? ""),
      price: String(plan.price ?? ""),
      description: plan.description || "",
    });

    setShowForm(true);

    setMessage("");
    setError("");
  };

  // Popup close and form reset
  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  // Delete Plan
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this membership plan?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await deletePlan(id);

      setMessage("Membership plan deleted successfully!");

      if (editingId === id) {
        handleCancel();
      }

      await loadPlans();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Plan delete cheyyalekapoyam. Ee plan members use chestunte backend reject cheyyachu."
      );
    }
  };

  // Search by plan name or description
  const filteredPlans = plans.filter((plan) => {
    const searchText = search.toLowerCase();

    return (
      (plan.planName || "")
        .toLowerCase()
        .includes(searchText) ||
      (plan.description || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  // Highest plan price
  const highestPrice =
    plans.length > 0
      ? Math.max(
          ...plans.map((plan) => Number(plan.price || 0))
        )
      : 0;

  // Longest membership duration
  const longestDuration =
    plans.length > 0
      ? Math.max(
          ...plans.map(
            (plan) => Number(plan.durationMonths || 0)
          )
        )
      : 0;

  return (
    <div className="plans-page">

      {/* PAGE HEADER */}
      <div className="plans-header">
        <div>
          <span className="plans-eyebrow">
            FITZONE MANAGEMENT
          </span>

          <h1>Membership Plans</h1>

          <p>
            Create and manage your gym membership plans.
          </p>
        </div>

        <button
          type="button"
          className="plans-refresh-btn"
          onClick={loadPlans}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="plans-stats">

        {/* Total Plans */}
        <div className="plans-stat-card">
          <div className="plans-stat-icon">
            ▤
          </div>

          <div>
            <p>Total Plans</p>

            <h2>{plans.length}</h2>

            <span>Available membership plans</span>
          </div>
        </div>

        {/* Highest Price */}
        <div className="plans-stat-card">
          <div className="plans-stat-icon">
            ₹
          </div>

          <div>
            <p>Highest Plan Price</p>

            <h2>
              ₹{highestPrice.toLocaleString("en-IN")}
            </h2>

            <span>Maximum listed plan price</span>
          </div>
        </div>

        {/* Longest Duration */}
        <div className="plans-stat-card">
          <div className="plans-stat-icon">
            ◷
          </div>

          <div>
            <p>Longest Duration</p>

            <h2>
              {longestDuration}{" "}
              <small>Months</small>
            </h2>

            <span>Longest available membership</span>
          </div>
        </div>

      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="plans-alert plans-success">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="plans-alert plans-error">
          {error}
        </div>
      )}

      {/* ADD NEW PLAN BUTTON */}
      <div className="plans-add-toolbar">
        <button
          type="button"
          className="plans-submit-btn"
          onClick={handleAdd}
        >
          + Add New Plan
        </button>
      </div>

      {/* ADD / EDIT PLAN POPUP */}
      {showForm && (
        <div
          className="plans-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCancel();
            }
          }}
        >
          <section
            className="plans-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="plans-modal-title"
          >

            {/* POPUP HEADER */}
            <div className="plans-modal-header">
              <div>
                <span className="plans-eyebrow">
                  FITZONE MANAGEMENT
                </span>

                <h2 id="plans-modal-title">
                  {editingId !== null
                    ? "Edit Membership Plan"
                    : "Add New Plan"}
                </h2>

                <p>
                  Enter the membership plan details below.
                </p>
              </div>

              <button
                type="button"
                className="plans-modal-close"
                onClick={handleCancel}
                aria-label="Close popup"
              >
                ×
              </button>
            </div>

            {/* PLAN FORM */}
            <form
              onSubmit={handleSubmit}
              className="plans-form"
            >
              <div className="plans-form-grid">

                {/* Plan Name */}
                <div className="plans-field">
                  <label htmlFor="planName">
                    Plan Name *
                  </label>

                  <input
                    id="planName"
                    type="text"
                    name="planName"
                    placeholder="e.g. Monthly"
                    value={form.planName}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>

                {/* Duration */}
                <div className="plans-field">
                  <label htmlFor="durationMonths">
                    Duration (Months) *
                  </label>

                  <input
                    id="durationMonths"
                    type="number"
                    name="durationMonths"
                    min="1"
                    step="1"
                    placeholder="e.g. 1"
                    value={form.durationMonths}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Price */}
                <div className="plans-field">
                  <label htmlFor="price">
                    Price (₹) *
                  </label>

                  <input
                    id="price"
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 1000"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="plans-field">
                  <label htmlFor="description">
                    Description
                  </label>

                  <input
                    id="description"
                    type="text"
                    name="description"
                    placeholder="Describe this membership plan"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

              </div>

              {/* FORM BUTTONS */}
              <div className="plans-form-actions">

                <button
                  type="button"
                  className="plans-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="plans-submit-btn"
                >
                  {editingId !== null
                    ? "✓ Update Plan"
                    : "+ Add Plan"}
                </button>

              </div>
            </form>

          </section>
        </div>
      )}

      {/* ALL MEMBERSHIP PLANS TABLE */}
      <section className="plans-panel plans-table-panel">

        {/* TABLE HEADER */}
        <div className="plans-panel-heading plans-table-heading">

          <div>
            <h2>All Membership Plans</h2>

            <p>
              Total plans:{" "}
              <strong>{plans.length}</strong>
            </p>
          </div>

          {/* SEARCH */}
          <div className="plans-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search plans..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </div>

        {/* TABLE */}
        <div className="plans-table-wrapper">
          <table className="plans-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Plan Name</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {/* Loading */}
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="plans-empty"
                  >
                    Loading membership plans...
                  </td>
                </tr>
              ) : filteredPlans.length === 0 ? (

                /* No Plans */
                <tr>
                  <td
                    colSpan="6"
                    className="plans-empty"
                  >
                    {search
                      ? "No plans match your search."
                      : "No membership plans found. Add your first plan."}
                  </td>
                </tr>

              ) : (

                /* Display Plans */
                filteredPlans.map((plan) => (
                  <tr key={plan.id}>

                    {/* ID */}
                    <td>
                      <span className="plans-id">
                        #{plan.id}
                      </span>
                    </td>

                    {/* Plan Name */}
                    <td>
                      <div className="plans-name-cell">
                        <span className="plans-name-icon">
                          ✦
                        </span>

                        <strong>
                          {plan.planName}
                        </strong>
                      </div>
                    </td>

                    {/* Duration */}
                    <td>
                      <span className="plans-duration">
                        {plan.durationMonths} Month(s)
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      <strong className="plans-price">
                        ₹
                        {Number(
                          plan.price || 0
                        ).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    {/* Description */}
                    <td className="plans-description">
                      {plan.description || "—"}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="plans-action-buttons">

                        <button
                          type="button"
                          className="plans-edit-btn"
                          onClick={() => handleEdit(plan)}
                          title="Edit plan"
                        >
                          ✎ Edit
                        </button>

                        <button
                          type="button"
                          className="plans-delete-btn"
                          onClick={() =>
                            handleDelete(plan.id)
                          }
                          title="Delete plan"
                        >
                          ✕ Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))

              )}

            </tbody>

          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="plans-table-footer">
          Showing {filteredPlans.length} of{" "}
          {plans.length} membership plans
        </div>

      </section>

    </div>
  );
}

export default Plans;