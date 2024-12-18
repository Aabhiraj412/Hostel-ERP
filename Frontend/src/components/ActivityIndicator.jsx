import PropTypes from 'prop-types';

const ActivityIndicator = ({
  size = 'large',
  color = '#2cb5a0',
  duration = '1s',
  thickness = '4px',
}) => {
  const spinnerSize = size === 'large' ? '50px' : '25px';

  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        width: spinnerSize,
        height: spinnerSize,
        border: `${thickness} solid ${color}`,
        borderTop: `${thickness} solid transparent`,
        borderRadius: '50%',
        animation: `spin ${duration} linear infinite`,
      }}
    ></div>
  );
};

// Add animation styles globally
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(spinnerStyle);

// Define prop types
ActivityIndicator.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
  color: PropTypes.string,
  duration: PropTypes.string, // Allows customization of spin duration
  thickness: PropTypes.string, // Allows customization of border thickness
};

export default ActivityIndicator;
