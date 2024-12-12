import React from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import notice from "@/assets/noctice_for_hostel.pdf";

const ViewNotice = () => {
  const handleDownload = (file, filename) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = filename; // Dynamically set file name
    link.click();
  };

  const routing = {
    title: "Notices/Circulars",
    Home: "/hosteler-dashboard",
    Profile: "/profile-hosteler",
    Notice: "/view-notice",
    Menu: "/view-mess-menu",
  };

  return (
    <>
      <MiniVariantDrawer router={routing} />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-teal-700 to-black p-5 overflow-auto">
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-8 max-w-4xl mt-20 mx-20">
          <h1 className="text-2xl font-bold text-center text-teal-300 tracking-wider mb-6">
            NOTICES
          </h1>

          {/* Notice 1 */}
          <div className="mb-6 flex flex-col bg-black/30 backdrop-blur-md p-5 rounded-lg border border-white/20">
            <h2 className="text-xl font-semibold text-teal-300 mb-2">
              Annual Fest 2024
            </h2>
            <p className="text-white mb-2">
              Join us for the grand annual fest celebration from Jan 20-22, 2024.
              Check the schedule and events in the attached notice.
            </p>
            <p
              onClick={() => handleDownload(notice, "AnnualFest2024.pdf")}
              className="text-teal-500 underline cursor-pointer hover:text-teal-400"
            >
              Click here to download
            </p>
          </div>

          {/* Notice 2 */}
          <div className="mb-6 flex flex-col bg-black/30 backdrop-blur-md p-5 rounded-lg border border-white/20">
            <h2 className="text-xl font-semibold text-teal-300 mb-2">
              Exam Schedule
            </h2>
            <p className="text-white mb-2">
              The mid-semester exam schedule has been released. Refer to the
              attached PDF for details about subjects and timings.
            </p>
            <p
              onClick={() => handleDownload(notice, "ExamSchedule.pdf")}
              className="text-teal-500 underline cursor-pointer hover:text-teal-400"
            >
              Click here to download
            </p>
          </div>

          {/* Notice 3 */}
          <div className="mb-6 flex flex-col bg-black/30 backdrop-blur-md p-5 rounded-lg border border-white/20">
            <h2 className="text-xl font-semibold text-teal-300 mb-2">
              Holiday Announcement
            </h2>
            <p className="text-white mb-2">
              The university will remain closed on Dec 25th for Christmas. Refer
              to the attached notice for additional details.
            </p>
            <p
              onClick={() => handleDownload(notice, "HolidayAnnouncement.pdf")}
              className="text-teal-500 underline cursor-pointer hover:text-teal-400"
            >
              Click here to download
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewNotice;
