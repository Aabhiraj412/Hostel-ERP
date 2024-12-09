import React from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import notice from "@/assets/noctice_for_hostel.pdf";

const notices = [
  {
    title: "Annual Fest 2024",
    description: "Join us for the grand annual fest celebration from Jan 20-22, 2024. Check the schedule and events in the attached notice.",
    file: notice,
  },
  {
    title: "Exam Schedule",
    description: "The mid-semester exam schedule has been released. Refer to the attached PDF for details about subjects and timings.",
    file: notice, 
  },
  {
    title: "Holiday Announcement",
    description: "The university will remain closed on Dec 25th for Christmas. Refer to the attached notice for additional details.",
    file: notice, 
  },
];

const ViewNotice = () => {
  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = "notice.pdf"; 
    link.click();
  };

  return (
    <>
      <MiniVariantDrawer title="Notices" />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-teal-700 to-black p-5 overflow-auto">
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-8 max-w-4xl  mt-20 mx-14">
          <h1 className="text-2xl font-bold text-center text-teal-300 tracking-wider mb-6">
            Notices
          </h1>
          {notices.map((notice, index) => (
            <div
              key={index}
              className="mb-6 flex flex-col lg:flex-row bg-black/30 backdrop-blur-md p-5 rounded-lg border border-white/20"
            >
              {/* Left Section (Title & Description) */}
              <div className="mb-4 lg:w-1/2 lg:pr-4">
                <h2 className="text-xl font-semibold text-teal-300 mb-2">
                  {notice.title}
                </h2>
                <p className="text-white">{notice.description}</p>
              </div>

              {/* Right Section (PDF Embed & Download Button) */}
              <div className="mb-4 lg:w-1/2 flex flex-col items-center">
                {/* Embed PDF in iframe */}
                <iframe
                  src={notice.file}
                  width="100%"
                  height="500px"
                  className="rounded-lg shadow-md mb-4"
                  title={notice.title}
                />
                <button
                  onClick={() => handleDownload(notice.file)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-teal-500 to-slate-600 hover:to-black hover:from-teal-600 text-white rounded-lg text-center font-semibold transition-all duration-300"
                >
                  Download Notice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ViewNotice;
