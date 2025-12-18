import PropTypes from 'prop-types';

const OutingDetailsCard = ({ outingDetails }) => {
  const { purpose, out_time, in_time } = outingDetails;

  

  return (
    <div className="p-6 rounded-lg shadow-lg bg-opacity-20 border border-white/30 backdrop-blur-lg bg-gray-800/30">
      <h3 className="text-lg font-semibold text-teal-400">{purpose}</h3>
      <p className="mt-2 text-gray-300">Out Time: {new Date(out_time).toLocaleString()}</p>
      <p className="text-gray-300">
        In Time: {in_time ? new Date(in_time).toLocaleString() : "Not Returned"}
      </p>
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
  };

export default OutingDetailsCard;
