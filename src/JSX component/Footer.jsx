import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

const Footer = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(2); // Default to Student

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setValue(2);
    else if (path.startsWith("/AdminLayout")) setValue(1);
    else if (path.startsWith("/HODLayout")) setValue(0);
    else if (path.startsWith("/StaffLayout")) setValue(3);
    else if (path === "/About") setValue(4);
  }, [location.pathname]);

  const handleNav = (newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        nav("/HODLayout");
        break;
      case 1:
        nav("/AdminLayout");
        break;
      case 2:
        nav("/");
        break;
      case 3:
        nav("/StaffLayout");
        break;
      case 4:
        nav("/About");
        break;
      default:
        break;
    }
  };

  const navItems = [
    { label: "HOD", icon: "/hod.png" },
    { label: "Admin", icon: "/admin.png" },
    { label: "Student", icon: "/student.png" },
    { label: "Staff", icon: "/staff.png" },
    // { label: "About", icon: "/about.png" },
  ];

  const activeColor = `rgb(50, 59, 189)`; // Dark Blue

  return (
    <Paper
      elevation={10}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100vw",
        borderRadius: "12px 12px 0 0",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        padding: "10px 0",
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(e, newValue) => handleNav(newValue)}
        sx={{
          backgroundColor: "#ffffff",
          "& .MuiBottomNavigationAction-root": {
            transition: "all 0.3s ease",
            py: 2,
            minWidth: 60,
            flex: 1,
            "&.Mui-selected": {
              color: activeColor,
              fontWeight: "bold",
            },
            "&:hover": {
              backgroundColor: "#f3f3f3",
            },
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "11px",
            mt: "0px",
          },
        }}
      >
        {navItems.map((item, idx) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={
              <img
                src={item.icon}
                alt={item.label}
                style={{
                  width: value === idx ? 45 : 28,
                  height: value === idx ? 45 : 28,
                  transition: "all 0.3s ease",
                }}
              />
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default Footer;
