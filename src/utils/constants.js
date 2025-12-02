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
  {
    title: "12 Acres Basalt",
    color: "#ffffff",
    border: "#F3B1A6",
  },
  { title: "Basalt Boundary", color: "#ffffff", border: "#000033" },
  { title: "Coal Boundary", color: "#FFFFFF", border: "#FF0000" },
  { title: "Borehole", color: "#40ff00", border: "#00b29d", class: "round" },
  {
    title: "Fully Purchased",
    color:
      "repeating-linear-gradient(0deg, #ffffff 0, #ffffff 20%, transparent 0, transparent 50%),repeating-linear-gradient(135deg, #76ad7f 0, #76ad7f 5%, transparent 0, transparent 30%)",
    border: "#608a67",
  },

  { title: "Partly Purchased Land", color: "#F1C9C3", border: "#54466D" },
  { title: "Partly Purchased Portion", color: "#063970", border: "#8B0000" },
  { title: "Forest Land", color: "#228B22", border: "#006400" },
  { title: "Other's Land", color: "#ADD8E6", border: "#8B0000" },
  { title: "Vested Land", color: "#FFD700", border: "#B8860B" },
  { title: "Rayati Land", color: "#D2DCF3", border: "#84878E" },
  { title: "Land records", color: "lightgray", border: "#000000" },
];

// background-color: #e5e5f7;
// opacity: 0.8;
// background: repeating-linear-gradient( -45deg, #108f34, #108f34 2px, #e5e5f7 2px, #e5e5f7 10px );
//background: repeating-linear-gradient(0deg, #ffffff 0, #ffffff 20%, transparent 0, transparent 50%),repeating-linear-gradient(135deg, #86d78e 0, #86d78e 10%, transparent 0, transparent 50%);
//         background-size: 1em 1em;
//         background-color: #ffffff;
//         opacity: 1
