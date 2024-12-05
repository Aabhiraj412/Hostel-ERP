import React, { useRef } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import menu from '@/assets/MESS_MENU.jpg';

const ViewMessMenu = () => {
  const defaultMenuImage = menu; 
  const fileInputRef = useRef(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = defaultMenuImage;
    link.download = 'mess_menu.jpg';
    link.click();
  };

  return (
    <>
      <MiniVariantDrawer />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-5">
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-center text-teal-300 tracking-wider mb-6">
            Mess Menu
          </h1>
          <button
            onClick={handleDownload}
            className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-slate-600 hover:to-black hover:from-teal-600 text-white rounded-lg text-center font-semibold mb-6 transition-all duration-300">
            Download Menu
          </button>
          <div>
            <p className="text-white mb-2">Current Menu:</p>
            <img
              src={defaultMenuImage}
              alt="Mess Menu"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewMessMenu;
