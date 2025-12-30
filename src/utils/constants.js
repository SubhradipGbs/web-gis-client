import React from "react";
import { FaClipboardList, FaMapMarkedAlt } from "react-icons/fa";

export const demoUsers = [
  { id: 1, username: "admin", password: "admin", role: "admin" },
  { id: 2, username: "user", password: "user", role: "user" },
];

export const demoReports = [
  {
    userId: 1,
    username: "admin",
    type: "login",
    timestamp: "2021-07-09T12:00:00",
  },
  {
    userId: 2,
    username: "user",
    type: "login",
    timestamp: "2021-07-09T12:00:00",
  },
  {
    userId: 1,
    username: "admin",
    type: "logout",
    timestamp: "2021-07-09T12:30:00",
  },
  {
    userId: 2,
    username: "user",
    type: "logout",
    timestamp: "2021-07-09T12:30:00",
  },
];

export const demoMenu = [
  {
    id: 1,
    name: "View Map",
    icon: React.createElement(FaMapMarkedAlt),
    path: "/",
  },
  {
    id: 2,
    name: "Reports",
    icon: React.createElement(FaClipboardList),
    child: [
      // {
      //   id: 1,
      //   name: "User Reports",
      //   path: "/reports/user",
      // },
      {
        id: 2,
        name: "Land Records",
        path: "/reports/land",
      },
      // {
      //   id: 4,
      //   name: "New Land Records",
      //   path: "/reports/new-land",
      // },
      {
        id: 3,
        name: "Master Land Records",
        path: "/reports/land-master",
      },
    ],
  },
];

export const colorCodes = [
  // {
  //   title: "12 Acres Basalt",
  //   color: "#ffffff",
  //   border: "#F3B1A6",
  // },
  { title: "Basalt Boundary", color: "#ffffff", border: "#6FFF54" , class: "border-3"},
  { title: "Coal Boundary", color: "#FFFFFF", border: "#FF0000", class: "border-3" },
  { title: "Borehole", color: "#40ff00", border: "#00b29d", class: "round" },
  {
    title: "Fully Purchased",
    color:
      "repeating-linear-gradient( -45deg, #00FF00, #00FF00 1px, #ffffff 1px, #ffffff 4px )",
    border: "#00FF00",
    class: "border-3",
  },

  { title: "Partly Purchased Coal", color: "rgba(96, 130, 182, 0.5)", border: "red", class:"border-3" },
  { title: "Partly Purchased Basalt", color: "#FFC0CB", border: "#640064", class:"border-3" },
  { title: "Forest Land", color: "rgba(34, 139, 34, 0.7)", border: "#006400", class: "border-3" },
  // { title: "Other's Land", color: "#E8F4F8", border: "#2C5F7D", class: "border-3" },
  { title: "Vested Land", color: "rgba(255, 215, 0, 0.6)", border: "#B8860B", class: "border-3" },
  { title: "Rayati Land", color: "rgba(74, 144, 226, 0.35)", border: "rgba(255, 215, 0, 0.95)", class: "border-3" },
  // { title: "Land records", color: "lightgray", border: "#000000", class: "border-3" },
];

// background-color: #e5e5f7;
// opacity: 0.8;
// background: repeating-linear-gradient( -45deg, #00FF00, #00FF00 2px, #e5e5f7 2px, #e5e5f7 10px );

// background-color: #e5e5f7;
// opacity: 0.8;
// background: repeating-linear-gradient( -45deg, #108f34, #108f34 2px, #e5e5f7 2px, #e5e5f7 10px );
//background: repeating-linear-gradient(0deg, #ffffff 0, #ffffff 20%, transparent 0, transparent 50%),repeating-linear-gradient(135deg, #86d78e 0, #86d78e 10%, transparent 0, transparent 50%);
//         background-size: 1em 1em;
//         background-color: #ffffff;
//         opacity: 1
