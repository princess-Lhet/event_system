import React from 'react';
import '../styles/layout.css';

const Home = () => {
  return (
    <main className="home-page">
      <div className="container py-5">
        <div className="home-hero text-center">
          <h1 className="display-5 mb-2">Event Reservations</h1>
          <p className="lead mb-3">A booking that you RESERVE.</p>
          <div className="home-cta d-flex justify-content-center">
            <a className="btn btn-primary btn-lg" href="/dashboard">View Events & Reserve</a>
          </div>
        </div>
        <section className="home-sections mt-5">
          <div className="row g-5 align-items-start">
            <div className="col-12 col-lg-6">
              <div className="home-section">
                <h2 className="h3 text-center mb-4">Why choose our platform</h2>
                <div className="row g-4">
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Browse Events</h5>
                        <p className="card-text">Discover concerts, conferences, workshops, and more curated for you.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Seamless Reservations</h5>
                        <p className="card-text">Reserve your seat in a few clicks with a clean, intuitive experience.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Instant Confirmation</h5>
                        <p className="card-text">Receive confirmations immediately with reservation details and QR codes.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Flexible Cancellations</h5>
                        <p className="card-text">Modify or cancel your bookings according to event policies with ease.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Real-time Availability</h5>
                        <p className="card-text">Up-to-the-minute seat counts and status to avoid surprises.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Personalized Picks</h5>
                        <p className="card-text">Smart suggestions based on your interests and past reservations.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Multi-venue Support</h5>
                        <p className="card-text">Book across cities and venues with a consistent experience.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Admin Dashboard</h5>
                        <p className="card-text">Organizers can manage events, capacity, and attendees in one place.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Notifications</h5>
                        <p className="card-text">Email and SMS updates keep you informed of changes instantly.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Mobile Friendly</h5>
                        <p className="card-text">Optimized for phones and tablets so you can book on the go.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">24/7 Support</h5>
                        <p className="card-text">We’re here to help anytime with live assistance and guides.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="home-section">
                <h2 className="h3 text-center mb-4">More details</h2>
                <div className="row g-4">
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Group Bookings</h5>
                        <p className="card-text">Reserve multiple seats together and manage attendees easily.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Waitlists</h5>
                        <p className="card-text">Join waitlists and be auto-notified when seats open up.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Discount Codes</h5>
                        <p className="card-text">Redeem promo and referral codes for exclusive savings.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Seating Maps</h5>
                        <p className="card-text">Choose preferred sections and seats for select venues.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Calendar Sync</h5>
                        <p className="card-text">Add bookings to Google, Outlook, or Apple Calendar.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Reminders</h5>
                        <p className="card-text">Automatic reminders so you never miss an event.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Localization</h5>
                        <p className="card-text">Multi-language and time zone aware for a global audience.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Analytics</h5>
                        <p className="card-text">Insights for organizers: sales, attendance, and engagement.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
