import logo from '@/assets/whiteBlack.svg';
//import NavBar from '../../components/NavBar';


const HomePage = () => {
  return (
    <>
    
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black">
      {/* <h1 className="text-4xl font-bold text-white mb-10">Hostel-ERP</h1> */}
      <img src={logo} className="pb-10"/>
      {/* <div className=''>Hostel ERP</div> */}
    
      <div className="flex space-x-10">
        {/* Admin Card */}
        
        <div className="w-[300px] p-6 bg-white/30 backdrop-blur-lg rounded-lg shadow-lg hover:scale-105 transform transition duration-300 shadow-teal-400/50">
          <h2 className="text-xl font-semibold text-black mb-4 text-center">Login as Warden</h2>
          <p className="text-gray-900 text-center mb-4">Easily manage hostel operations, approve leaves, and share important notices!</p>
          <a
            href="/admin-login"
            className="block w-full bg-black text-white text-center py-2 rounded-lg  hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300">
            Continue
          </a>
        </div>

        {/* Hosteler Card */}
        <div className="w-[300px] p-6 bg-white/30 backdrop-blur-lg rounded-lg shadow-lg hover:scale-105 transform transition duration-300 shadow-teal-400/50">
          <h2 className="text-xl font-semibold text-black mb-4 text-center">Login as Hosteler</h2>
          <p className="text-gray-900 text-center mb-4">Stay connected by tracking attendance, applying for leave, and voicing your concerns easily!</p>
          <a
            href="/hosteler-login"
            className="block w-full bg-black text-white text-center py-2 rounded-lg  hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300">
            Continue
          </a>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;
