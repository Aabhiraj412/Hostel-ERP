import { useNavigate } from "react-router-dom";
import { useState, useRef } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import useStore from "../../../Store/Store";

const PublishNotice = () => {
  const { localhost } = useStore();
  const [pdfFile, setPdfFile] = useState(null); 
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const routing = {title:"Publish Notice",Home: '/warden-dashboard', Profile: '/profile-warden', Attendence:'/fetch-attendance', Notice: '/view-notice', Menu: '/view-mess-menu' }

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!title || !description || !pdfFile) {
      alert("Please fill in all fields and upload a PDF before submitting.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", pdfFile); // Append the file directly

      // const protocol = window.location.protocol === "https:" ? "https" : "http";

      const response = await fetch(
        `${localhost}/api/warden/uploadnotice`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to upload notice.");
      }

      // const responseData = await response.json();
      //console.log("Notice published successfully:", responseData);

      setTitle("");
      setDescription("");
      setPdfFile(null);
      setShowSuccess(true);

      navigate("/view-notice");

    } catch (error) {
      console.error("Upload failed:", error.message);
      alert(`Failed to publish notice: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNotice = () => {
    navigate("/view-notice");
  };

  return (
    <>
      <MiniVariantDrawer router={routing} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-5">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-center text-teal-300 tracking-wider mb-6">
            Publish Notice
          </h1>

          {/* Title and Description Input */}
          <div className="bg-black/30 backdrop-blur-md p-5 rounded-lg mb-6 border border-white/20">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Notice Title"
              className="w-full mb-4 p-3 rounded-lg border border-gray-300 bg-white/15 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Notice Description"
              rows="4"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/15 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleUpload}
          />
          <button
            onClick={triggerFileInput}
            className="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600"
          >
            Upload PDF Notice
          </button>

          {/* PDF Preview */}
          {pdfFile && (
            <div className="mt-4">
              <p className="text-white mb-2">Uploaded Notice:</p>
              <iframe
                src={URL.createObjectURL(pdfFile)}
                title="PDF Preview"
                className="w-full h-64 border border-gray-300 rounded-lg"
              ></iframe>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-teal-600 text-white py-3 rounded-lg mt-5 hover:bg-teal-700"
          >
            Publish Notice
          </button>
        </div>
      </div>

      {/* Success Pop-Card */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
            <h2 className="text-lg font-bold text-teal-700 mb-4">Notice Uploaded Successfully!</h2>
            <p className="text-gray-700 mb-6">Your notice has been uploaded. You can now view it.</p>
            <button
              onClick={handleViewNotice}
              className="block w-full bg-teal-500 text-white py-2 rounded-lg mt-3"
            >
              View Notice
            </button>
            <button
              onClick={() => setShowSuccess(false)}
              className="block w-full bg-gray-300 text-gray-700 py-2 rounded-lg mt-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PublishNotice;
