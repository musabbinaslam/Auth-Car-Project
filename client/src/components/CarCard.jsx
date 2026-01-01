import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
    return (
        <div className="car-card" style={{
            background: 'var(--bg-card)',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            transition: 'transform 0.2s'
        }}>
            <div className="car-image" style={{ height: '200px', overflow: 'hidden' }}>
                <img
                    src={car.images && car.images[0] ? car.images[0] : 'https://placehold.co/600x400?text=No+Image'}
                    alt={car.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div className="car-content" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{car.name} {car.model}</h3>
                        <span className="badge-user" style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}>
                            {car.type}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.25rem' }}>
                            ${car.pricePerDay}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>/day</div>
                    </div>
                </div>

                <div className="car-features" style={{
                    display: 'flex',
                    gap: '1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    marginBottom: '1.5rem'
                }}>
                    <span>{car.transmission}</span>
                    <span>•</span>
                    <span>{car.fuelType}</span>
                    <span>•</span>
                    <span>{car.seats} Seats</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: '#fbbf24' }}>
                    <span style={{ marginRight: '0.25rem' }}>★</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>{car.averageRating ? car.averageRating.toFixed(1) : 'New'}</span>
                    <span style={{ marginLeft: '0.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        ({car.ratingCount || 0} reviews)
                    </span>
                </div>

                <Link
                    to={`/car/${car._id}`}
                    className="btn-primary"
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        textDecoration: 'none',
                        width: '100%'
                    }}
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default CarCard;
