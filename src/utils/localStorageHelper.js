// src/utils/localStorageHelper.js

export const OFFICERS_KEY = "officers_v1";
export const COMPLAINTS_KEY = "complaints_v1";
export const CURRENT_USER_KEY = "currentUser_v1";

export function initSampleData() {
  if (!localStorage.getItem(OFFICERS_KEY)) {
    const officers = [
      { id: "off1", name: "Officer A", username: "officerA" },
      { id: "off2", name: "Officer B", username: "officerB" },
      { id: "off3", name: "Officer C", username: "officerC" }
    ];
    localStorage.setItem(OFFICERS_KEY, JSON.stringify(officers));
  }

  if (!localStorage.getItem(COMPLAINTS_KEY)) {
    const complaints = [
      {
        id: "G-1001",
        title: "Pothole on road",
        category: "Road",
        location: "Sector 5",
        status: "Pending",
        assignedTo: null,
        priority: null,
        deadline: null,
        remarks: ""
      },
      {
        id: "G-1002",
        title: "Street light not working",
        category: "Electricity",
        location: "Sector 3",
        status: "Pending",
        assignedTo: null,
        priority: null,
        deadline: null,
        remarks: ""
      }
    ];
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  }
}

export function getOfficers() {
  return JSON.parse(localStorage.getItem(OFFICERS_KEY) || "[]");
}

export function getComplaints() {
  return JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || "[]");
}

export function setComplaints(list) {
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(list));
}

export function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
