import React from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import { Card, styled, Typography } from "@mui/material";
import Button from "../../components/Button"; 


const GlassCard = styled(Card)`
  width: 90%;
  max-width: 600px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: rgba(255, 255, 255, 0.2); /* Transparent glass effect */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  color: white;
`;

const ProfilePageHosteler = () => {
  const handleLogout = () => {
    alert("Logged out!");
  };

  const handleSetPassword = () => {
    alert("Redirecting to set password page!");
  };
  const routing = {title:"Add details",Home: '/hosteler-dashboard', Profile: '/profile-hosteler', Notice: '/view-notice', Menu: '/view-mess-menu' }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-6">
      <MiniVariantDrawer router={routing} />

      <GlassCard>
        <Typography
          variant="h5"
          style={{
            textAlign: "center",
            marginBottom: "16px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Profile SECTION
        </Typography>

        {/* Hosteler Information Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginLeft:"15px" }}>
          {[ 
            { label: "Name", value: "Abhay Gupta" },
            { label: "Roll No.", value: "2200461540002" },
            { label: "Aadhar No.", value: "84563289297" },
            { label: "Gender", value: "Male" },
            { label: "Father's Name", value: "Vipin Gupta" },
            { label: "Mother's Name", value: "Manju Gupta" },
            { label: "Phone No.", value: "9369274691" },
            { label: "Email", value: "ag4081315@gmail.com" },
            { label: "Address", value: "Hardoi" },
            { label: "Year", value: "3rd" },
            { label: "College", value: "MPEC" },
            { label: "Hostel", value: "Aryabhatt" },
            { label: "Room No.", value: "316" },
          ].map((item, index) => (
            <Typography
              key={index}
              variant="body1"
              style={{
                fontSize: "17px",
                fontWeight: "500",
                lineHeight: "1.5",
              }}
            >
              <span style={{ color: "#80d4ff", fontWeight: "bold" }}>
                {item.label}:
              </span>{" "}
              <span style={{ color: "#222222", fontWeight: "bold" }}>
                {item.value}
              </span>
            </Typography>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
          <Button label="Logout" onClick={handleLogout} />
          <Button label="Set Password" onClick={handleSetPassword} />
        </div>
      </GlassCard>
    </div>
  );
};

export default ProfilePageHosteler;
