import { Card, styled } from "@mui/material";
import React from "react";

function NotFound() {
	const GlassCard = styled(Card)`
		width: 90%;
		max-width: 600px;
		padding: 50px;
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

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-700 to-black">
			<GlassCard>
				<h1 className="text-center text-5xl font-bold text-red-600">
					404 Page Not Found
				</h1>
			</GlassCard>
		</div>
	);
}

export default NotFound;
