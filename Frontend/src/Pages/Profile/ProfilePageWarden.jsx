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
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  color: white;
`;

const ProfilePageWarden = () => {
  const handleLogout = () => {
    alert("Logged out!");
  };
  const routing = {title:"Warden dashboard",Home: '/warden-dashboard', Profile: '/profile-warden', Attendence:'/fetch-attendance', Notice: '/view-notice', Menu: '/view-mess-menu' }

  const handleSetPassword = () => {
    alert("Redirecting to set password page!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-6">
      <MiniVariantDrawer router={routing} />

      <GlassCard>
        <Typography
          variant="h5"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Warden Details
        </Typography>

        {/* Warden Information Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { label: "Name", value: "Dr. Rajesh Kumar" },
            { label: "Phone No.", value: "9876543210" },
            { label: "Email", value: "warden.mpec@gmail.com" },
            { label: "Aadhar No.", value: "123456789012" },
            { label: "Gender", value: "Male" },
            { label: "Hostel", value: "Aryabhatt" },
            { label: "Post", value: "Chief Warden" },
            { label: "Address", value: "MPEC Hostel Campus, Lucknow" },
          ].map((item, index) => (
            <Typography
              key={index}
              variant="body1"
              style={{
                fontSize: "16px",
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
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <Button label="Logout" onClick={handleLogout} />
          <Button label="Set Password" onClick={handleSetPassword} />
        </div>
      </GlassCard>
    </div>
  );
};

export default ProfilePageWarden;
