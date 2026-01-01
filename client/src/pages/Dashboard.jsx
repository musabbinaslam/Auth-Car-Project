import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserRentals, cancelRental, getAllRentals } from '../services/api';
import { Link } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [user.role]); // Re-fetch if role changes (unlikely without reload but good practice)

    const fetchData = async () => {
        try {
            if (user.role === 'admin') {
                const data = await getAllRentals();
                // Process data for chart
                const carStats = {};
                data.forEach(rental => {
                    const carName = rental.car ? rental.car.name : 'Unknown';
                    if (carStats[carName]) {
                        carStats[carName]++;
                    } else {
                        carStats[carName] = 1;
                    }
                });

                const processed = Object.keys(carStats).map(key => ({
                    name: key,
                    bookings: carStats[key]
                }));
                setChartData(processed);
            } else {
                const data = await getUserRentals();
                setRentals(data);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (rentalId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await cancelRental(rentalId);
            fetchData(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel rental');
        }
    };

    const openReviewModal = (carId, bookingId) => {
        setSelectedCarId(carId);
        setSelectedBookingId(bookingId);
        setReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        setReviewModalOpen(false);
        setSelectedCarId(null);
        setSelectedBookingId(null);
    };

    if (loading) return <div>Loading...</div>;

    const isAdmin = user.role === 'admin';

    return (
        <div className="container">
            <div className="dashboard-page">
                <div className="dashboard-header">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="header-title" style={{ marginBottom: '0.25rem' }}>Welcome, {user.username}</h1>
                            <span className="badge badge-admin" style={{ fontSize: '0.8rem' }}>{user.role} Account</span>
                        </div>
                    </div>
                    <button onClick={logout} className="btn-secondary">Logout</button>
                </div>


                <div className="dashboard-grid">
                    {/* Profile Section */}
                    <div className="admin-section">
                        <h2>Profile Information</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                                <div style={{ fontSize: '1.1rem' }}>{user.email}</div>
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Phone Number</label>
                                <div style={{ fontSize: '1.1rem' }}>{user.phone || 'N/A'}</div>
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>License Number</label>
                                <div style={{ fontSize: '1.1rem' }}>{user.license || 'N/A'}</div>
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>CNIC</label>
                                <div style={{ fontSize: '1.1rem' }}>{user.cnic || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Analytics for Admin, Bookings for User */}
                    <div className="admin-section">
                        <h2>{isAdmin ? 'Booking Analytics' : 'My Bookings'}</h2>

                        {isAdmin ? (
                            <div style={{ height: '400px', width: '100%' }}>
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={chartData}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="name" stroke="#9ca3af" />
                                            <YAxis stroke="#9ca3af" allowDecimals={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="bookings" name="Total Bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                                        No booking data available yet.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {rentals.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                                        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>You haven't made any bookings yet.</p>
                                        <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '0.75rem 2rem', marginTop: '0.5rem' }}>Browse Cars</Link>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="user-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ paddingLeft: '1.5rem' }}>Car</th>
                                                    <th>Dates</th>
                                                    <th>Price</th>
                                                    <th>Status</th>
                                                    <th style={{ paddingRight: '1.5rem' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rentals.map(rental => {
                                                    const isUpcoming = rental.status === 'booked' && new Date(rental.startDate) > new Date();
                                                    const isComputedlyCompleted = rental.status !== 'cancelled' && new Date(rental.endDate) < new Date();
                                                    const showReviewButton = isComputedlyCompleted || rental.status === 'completed' || rental.status === 'booked'; // Enabled for 'booked' for testing
                                                    return (
                                                        <tr key={rental._id}>
                                                            <td style={{ paddingLeft: '1.5rem' }}>
                                                                {rental.car ? (
                                                                    <div style={{ fontWeight: 600 }}>
                                                                        <Link to={`/car/${rental.car._id}`} className="text-link" style={{ fontSize: '1.1rem' }}>{rental.car.name}</Link>
                                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{rental.car.model}</div>
                                                                    </div>
                                                                ) : <span style={{ color: 'var(--text-muted)' }}>Unknown Car</span>}
                                                            </td>
                                                            <td>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.95rem' }}>
                                                                    <span>{new Date(rental.startDate).toLocaleDateString()}</span>
                                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>to</span>
                                                                    <span>{new Date(rental.endDate).toLocaleDateString()}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                                                                    ${rental.totalPrice}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${rental.status === 'booked' ? 'badge-success' : 'badge-danger'}`}
                                                                    style={{
                                                                        background: rental.status === 'cancelled' ? 'rgba(239, 68, 68, 0.15)' : undefined,
                                                                        color: rental.status === 'cancelled' ? '#f87171' : undefined,
                                                                        border: rental.status === 'cancelled' ? '1px solid rgba(239, 68, 68, 0.2)' : undefined
                                                                    }}>
                                                                    {rental.status}
                                                                </span>
                                                            </td>
                                                            <td style={{ paddingRight: '1.5rem' }}>
                                                                {isUpcoming && (
                                                                    <button
                                                                        onClick={() => handleCancel(rental._id)}
                                                                        className="btn-danger"
                                                                        style={{ width: '100%', padding: '0.5rem' }}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                )}

                                                                {showReviewButton && (
                                                                    <button
                                                                        onClick={() => openReviewModal(rental.car._id, rental._id)}
                                                                        className="btn-primary"
                                                                        style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
                                                                    >
                                                                        Add Review
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {reviewModalOpen && (
                <ReviewModal
                    isOpen={reviewModalOpen}
                    onClose={closeReviewModal}
                    carId={selectedCarId}
                    bookingId={selectedBookingId}
                    onReviewSubmitted={() => {
                        // Optionally refresh rentals or show success message
                        fetchData();
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
