import { useState, useEffect } from 'react';
import { getAllCars } from '../services/api';
import CarCard from '../components/CarCard';

const Home = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        fuelType: '',
        minPrice: '',
        maxPrice: '',
        sort: '-createdAt'
    });

    useEffect(() => {
        fetchCars();
    }, [filters]);

    const fetchCars = async () => {
        try {
            const data = await getAllCars(filters);
            setCars(data);
        } catch (error) {
            console.error('Failed to fetch cars', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div className="hero-wrapper">
                <div className="hero-bg" />

                <div className="hero-content">
                    <h1 className="hero-title">
                        Drive the Extraordinary
                    </h1>
                    <p className="hero-subtitle">
                        Experience the thrill of premium mobility. Choose from our exclusive fleet of luxury and performance vehicles.
                    </p>
                    <button
                        className="btn-primary hero-btn"
                        onClick={() => document.getElementById('browse-cars').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Explore Fleet
                    </button>
                </div>
            </div>

            <div className="container" id="browse-cars">
                {/* Advanced Search & Filters */}
                <div className="filter-bar home-filters-container">

                    {/* Search Row */}
                    <div className="search-wrapper">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by make or model..."
                            value={filters.search || ''}
                            onChange={handleFilterChange}
                            className="search-input"
                        />
                    </div>

                    {/* Filters Grid */}
                    <div className="filters-grid">

                        {/* Type */}
                        <div className="filter-group">
                            <label>Vehicle Type</label>
                            <select name="type" value={filters.type} onChange={handleFilterChange} className="filter-select">
                                <option value="">All Types</option>
                                <option value="sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="hatchback">Hatchback</option>
                            </select>
                        </div>

                        {/* Fuel */}
                        <div className="filter-group">
                            <label>Fuel Type</label>
                            <select name="fuelType" value={filters.fuelType || ''} onChange={handleFilterChange} className="filter-select">
                                <option value="">Any Fuel</option>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="electric">Electric</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>

                        {/* Min Price */}
                        <div className="filter-group">
                            <label>Min Price</label>
                            <input type="number" name="minPrice" placeholder="$0" value={filters.minPrice} onChange={handleFilterChange} className="filter-input" />
                        </div>

                        {/* Max Price */}
                        <div className="filter-group">
                            <label>Max Price</label>
                            <input type="number" name="maxPrice" placeholder="Any" value={filters.maxPrice} onChange={handleFilterChange} className="filter-input" />
                        </div>

                        {/* Sort */}
                        <div className="filter-group">
                            <label>Sort By</label>
                            <select name="sort" value={filters.sort || ''} onChange={handleFilterChange} className="filter-select">
                                <option value="-createdAt">Newest (Popular)</option>
                                <option value="pricePerDay">Price: Low to High</option>
                                <option value="-pricePerDay">Price: High to Low</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>pagination</label>
                            <input type="number" name="pagination" placeholder="1" value={filters.pagination} onChange={handleFilterChange} className="filter-input" />
                        </div>
                    </div>
                </div>

                {/* Car Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Loading Inventory...</div>
                    </div>
                ) : (
                    <div className="cars-grid">
                        {cars.map(car => (
                            <CarCard key={car._id} car={car} />
                        ))}
                    </div>
                )}

                {!loading && cars.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ color: 'var(--text-muted)' }}>No vehicles found matching your criteria.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
