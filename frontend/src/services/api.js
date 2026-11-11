import axios from "axios";

const api = axios.create({
  baseURL: "https://fitzone-gym-gtl5.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= JWT TOKEN INTERCEPTOR =================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= MEMBERS APIs =================

// Get All Members
export const getAllMembers = () => api.get("/members");

// Get Member By ID
export const getMemberById = (id) => api.get(`/members/${id}`);

// Add Member
export const addMember = (member) => api.post("/members", member);

// Update Member
export const updateMember = (id, member) =>
  api.put(`/members/${id}`, member);

// Delete Member
export const deleteMember = (id) => api.delete(`/members/${id}`);

// Get Active Members
export const getActiveMembers = () => api.get("/members/active");

// Get Expired Members
export const getExpiredMembers = () => api.get("/members/expired");

// Get Members Expiring Within Next 7 Days
export const getExpiringSoonMembers = () =>
  api.get("/members/expiring-soon");

// Search Members By Name
export const searchMembers = (name) =>
  api.get(`/members/search?name=${encodeURIComponent(name)}`);

// Search Members By Phone
export const searchMembersByPhone = (phone) =>
  api.get(`/members/phone/${encodeURIComponent(phone)}`);

// Search Members By Membership Plan
export const searchMembersByPlan = (plan) =>
  api.get(`/members/plan/${encodeURIComponent(plan)}`);

// ================= MEMBERSHIP PLANS APIs =================

// Get All Plans
export const getAllPlans = () => api.get("/plans");

// Get Plan By ID
export const getPlanById = (id) => api.get(`/plans/${id}`);

// Add Plan
export const addPlan = (plan) => api.post("/plans", plan);

// Update Plan
export const updatePlan = (id, plan) =>
  api.put(`/plans/${id}`, plan);

// Delete Plan
export const deletePlan = (id) => api.delete(`/plans/${id}`);

// ================= PAYMENTS APIs =================

// Get All Payments
export const getAllPayments = () => api.get("/payments");

// Get Payment By ID
export const getPaymentById = (id) => api.get(`/payments/${id}`);

// Get Member Payment History
export const getPaymentsByMemberId = (memberId) =>
  api.get(`/payments/member/${memberId}`);

// Add Payment
export const addPayment = (payment) =>
  api.post("/payments", payment);

// Update Payment
export const updatePayment = (id, payment) =>
  api.put(`/payments/${id}`, payment);

// Delete Payment
export const deletePayment = (id) =>
  api.delete(`/payments/${id}`);

// ================= DEFAULT EXPORT =================

export default api;