import PropTypes from 'prop-types';

const ActivityIndicator = ({ size = 'large', color = '#2cb5a0' }) => {
  const spinnerSize = size === 'large' ? '50px' : '25px';

  return (
    <div
      style={{
        width: spinnerSize,
        height: spinnerSize,
        border: `4px solid ${color}`,
        borderTop: `4px solid transparent`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    ></div>
  );
};

// Define prop types
ActivityIndicator.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
  color: PropTypes.string,
};

export default ActivityIndicator;
