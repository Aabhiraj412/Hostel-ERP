import React from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import { Card, styled } from '@mui/material';

const GlassCard = styled(Card)`
    width: 70%;   // 70% of the total width
    height: 70%;  // 70% of the total height
    display: flex;
    justify-content: center;   // Center content horizontally
    align-items: center;       // Center content vertically
    background: rgba(255, 255, 255, 0.2);  // Light transparent background
    backdrop-filter: blur(10px);    // Blur effect for glassmorphism
    -webkit-backdrop-filter: blur(40px);  // Safari support for blur effect
    border: 1px solid rgba(255, 255, 255, 0.3);  // Optional border for frosted look
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); // Soft shadow to make it pop
    border-radius: 15px; // Optional: Rounded corners for a smooth effect
    position: relative;  // Ensures the card is positioned above everything
    z-index: 10;         // Make sure it's above other elements
    transform: translateY(-10px); // Slight upward shift for "pop-up" effect
    transition: transform 0.3s ease;  // Smooth transition for popping effect
`;

const ProfilePage = () => {
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black relative">
                {/* Apply blur to everything except the GlassCard */}
                <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-md z-0" />
                <MiniVariantDrawer />
                <GlassCard className="z-10">
                    <h1 className="text-center text-3xl font-bold text-white">
                        The quick brown fox jumps over the lazy dog near the shimmering river at dusk.
                    </h1>
                </GlassCard>
            </div>
        </>
    );
};

export default ProfilePage;
