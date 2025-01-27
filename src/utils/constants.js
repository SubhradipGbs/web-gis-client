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
      {
        id: 1,
        name: "User Reports",
        path: "/reports/user",
      },
      {
        id: 2,
        name: "Land Records",
        path: "/reports/land",
      },
      {
        id: 2,
        name: "Master Land Records",
        path: "/reports/land-master",
      },
    ],
  },
];
