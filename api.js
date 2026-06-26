
const BASE = "http://localhost:5000/bridge";


async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}


export const login = (username, password) =>
  request("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const logout = () =>
  request("/logout", { method: "POST" });


export const getDashboard = () => request("/dashboard");

export const getYearLevels = () => request("/year-levels");

export const getSections = (yearLevel) =>
  request(`/sections/${yearLevel}`);


export const getStudentsBySection = (section) =>
  request(`/students/${section}`);

export const getStudentDetails = (studentNo) =>
  request(`/student/${studentNo}`);


export const generatePreAdvising = (payload) =>
  request("/pre-advising", {
    method: "POST",
    body: JSON.stringify(payload),
  });


export const getScheduleBySection = (section) =>
  request(`/schedule/${section}`);

export const getAllSchedules = () => request("/schedule/all");


export const getProfile = () => request("/profile");

export const updateProfile = (updates) =>
  request("/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });

export const uploadProfilePic = (file) => {
  const form = new FormData();
  form.append("file", file);
  return fetch(`${BASE}/profile/upload`, { method: "POST", body: form }).then(
    (r) => r.json()
  );
};

export const deleteProfilePic = () =>
  request("/profile/picture", { method: "DELETE" });
