import React, {useState, useEffect} from 'react';
interface SlideMessageProps {
    message: string;
    color: string;
    duration?: number;
    messageKey: number;
}

const SlideMessage: React.FC<SlideMessageProps> = ({ message, color, messageKey, duration = 2000 }) => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        setShowMessage(true);
        const timerId = setTimeout(() => {
            setShowMessage(false);

        }, duration);
        return () => clearTimeout(timerId);
    }, [messageKey, message, duration]);

    return (
            <div className={`slide-message ${showMessage ? 'show' : ''}`} style={{ backgroundColor: color }}>
                {message}
            </div>
    );
};
export default SlideMessage;