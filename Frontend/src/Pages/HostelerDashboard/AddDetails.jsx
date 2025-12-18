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

const AddDetails = () => {
	const routing = {
		title: "Add details",
		Home: "/hosteler-dashboard",
		Profile: "/profile-hosteler",
		Notice: "/view-notice",
		Menu: "/view-mess-menu",
	};

  const date = new Date().toISOString();
  //console.log(date.split("T")[0])
  const [dob, setDob] = useState(date.split("T")[0]);
	const [bloodGroup, setBloodGroup] = useState();
	const [localGuardian, setLocalGuardian] = useState();
	const [localGuardianPhone, setLocalGuardianPhone] = useState();
	const [localGuardianAddress, setLocalGuardianAddress] = useState();
	const [fatherPhone, setFatherPhone] = useState();
	const [motherPhone, setMotherPhone] = useState();
	const [fatherEmail, setFatherEmail] = useState();
	const [motherEmail, setMotherEmail] = useState();
	const [course, setCourse] = useState();
	const [branch, setBranch] = useState();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const { localhost } = useStore();

	const handleSubmit = async () => {
		if (
			!dob ||
			!bloodGroup ||
			!localGuardian ||
			!localGuardianPhone ||
			!localGuardianAddress ||
			!fatherPhone ||
			!motherPhone ||
			!fatherEmail ||
			!motherEmail ||
			!course ||
			!branch
		) {
			setErrorMessage("Please fill all fields");
			setError(true);
			return;
		}

		setLoading(true);
		setError(false);

		try {
			const response = await fetch(
				`${localhost}/api/hostler/adddetails`, // Consider using environment variables here
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						date_of_birth: dob,
						blood_group: bloodGroup,
						local_guardian: localGuardian,
						local_guardian_phone: localGuardianPhone,
						local_guardian_address: localGuardianAddress,
						fathers_no: fatherPhone,
						mothers_no: motherPhone,
						fathers_email: fatherEmail,
						mothers_email: motherEmail,
						course,
						branch,
					}),
				}
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Failed to add details");
			}
			navigate("/profile-hosteler");
		} catch (error) {
			setErrorMessage(error.message || "An unknown error occurred");
			setError(true);
			//console.log("Error adding details:", error);
		} finally {
			setLoading(false);
		}
	};

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