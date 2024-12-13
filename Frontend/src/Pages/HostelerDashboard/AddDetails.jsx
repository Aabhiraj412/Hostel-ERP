import { useState } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import { Card, Box, styled, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";

const GlassCard = styled(Card)`
	width: 90%;
	max-width: 1000px;
	padding: 30px;
	margin: 90px auto 10px auto;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StyledTextField = styled(TextField)`
	.MuiOutlinedInput-root {
		background: rgba(255, 255, 255, 0.5);
		border-radius: 10px;
	}
`;

const dropdownStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius: '10px', 
    border: '1px solid rgba(255, 255, 255, 0.3)', 
    color: 'black',
    padding: '2px', 
    boxShadow: 'none',
    '&:hover': {
      border: '1px solid rgba(0, 0, 0, 0.5)', 
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: 'black', 
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
    ? 'rgba(0,0,0)' 
    : 'rgba(0,0,0)', 
  color: 'white', 
  cursor: 'pointer',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.8)',
    },
  }),
};



const AddDetails = () => {
  const routing = {title:"Add details",Home: '/hosteler-dashboard', Profile: '/profile-hosteler', Notice: '/view-notice', Menu: '/view-mess-menu' }
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  const hostelOptions = [
    { value: 'AryaBhatt', label: 'AryaBhatt' },
    { value: 'Saojini Naidu', label: 'Saojini Naidu' },
    { value: 'RN Tagore', label: 'RN Tagore' },
  ];

  const yearOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
  ];

  const genderOptions = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
  ];

	return (
		<>
			<MiniVariantDrawer router={routing} />
			<div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6 relative">
				<GlassCard
					sx={{
						margin: "auto",
						marginTop: { xs: "60px", md: "60px" },
						marginLeft: { xs: "60px", md: "240px" },
						marginBottom: "20px",
						width: "90%",
						maxWidth: "1000px",
						padding: "30px",
					}}
				>
					<Typography
						variant="h5"
						gutterBottom
						align="center"
						sx={{
							fontWeight: "bold",
							color: "white",
							marginBottom: "20px",
						}}
					>
						Add Your Details
					</Typography>
					<Box
						sx={{
							display: "grid",
							// gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
							gap: 3,
							width: "100%",
						}}
						className="mt-0 m-10"
					>
						<Typography className="text-white">
							Date of Birth
						</Typography>
						<StyledTextField
							fullWidth
							type="date"
							variant="outlined"
							size="small"
							value={dob}
							onChange={(e) => setDob(e.target.value)}
						/>
					</Box>

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
							gap: 3,
							width: "100%",
						}}
					>
						<StyledTextField
							fullWidth
							label="Blood Group"
							variant="outlined"
							size="small"
							value={bloodGroup}
							onChange={(e) => setBloodGroup(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Local Guardian"
							variant="outlined"
							size="small"
							value={localGuardian}
							onChange={(e) => setLocalGuardian(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Local Guardian Phone"
							variant="outlined"
							size="small"
							value={localGuardianPhone}
							onChange={(e) =>
								setLocalGuardianPhone(e.target.value)
							}
						/>
						<StyledTextField
							fullWidth
							label="Local Guardian Address"
							variant="outlined"
							size="small"
							value={localGuardianAddress}
							onChange={(e) =>
								setLocalGuardianAddress(e.target.value)
							}
						/>
						<StyledTextField
							fullWidth
							label="Father's Phone No."
							variant="outlined"
							size="small"
							value={fatherPhone}
							onChange={(e) => setFatherPhone(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Mother's Phone No."
							variant="outlined"
							size="small"
							value={motherPhone}
							onChange={(e) => setMotherPhone(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Father's Email"
							variant="outlined"
							size="small"
							value={fatherEmail}
							onChange={(e) => setFatherEmail(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Mother's Email"
							variant="outlined"
							size="small"
							value={motherEmail}
							onChange={(e) => setMotherEmail(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Course"
							variant="outlined"
							size="small"
							value={course}
							onChange={(e) => setCourse(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Branch"
							variant="outlined"
							size="small"
							value={branch}
							onChange={(e) => setBranch(e.target.value)}
						/>
					</Box>
					{loading ? (
						<ActivityIndicator size="large" />
					) : (
						<button
							className="mt-8 bg-black text-white font-medium px-6 py-3 rounded-lg shadow-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300"
							onClick={handleSubmit}
						>
							SUBMIT
						</button>
					)}
					{error && (
						<text className="text-red-600 text-center">
							{errorMessage}
						</text>
					)}
				</GlassCard>
			</div>
		</>
	);
};

export default AddDetails;
