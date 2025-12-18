import useStore from "../../Store/Store";
import PropTypes from 'prop-types';

const OutingDetailsCard = ({ outingDetails, fetchEntries }) => {
  const { localhost, user } = useStore();
  const { purpose, out_time, in_time, _id } = outingDetails;

  const closeEntry = async () => {
    
    if (!window.confirm(`Are you sure you want to close the entry for "${purpose}"?`)) {
      return;
    }
    console.log("Closing entry:", _id);

    try {
      const response = await fetch(
        `${localhost}/api/hostler/closeentry`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const result = await response.json();
        console.log(result);
        throw new Error(result.message || "Failed to close entry.");
      }
      fetchEntries();
      alert("Entry closed successfully!");
    } catch (error) {
      console.error("Error closing entry:", error);
      alert(error.message);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg bg-opacity-20 border border-white/30 backdrop-blur-lg bg-gray-800/30">
      <h3 className="text-lg font-semibold text-teal-400">{purpose}</h3>
      <p className="mt-2 text-gray-300">Out Time: {new Date(out_time).toLocaleString()}</p>
      <p className="text-gray-300">
        In Time: {in_time ? new Date(in_time).toLocaleString() : "Not Returned"}
      </p>
      {!in_time && user !== "Warden" && (
        <button
          className="mt-4 w-full bg-teal-400 text-white font-bold py-2 px-4 rounded-md"
          onClick={closeEntry}
        >
          Close Entry
        </button>
      )}
    </div>
  );
};
OutingDetailsCard.propTypes = {
  outingDetails: PropTypes.shape({
    purpose: PropTypes.string.isRequired,
    out_time: PropTypes.string.isRequired,
    in_time: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  ip: PropTypes.string.isRequired,
  fetchEntries: PropTypes.func.isRequired,
};

export default OutingDetailsCard;
