import React, { useEffect, useState } from 'react';
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useStore from "../../../Store/Store";

const ViewAttendance = () => {

    const [date, setDate] = useState(new Date());
    const [presentDates, setPresentDates] = useState([]);
    // const [absentDates, setAbsentDates] = useState([]);
    const {data,  localhost } = useStore();
    console.log(data);
    const routing = {
        title: "Attendance Calendar",
        Home: "/hosteler-dashboard",
        Profile: "/profile-hosteler",
        Notice: "/view-notice",
        Menu: "/view-mess-menu",
    };

    // const fetchPresentData = async () => {
    //     try {
    //         const response = await fetch(
    //             ${localhost}/api/hostler/getPresentattendance,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 credentials: "include",
    //             }
    //         );

    //         const presentData = await response.json();

    //         if (!response.ok) {
    //             throw new Error(
    //                 presentData.message || "Unable to Fetch data from API"
    //             );
    //         }

    //         setPresentDates(presentData.map(date => new Date(date)));

    //     } catch (err) {
    //         console.error(err);
    //         console.log("Unable to Fetch data from API");
    //     }
    // };

    // const fetchAbsentData = async () => {
    //     try {
    //         const response = await fetch(
    //             ${localhost}/api/hostler/getAbsentattendance,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 credentials: "include",
    //             }
    //         );

    //         const absentData = await response.json();

    //         if (!response.ok) {
    //             throw new Error(
    //                 absentData.message || "Unable to Fetch data from API"
    //             );
    //         }

    //         setAbsentDates(absentData.map(date => new Date(date)));

    //     } catch (err) {
    //         console.error(err);
    //         console.log("Unable to Fetch data from API");
    //     }
    // };

    useEffect(() => {
        // fetchPresentData();
        // fetchAbsentData();
        setPresentDates(data.present_on.map(date => new Date(date)));
        console.log(date.toDateString());
    }, []);

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (presentDates.some(d => d.toDateString() === date.toDateString())) {
                return 'present-dot';
            }
            else if (
                date.getTime() >= new Date(2024, 10, 1).getTime() &&  // November is month 10 (0-based index)
                date.getTime() < new Date().setHours(0, 0, 0, 0) // Compare only dates (ignore time)
            ) {
                return 'absent-dot';
            }// if (absentDates.some(d => d.toDateString() === date.toDateString())) {
            //     return 'absent-dot';
            // }
        }
    };

    return (
        <>
            <MiniVariantDrawer router={routing} />
            <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-4 flex justify-center items-center">
                <div className="pt-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex justify-center">
                    <Calendar
                        onChange={setDate}
                        value={date}
                        tileClassName={tileClassName}
                        className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-2"
                        style={{
                            background: 'rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            borderRadius: '10px',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            margin: '0 mx-24 auto',
                        }}
                    />
                </div>
            </div>
            <style jsx>{`
                .present-dot {
                    position: relative;
                }
                .present-dot::after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 6px;
                    background-color: #22c55e;
                    border-radius: 50%;
                }
                .absent-dot {
                    position: relative;
                }
                .absent-dot::after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 6px;
                    background-color: #ef4444;
                    border-radius: 50%;
                }
                /* Ensure the calendar tiles can accommodate the dots */
                .react-calendar__tile {
                    position: relative;
                    padding-bottom: 14px !important;
                }
            `}</style>
        </>
    );
};

export default ViewAttendance;