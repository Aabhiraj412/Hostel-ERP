import { useEffect, useState } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import Select from "react-select";
import SearchBar from "../../components/SearchBar";
import HostelerCard from "../../components/HostelerCard";
import Card from "@/components/Card";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";

const ViewHosteler = () => {
  const { localhost } = useStore();
  const [selectedHostel, setSelectedHostel] = useState(null); // Selected hostel
  const [hostlers, setHostlers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [selectedHosteler, setSelectedHosteler] = useState(null); // For 
  const routing = {title:"Hostelers Details",Home: '/warden-dashboard', Profile: '/profile-warden', Attendence:'/fetch-attendance', Notice: '/view-notice', Menu: '/view-mess-menu' }

  const fetchHostlers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${localhost}/api/warden/gethostlers`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to fetch hostelers. Please try again."
        );
      }
      const data = await response.json();
      setHostlers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostlers();
  }, []);

  if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-700 to-black">
				<ActivityIndicator size="large" color="#2cb5a0" />
			</div>
		);
	}
if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Dropdown options for hostel selection, including "All Hostels"
  const hostelOptions = [
    { label: "All Hostels", value: null },
    ...Array.from(new Set(hostlers.map((hostler) => hostler.hostel))).map((hostel) => ({
      label: hostel,
      value: hostel,
    })),
  ];

  // Filter hostelers by selected hostel and search query
  const filteredHostlers = hostlers.filter((hostler) => {
    const matchesHostel = !selectedHostel || hostler.hostel === selectedHostel.value;
    const matchesQuery =
      hostler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hostler.room_no?.toString().includes(searchQuery);
    return matchesHostel && matchesQuery;
  });

  // Close the modal when clicking the overlay
  const handleOverlayClick = (e) => {
    if (e.target.id === "popup-overlay") {
      setSelectedHosteler(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6">
      <MiniVariantDrawer router={routing} />
      <h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">Hostelers Details</h1>
      <div className="mx-14 mt-10">
        {/* Dropdown */}
        <div className="mb-6">
          <label className="text-white font-bold block mb-2">Select Hostel:</label>
          <Select
            options={hostelOptions}
            value={selectedHostel}
            onChange={setSelectedHostel}
            placeholder="All Hostels"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(8px)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "4px",
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? "rgba(255, 255, 255, 0.4)"
                  : "transparent",
                color: "black",
                cursor: "pointer",
              }),
            }}
          />
        </div>

        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Hosteler Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredHostlers.length === 0 ? (
            <p className="text-white col-span-full text-center text-lg font-bold">
              No hostelers found.
            </p>
          ) : (
            filteredHostlers.map((hostler) => (
              <Card
                key={hostler.id}
                onClick={() => setSelectedHosteler(hostler)}
              >
                <HostelerCard hosteler={hostler} />
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Popup Card */}
      {selectedHosteler && (
        <div
          id="popup-overlay"
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 mt-20 mb-8"
        >
          <Card>
            <h2 className="text-xl font-bold text-teal-300 mb-4">Student Details</h2>
            <p className="text-white"><strong>Name:</strong> {selectedHosteler.name}</p>
            <p className="text-white"><strong>Room No:</strong> {selectedHosteler.room_no}</p>
            <p className="text-white"><strong>Phone:</strong> {selectedHosteler.phone_no}</p>
            {/* Other details here */}
          </Card>
        </div>
      )}
    </div>
  );
};

export default ViewHosteler;
