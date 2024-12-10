import React, { useState, useRef } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';

const UploadMessMenu = () => {
  const [menuImage, setMenuImage] = useState(null);
  const fileInputRef = useRef(null);
  const routing = {title:"Upload Mess Menu",Home: '/warden-dashboard', Profile: '/profile-warden', Attendence:'/fetch-attendance', Notice: '/view-notice', Menu: '/view-mess-menu' }

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMenuImage(URL.createObjectURL(file));
    }
  };

  const handleDownload = () => {
    if (menuImage) {
      const link = document.createElement('a');
      link.href = menuImage;
      link.download = 'mess_menu.jpg';
      link.click();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <MiniVariantDrawer router={routing} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-5">
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-center text-teal-300 tracking-wider mb-6">
            Mess Menu
          </h1>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
          />
          <button
            onClick={triggerFileInput}
            className="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300"
          >
            Upload Menu
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={!menuImage}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold mb-6 mt-5 ${
              menuImage
                ? 'bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black'
                : 'bg-gray-400 cursor-not-allowed'
            } transition-all`}
          >
            Download Menu
          </button>

          {/* Image Preview */}
          {menuImage && (
            <div>
              <p className="text-white mb-2">Current Menu:</p>
              <img
                src={menuImage}
                alt="Mess Menu"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadMessMenu;
