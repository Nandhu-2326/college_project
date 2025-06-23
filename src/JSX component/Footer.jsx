import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { MdAdminPanelSettings, MdSchool } from "react-icons/md"; // Material Icons
import { HiOutlineUserGroup } from "react-icons/hi2";
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
const Footer = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(2); // Default to Student

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setValue(2);
    else if (path === "/AdminLogin") setValue(1);
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
    { label: "HOD", icon: HiOutlineUserGroup },
    { label: "Admin", icon: MdAdminPanelSettings },
    { label: "Student", icon: MdSchool },
    { label: "Staff", icon: FaChalkboardTeacher },
    { label: "About", icon: IoIosInformationCircleOutline },
  ];

  const activeColor = ` rgb(50, 59, 189)`; // Dark Blue
  const defaultColor = "#333";

  return (
    <Paper
      elevation={10}
      sx={{
        position: "fixed",
        bottom: 4,
        left: 10,
        right: 10,
        borderRadius: "10px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
        zIndex: 2000,
        overflow: "hidden",
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(e, newValue) => handleNav(newValue)}
        sx={{
          backgroundColor: "#ffffff",
          "& .MuiBottomNavigationAction-root": {
            color: defaultColor,
            transition: "all 0.3s ease",
            py: 1.2,
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
            fontSize: "10px",
            mt: "1px",
          },
        }}
      >
        {navItems.map((item, idx) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={
              <item.icon
                size={value === idx ? 26 : 22}
                style={{
                  color: value === idx ? activeColor : defaultColor,
                  transform: value === idx ? "scale(1.15)" : "scale(1)",
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
