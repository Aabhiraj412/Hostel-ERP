import { useState, useEffect } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import OutingDetailsCard from "../../components/OutingDetailsCard";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";

const OutRegister = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [purpose, setPurpose] = useState("");
  const { localhost, testlocalhost } = useStore();
  const [entries, setEntries] = useState([]);
  const [ip, setIP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Fetch the user's IP address
  const getIP = async () => {
    try {
      const response = await fetch(`http://${localhost}/api/hostler/getip`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      setIP(data.ip);
    } catch (error) {
      console.error("Error getting IP:", error);
    }
  };

  // Fetch the outing register entries
  const fetchEntries = async () => {
    try {
      const response = await fetch(
        `http://${localhost}/api/hostler/getentry`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open a new entry
  const openEntry = async () => {
    if (!purpose.trim()) {
      alert("Please enter the purpose of leave.");
      return;
    }

    if (testlocalhost !== ip) {
      alert(
        "You are not authorized to open an entry. Connect to Hostel Wi-Fi to proceed further."
      );
      return;
    }

    setOpen(true);
    try {
      const response = await fetch(
        `http://${localhost}/api/hostler/openentry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ purpose }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to open entry.");
      }

      setPurpose("");
      setIsDrawerOpen(false);
      fetchEntries();
    } catch (error) {
      console.error("Error opening entry:", error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getIP();
    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6 relative">
      <MiniVariantDrawer title="Out Register" />
      <div className="flex justify-between items-center">
        <h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">
          Out Register
        </h1>
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="mt-20 bg-black text-white font-medium px-6 py-3 rounded-lg shadow-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300"
        >
          + Open Entry
        </button>
      </div>

      <div className="grid gap-6 mx-14 mt-10">
        {loading ? (
          <p className="text-white text-center font-bold text-xl">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-white text-center font-bold text-xl">
            No outing details available.
          </p>
        ) : (
          entries.map((details) => (
            <OutingDetailsCard
              key={details.id}
              outingDetails={details}
              ip={ip}
              fetchEntries={fetchEntries}
            />
          ))
        )}
      </div>

      {isDrawerOpen && (
        <div className="fixed top-20 right-5 w-80 h-80 bg-black backdrop-blur-lg bg-white/20 border-l border-white/20 shadow-lg z-50 rounded-lg">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-teal-300 mb-4">
              New Entry
            </h2>
            <label className="text-teal-200 font-medium mb-2">
              Purpose of Leave:
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mb-4 px-4 py-2 rounded-lg bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter purpose..."
            />
            {open ? (
              <ActivityIndicator size="large" />
            ) : (
              <div className="mt-auto space-x-4">
                <button
                  onClick={openEntry}
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-semibold"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
                >
                  Discard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutRegister;
