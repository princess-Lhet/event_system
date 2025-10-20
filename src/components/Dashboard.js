import React from 'react';
import Login from './Login';
import Register from './Register';
import EventList from './EventList';
import EventForm from './EventForm';
import ReservationForm from './ReservationForm';
import ReservationList from './ReservationList';
import '../styles/dashboard.css';

const Dashboard = ({ auth }) => {
    const { user } = auth;

    if (!user) {
        return (
            <div>
                <Login />
                <Register />
            </div>
        );
    }

    const dashboardClass = user.role === 'organizer' ? 'organizer-dashboard' : 'attendee-dashboard';

    return (
        <div className={`dashboard ${dashboardClass}`}>

            <div className="container">
                <div className="section">
                    <h2>Available Events</h2>
                    <EventList />
                </div>

                {user.role === 'organizer' && (
                    <div className="section">
                        <h2>Create New Event</h2>
                        <EventForm />
                    </div>
                )}

                {user.role === 'organizer' && (
                    <div className="section">
                        <h2>Manage Reservations</h2>
                        <ReservationList />
                    </div>
                )}

                {user.role !== 'organizer' && (
                    <div className="section">
                        <h2>Make a Reservation</h2>
                        <ReservationForm />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;