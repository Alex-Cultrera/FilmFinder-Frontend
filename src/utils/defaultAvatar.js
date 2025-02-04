import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import ReactDOMServer from 'react-dom/server';

// Create SVG string from FontAwesome icon
const iconSvg = ReactDOMServer.renderToStaticMarkup(
    <FontAwesomeIcon 
        icon={faCircleUser} 
        style={{ color: '#666', width: '96px', height: '96px' }} 
    />
);

// Convert to data URL
const DEFAULT_PHOTO = `data:image/svg+xml;base64,${btoa(iconSvg)}`;

export default DEFAULT_PHOTO; 