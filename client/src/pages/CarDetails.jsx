import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById, createRental } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getReviewsByCarId } from '../services/api';
import ReviewList from '../components/ReviewList';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState({
        startDate: '',
        endDate: ''
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCar();
    }, [id]);

    useEffect(() => {
        if (booking.startDate && booking.endDate && car) {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            if (diffDays > 0) {
                setTotalPrice(diffDays * car.pricePerDay);
            } else {
                setTotalPrice(0);
            }
        }
    }, [booking, car]);

    const fetchCar = async () => {
        try {
            const data = await getCarById(id);
            setCar(data);
        } catch (error) {
            console.error('Failed to fetch car', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await createRental({
                carId: id,
                startDate: booking.startDate,
                endDate: booking.endDate
            });
            alert('Booking successful!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>;
    if (!car) return <div style={{ textAlign: 'center', padding: '4rem' }}>Car not found</div>;

    return (
        <div className="container">
            <div className="car-details-grid">
                {/* Images */}
                <div>
                    <img
                        src={car.images && car.images[0] ? car.images[0] : 'https://placehold.co/600x400?text=No+Image'}
                        alt={car.name}
                        style={{ width: '100%', borderRadius: '1rem', border: '1px solid var(--border)' }}
                    />
                </div>
                <div className="car-reviews">
                    <ReviewList reviews={car.reviews || []} />
                </div>
                {/* Details & Booking */}
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>{car.name} {car.model}</h1>
                    <div style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        ${car.pricePerDay} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/day</span>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Features</h3>
                        <div className="form-grid-2" style={{ marginTop: '1rem' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)' }}>Type:</span> {car.type}
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)' }}>Fuel:</span> {car.fuelType}
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)' }}>Transmission:</span> {car.transmission}
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)' }}>Seats:</span> {car.seats}
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="auth-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginTop: 0 }}>Book this Car</h3>
                        {error && <div className="alert error">{error}</div>}
                        <form onSubmit={handleBooking}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>From</label>
                                <input
                                    type="date"
                                    value={booking.startDate}
                                    onChange={(e) => setBooking({ ...booking, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>To</label>
                                <input
                                    type="date"
                                    value={booking.endDate}
                                    onChange={(e) => setBooking({ ...booking, endDate: e.target.value })}
                                    required
                                />
                            </div>

                            {totalPrice > 0 && (
                                <div style={{
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    textAlign: 'center'
                                }}>
                                    <span style={{ display: 'block', color: 'var(--text-muted)' }}>Total Price</span>
                                    <strong style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>${totalPrice}</strong>
                                </div>
                            )}

                            <button type="submit" className="btn-primary">
                                {user ? 'Confirm Booking' : 'Login to Book'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
