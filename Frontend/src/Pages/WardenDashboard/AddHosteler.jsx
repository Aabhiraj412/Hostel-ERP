import { useState } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import { Card, Box, styled, Typography, TextField, Alert } from "@mui/material";
import Select from "react-select";
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
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		borderRadius: "10px",
		border: "1px solid rgba(255, 255, 255, 0.3)",
		color: "black",
		padding: "2px",
		boxShadow: "none",
		"&:hover": {
			border: "1px solid rgba(0, 0, 0, 0.5)",
		},
	}),
	singleValue: (base) => ({
		...base,
		color: "black",
	}),
	menu: (base) => ({
		...base,
		backgroundColor: "rgba(255, 255, 255, 0.7)",
		border: "1px solid rgba(255, 255, 255, 0.3)",
		borderRadius: "10px",
	}),
	option: (base, state) => ({
		...base,
		backgroundColor: state.isFocused ? "rgba(0,0,0)" : "rgba(0,0,0)",
		color: "white",
		cursor: "pointer",
		borderRadius: "4px",
		"&:hover": {
			backgroundColor: "rgba(0,0,0,0.8)",
		},
	}),
};

const AddHosteler = () => {
	const [selectedHostel, setSelectedHostel] = useState(null);
	const [selectedYear, setSelectedYear] = useState(null);
	const [selectedGender, setSelectedGender] = useState(null);
	const routing = {
		title: "Add New Hosteler",
		Home: "/warden-dashboard",
		Profile: "/profile-warden",
		Attendence: "/fetch-attendance",
		Notice: "/view-notice",
		Menu: "/view-mess-menu",
	};
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const { localhost } = useStore();
	const [name, setName] = useState();
	const [rollNo, setRollNo] = useState();
	const [aadharNo, setAadharNo] = useState();
	const [fatherName, setFatherName] = useState();
	const [motherName, setMotherName] = useState();
	const [phoneNo, setPhoneNo] = useState();
	const [email, setEmail] = useState();
	const [address, setAddress] = useState();
	const [college, setCollege] = useState();
	const [roomNo, setRoomNo] = useState();
	const [password, setPassword] = useState();

	const hostelOptions = [
		{ value: "Aryabhatt", label: "Aryabhatt" },
		{ value: "Saojni Naidu", label: "Saojni Naidu" },
		{ value: "RN Tagore", label: "RN Tagore" },
	];

	const yearOptions = [
		{ value: "1st", label: "1st" },
		{ value: "2nd", label: "2nd" },
		{ value: "3rd", label: "3rd" },
		{ value: "4th", label: "4th" },
	];

	const genderOptions = [
		{ value: "female", label: "Female" },
		{ value: "male", label: "Male" },
	];

	const handleSubmit = async () => {
		if (
			!selectedHostel ||
			!selectedYear ||
			!selectedGender ||
			!name ||
			!rollNo ||
			!aadharNo ||
			!fatherName ||
			!motherName ||
			!phoneNo ||
			!email ||
			!address ||
			!college ||
			!roomNo ||
			!password
		) {
			setErrorMessage("Please fill all fields");
			setError(true);
			return;
		}

		setLoading(true);
		setError(false);
		setErrorMessage("");
		try {
			const response = await fetch(
				`http://${localhost}/api/warden/addhostler`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						name,
						roll_no: rollNo,
						aadhar: aadharNo,
						fathers_name: fatherName,
						mothers_name: motherName,
						phone_no: phoneNo,
						email,
						address,
						college,
						room_no: roomNo,
						password,
						confirm_password: password,
						gender: selectedGender,
						hostel: selectedHostel,
						year: selectedYear,
					}),
				}
			);
			const result = await response.json();

      console.log(result);
			if (!response.ok) {
				throw new Error(result.message || "Failed to add hosteler");
			}

			alert("Hosteler added successfully!");

      setName("");
      setRollNo("");
      setAadharNo("");
      setFatherName("");
      setMotherName("");
      setPhoneNo("");
      setEmail("");
      setAddress("");
      setCollege("");
      setRoomNo("");
      setPassword("");
      setSelectedGender(null);
      setSelectedHostel(null);
      setSelectedYear(null);
		} catch (error) {
			console.error("Error adding hosteler:", error);
			setErrorMessage(error.message || "Error adding hosteler");
			setError(true);
		}
    finally {
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
						Hosteler Registration
					</Typography>
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
							label="Name"
							variant="outlined"
							size="small"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Roll No."
							variant="outlined"
							size="small"
							value={rollNo}
							onChange={(e) => setRollNo(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Aadhar No."
							variant="outlined"
							size="small"
							value={aadharNo}
							onChange={(e) => setAadharNo(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Father's Name"
							variant="outlined"
							size="small"
							value={fatherName}
							onChange={(e) => setFatherName(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Mother's Name"
							variant="outlined"
							size="small"
							value={motherName}
							onChange={(e) => setMotherName(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Phone No."
							variant="outlined"
							size="small"
							value={phoneNo}
							onChange={(e) => setPhoneNo(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Email"
							variant="outlined"
							size="small"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Address"
							variant="outlined"
							size="small"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>

						{/* Dropdown for Gender */}
						<div>
							{/* <label className="text-white font-bold block mb-2">Select Gender:</label> */}
							<Select
								options={genderOptions}
								value={genderOptions.find(
									(option) => option.value === selectedGender
								)}
								onChange={(selectedOption) =>
									setSelectedGender(
										selectedOption?.value || null
									)
								}
								placeholder="Select Gender"
								styles={dropdownStyles}
							/>
						</div>

						{/* Dropdown for Year */}
						<div>
							{/* <label className="text-white font-bold block mb-2">Select Year:</label> */}
							<Select
								options={yearOptions}
								value={yearOptions.find(
									(option) => option.value === selectedYear
								)}
								onChange={(selectedOption) =>
									setSelectedYear(
										selectedOption?.value || null
									)
								}
								placeholder="Select Year"
								styles={dropdownStyles}
							/>
						</div>

						<StyledTextField
							fullWidth
							label="College"
							variant="outlined"
							size="small"
							value={college}
							onChange={(e) => setCollege(e.target.value)}
						/>

						{/* Dropdown for Hostel */}
						<div>
							{/* <label className="text-white font-bold block mb-2">Select Hostel:</label> */}
							<Select
								options={hostelOptions}
								value={hostelOptions.find(
									(option) => option.value === selectedHostel
								)}
								onChange={(selectedOption) =>
									setSelectedHostel(
										selectedOption?.value || null
									)
								}
								placeholder="Select Hostel"
								styles={dropdownStyles}
							/>
						</div>

						<StyledTextField
							fullWidth
							label="Room No."
							variant="outlined"
							size="small"
							value={roomNo}
							onChange={(e) => setRoomNo(e.target.value)}
						/>
						<StyledTextField
							fullWidth
							label="Password"
							variant="outlined"
							size="small"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Box>
					{loading ? (
						<div className="flex justify-center items-center mt-8">
							<ActivityIndicator size="large" />
						</div>
					) : (
						<button
							className="mt-8 bg-black text-white font-medium px-6 py-3 rounded-lg shadow-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300"
							onClick={handleSubmit}
						>
							Add Hosteler
						</button>
					)}
					{error && (
						<Alert severity="error" className="mt-10">
							{errorMessage}
						</Alert>
					)}
				</GlassCard>
			</div>
		</>
	);
};

export default AddHosteler;
