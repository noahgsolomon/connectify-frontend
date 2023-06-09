import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {getNotifications, readAllNotifications} from "../../../util/api/notificationapi.tsx";
import {timeAgo} from "../../../util/userUtils.tsx";


const NotificationButton : React.FC = () => {
    const [notificationList, setNotificationList] = useState<Notification[]>([]);
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            const fetchedNotifications = await getNotifications();
            setNotificationList(fetchedNotifications);
        };

        fetchNotifications();

        const intervalId = setInterval(fetchNotifications, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleNotificationBtnClick = () => {
        setShowNotificationPanel(!showNotificationPanel);
    }

    useEffect(() => {
        if (showNotificationPanel){
            const postData = async () => {
                await readAllNotifications();
            }
            postData();
        }
        else {

        }
    }, [showNotificationPanel]);

    const handleOverlayClick = () => {
        setShowNotificationPanel(false);
    }

    const overlay: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 8000
    }

    return (
        <>
            <Link to="#"
                  className={`notification-btn ${
                notificationList.some((notification) => notification.unread)
                    ? 'has-notification'
                    : ''
            }`} onClick={handleNotificationBtnClick}>🔔</Link>
            {showNotificationPanel && <div onClick={handleOverlayClick} style={overlay}></div>}
            <div className={`notification-panel ${showNotificationPanel ? 'show': ''}`}>
                {notificationList.length === 0
                    ? <div className="no-notifications-item" style={{ fontWeight: 'bold' }}>📜 No new notifications</div>
                    : <div className="notification-items">
                        {notificationList.map((notification, index) => <NotificationItem key={index}
                                                                                         type={notification.type} sender={notification.sender}
                                                                                         content={notification.content} date={notification.date}
                                                                                         unread={notification.unread}/>)}
                    </div>
                }
            </div>
        </>
    )
};

type Notification = {
        type: Type,
        sender: string,
        content: string,
        date: string,
        unread: boolean
}

type Type = 'LIKE' | 'FOLLOW' | 'COMMENT' | 'TAG' | 'MESSAGE'

const NotificationItem : React.FC<Notification> = ({ type, sender, content, date, unread}) => {

    let notificationTitle;

    switch (type) {
        case 'LIKE':
            notificationTitle = 'New Like ❤️';
            break;
        case 'FOLLOW':
            notificationTitle = 'New Follower 👥';
            break;
        case 'COMMENT':
            notificationTitle = 'New Comment 💬';
            break;
        case 'TAG':
            notificationTitle = 'New Tag 🏷️';
            break;
        case 'MESSAGE':
            notificationTitle = 'New Message 📩';
            break;
        default:
            break;
    }

    return (
        <div className={`notification-item ${unread ? 'unread' : ''}`}>
            <div className="notification-title">
                {notificationTitle}
            </div>
            <div className="notification-content">
                {`${sender} ${content}`}
            </div>
            <div className="notification-timestamp">
                {timeAgo(new Date(date))}
            </div>
        </div>
    );
};

export default NotificationButton;