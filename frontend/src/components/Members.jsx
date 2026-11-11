
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllMembers,
  addMember,
  updateMember,
  deleteMember,
  getAllPlans,
} from "../services/api";

const emptyMember = {
  name: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  membershipType: "Monthly",
  status: "ACTIVE",
  startDate: "",
  endDate: "",
};

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function formatDate(date) {
  return date ? String(date).slice(0, 10) : "";
}

function getPlanName(plan) {
  return plan?.planName || plan?.membershipType || "Monthly";
}

function Members() {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyMember);
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
      const [memberResponse, planResponse] = await Promise.all([
        getAllMembers(),
        getAllPlans(),
      ]);

      setMembers(
        Array.isArray(memberResponse.data) ? memberResponse.data : []
      );

      setPlans(
        Array.isArray(planResponse.data) ? planResponse.data : []
      );
    } catch (err) {
      setError(
        "Members load avvaledu. Backend port 8082 check cheyyi. " +
          getErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeCount = members.filter(
    (member) => String(member.status).toUpperCase() === "ACTIVE"
  ).length;

  const expiredCount = members.filter(
    (member) => String(member.status).toUpperCase() === "EXPIRED"
  ).length;

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return members;

    return members.filter((member) => {
      const searchableValues = [
        member.id,
        member.name,
        member.fullName,
        member.email,
        member.phone,
        member.membershipType,
        member.planName,
        member.status,
      ];

      return searchableValues.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [members, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyMember);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Please enter member name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter email address.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter phone number.");
      return;
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      age: form.age === "" ? null : Number(form.age),
      gender: form.gender,
      membershipType: form.membershipType,
      status: form.status,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await updateMember(editingId, payload);
        setSuccess("Member updated successfully!");
      } else {
        await addMember(payload);
        setSuccess("Member added successfully!");
      }

      setForm(emptyMember);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);

    setForm({
      name: member.name ?? member.fullName ?? "",
      email: member.email ?? "",
      phone: member.phone ?? "",
      age: member.age ?? "",
      gender: member.gender ?? "",
      membershipType:
        member.membershipType ?? member.planName ?? "Monthly",
      status: member.status ?? "ACTIVE",
      startDate: formatDate(member.startDate),
      endDate: formatDate(member.endDate),
    });

    setError("");
    setSuccess("");

    document
      .getElementById("member-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (member) => {
    const memberName = member.name ?? member.fullName ?? "this member";

    if (!window.confirm(`Are you sure you want to delete ${memberName}?`)) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteMember(member.id);

      if (editingId === member.id) {
        setForm(emptyMember);
        setEditingId(null);
      }

      setSuccess("Member deleted successfully!");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="members-page">
      {/* Page heading */}
      <div className="members-page-header">
        <div className="members-title-group">
          <div className="members-title-icon">♟</div>

          <div>
            <h1>
              Members <span>Management</span>
            </h1>
            <p>Add, update, search and manage gym members.</p>
          </div>
        </div>

        <button
          type="button"
          className="members-refresh-button"
          onClick={loadData}
          disabled={loading}
        >
          ⟳ {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="members-alert members-error">
          {error}
        </div>
      )}

      {success && (
        <div className="members-alert members-success">
          ✓ {success}
        </div>
      )}

      {/* Summary cards */}
      <section className="members-summary-grid">
        <div className="members-summary-card members-summary-green">
          <div className="members-summary-icon">👥</div>
          <div>
            <p>Total Members</p>
            <h2>{members.length}</h2>
            <small>All registered members</small>
          </div>
        </div>

        <div className="members-summary-card members-summary-blue">
          <div className="members-summary-icon">👤</div>
          <div>
            <p>Active Members</p>
            <h2>{activeCount}</h2>
            <small>Currently active</small>
          </div>
        </div>

        <div className="members-summary-card members-summary-red">
          <div className="members-summary-icon">◷</div>
          <div>
            <p>Expired Members</p>
            <h2>{expiredCount}</h2>
            <small>Membership expired</small>
          </div>
        </div>

        <div className="members-summary-card members-summary-purple">
          <div className="members-summary-icon">▥</div>
          <div>
            <p>Membership Plans</p>
            <h2>{plans.length}</h2>
            <small>Available plan types</small>
          </div>
        </div>
      </section>

      {/* Add or edit form */}
      <section className="members-panel" id="member-form">
        <div className="members-panel-heading">
          <div className="members-panel-icon">
            {editingId !== null ? "✎" : "+"}
          </div>

          <div>
            <h2>
              {editingId !== null ? "Edit Member" : "Add New Member"}
            </h2>
            <p>
              {editingId !== null
                ? "Update the selected member details."
                : "Fill in the details to register a new gym member."}
            </p>
          </div>
        </div>

        <form className="members-form" onSubmit={handleSubmit}>
          <div className="members-field">
            <label htmlFor="member-name">Full Name *</label>
            <input
              id="member-name"
              name="name"
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="members-field">
            <label htmlFor="member-email">Email *</label>
            <input
              id="member-email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="members-field">
            <label htmlFor="member-phone">Phone *</label>
            <input
              id="member-phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="members-field">
            <label htmlFor="member-age">Age</label>
            <input
              id="member-age"
              name="age"
              type="number"
              min="1"
              max="120"
              placeholder="Enter age"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div className="members-field">
            <label htmlFor="member-gender">Gender *</label>
            <select
              id="member-gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="members-field">
            <label htmlFor="member-plan">Membership Plan</label>
            <select
              id="member-plan"
              name="membershipType"
              value={form.membershipType}
              onChange={handleChange}
            >
              {plans.length > 0 ? (
                plans.map((plan) => {
                  const planName = getPlanName(plan);

                  return (
                    <option
                      key={plan.id ?? planName}
                      value={planName}
                    >
                      {planName}
                    </option>
                  );
                })
              ) : (
                <>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </>
              )}
            </select>
          </div>

          <div className="members-field">
            <label htmlFor="member-status">Status</label>
            <select
              id="member-status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>

          <div className="members-field">
            <label htmlFor="member-start-date">Start Date</label>
            <input
              id="member-start-date"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="members-field">
            <label htmlFor="member-end-date">End Date</label>
            <input
              id="member-end-date"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="members-form-actions">
            <button
              type="submit"
              className="members-submit-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "✓ Update Member"
                  : "+ Add Member"}
            </button>

            <button
              type="button"
              className="members-reset-button"
              onClick={resetForm}
            >
              ✕ {editingId !== null ? "Cancel Edit" : "Reset"}
            </button>
          </div>
        </form>
      </section>

      {/* Members table */}
      <section className="members-panel members-table-panel">
        <div className="members-table-heading">
          <div className="members-table-title">
            <div className="members-list-icon">☷</div>

            <div>
              <h2>All Members</h2>
              <p>View and manage all gym members.</p>
              <span className="members-total-count">
                Total records: {filteredMembers.length}
              </span>
            </div>
          </div>

          <div className="members-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="members-table-scroll">
          <table className="members-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>GENDER</th>
                <th>PLAN</th>
                <th>START DATE</th>
                <th>END DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="members-empty">
                    Loading members...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="members-empty">
                    {search
                      ? "No members match your search."
                      : "No members found. Add a member above."}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const name = member.name ?? member.fullName ?? "—";
                  const plan =
                    member.membershipType ?? member.planName ?? "—";
                  const status = String(
                    member.status ?? "ACTIVE"
                  ).toUpperCase();

                  return (
                    <tr key={member.id}>
                      <td>{member.id}</td>
                      <td className="members-name-cell">{name}</td>
                      <td>{member.email || "—"}</td>
                      <td>{member.phone || "—"}</td>
                      <td>{member.gender || "—"}</td>

                      <td>
                        <span
                          className={`members-plan-badge ${String(
                            plan
                          ).toLowerCase()}`}
                        >
                          {plan}
                        </span>
                      </td>

                      <td>{formatDate(member.startDate) || "—"}</td>
                      <td>{formatDate(member.endDate) || "—"}</td>

                      <td>
                        <span
                          className={`members-status-badge ${
                            status === "ACTIVE"
                              ? "status-active"
                              : "status-expired"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="members-action-buttons">
                          <button
                            type="button"
                            className="members-edit-button"
                            onClick={() => handleEdit(member)}
                          >
                            ✎ Edit
                          </button>

                          <button
                            type="button"
                            className="members-delete-button"
                            onClick={() => handleDelete(member)}
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

export default Members;

