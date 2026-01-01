import { useState, useEffect } from 'react';
import { getAllCars, createCar, deleteCar, getAllRentals, getAllUsers, updateCar, deleteUser, cancelRental } from '../services/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('cars'); // cars, rentals, users
    const [cars, setCars] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Car Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editingCarId, setEditingCarId] = useState(null);
    const [carForm, setCarForm] = useState({
        name: '', model: '', type: 'sedan', fuelType: 'petrol',
        transmission: 'manual', seats: 4, pricePerDay: 0, images: []
    });
    const [imageInput, setImageInput] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'cars') {
                const data = await getAllCars();
                setCars(data);
            } else if (activeTab === 'rentals') {
                const data = await getAllRentals();
                setRentals(data);
            } else if (activeTab === 'users') {
                const data = await getAllUsers();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCarSubmit = async (e) => {
        e.preventDefault();
        try {
            const carData = { ...carForm, images: imageInput ? [imageInput] : carForm.images };

            if (isEditing) {
                await updateCar(editingCarId, carData);
                alert('Car updated successfully');
            } else {
                await createCar(carData);
                alert('Car created successfully');
            }

            resetForm();
            loadData();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const resetForm = () => {
        setCarForm({ name: '', model: '', type: 'sedan', fuelType: 'petrol', transmission: 'manual', seats: 4, pricePerDay: 0, images: [] });
        setImageInput('');
        setIsEditing(false);
        setEditingCarId(null);
    };

    const handleEditCar = (car) => {
        setCarForm({
            name: car.name,
            model: car.model,
            type: car.type,
            fuelType: car.fuelType,
            transmission: car.transmission,
            seats: car.seats,
            pricePerDay: car.pricePerDay,
            images: car.images || []
        });
        setImageInput(car.images && car.images[0] ? car.images[0] : '');
        setEditingCarId(car._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteCar = async (id) => {
        if (!window.confirm('Delete this car?')) return;
        try {
            await deleteCar(id);
            loadData();
        } catch (error) {
            alert('Failed to delete car');
        }
    };

    const handleCancelRental = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await cancelRental(id);
            loadData();
            alert('Rental cancelled');
        } catch (error) {
            alert('Failed to cancel rental');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await deleteUser(id);
            loadData();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    return (
        <div className="container">
            <div className="admin-page">
                <div className="dashboard-header">
                    <h1 className="header-title">Admin Control Center</h1>
                </div>

                {/* Quick Stats Row */}
                {!loading && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-value">{cars.length}</span>
                            <span className="stat-label">Total Cars</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{rentals.filter(r => r.status === 'booked').length}</span>
                            <span className="stat-label">Active Bookings</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{users.length}</span>
                            <span className="stat-label">Total Users</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">${rentals.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)}</span>
                            <span className="stat-label">Revenue (Est.)</span>
                        </div>
                    </div>
                )}

                <div className="header-actions" style={{ justifyContent: 'flex-start', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('cars')}
                        className={activeTab === 'cars' ? 'btn-primary' : 'btn-secondary'}
                        style={{ marginTop: 0, width: 'auto' }}
                    >
                        Fleet Management
                    </button>
                    <button
                        onClick={() => setActiveTab('rentals')}
                        className={activeTab === 'rentals' ? 'btn-primary' : 'btn-secondary'}
                        style={{ marginTop: 0, width: 'auto' }}
                    >
                        Recent Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}
                        style={{ marginTop: 0, width: 'auto' }}
                    >
                        User Directory
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading...</div>
                ) : (
                    <div style={{ minHeight: '600px' }}>
                        {activeTab === 'cars' && (
                            <div className="admin-layout-grid">
                                {/* Car Form */}
                                <div className="admin-section section-form">
                                    <h2>{isEditing ? 'Edit Car' : 'Add New Car'}</h2>
                                    <form onSubmit={handleCarSubmit} className="car-form">
                                        {/* ... form content ... */}

                                        <div className="form-grid-2">
                                            <div>
                                                <label>Make</label>
                                                <input placeholder="e.g. BMW" value={carForm.name} onChange={e => setCarForm({ ...carForm, name: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label>Model</label>
                                                <input placeholder="e.g. X5" value={carForm.model} onChange={e => setCarForm({ ...carForm, model: e.target.value })} required />
                                            </div>
                                        </div>

                                        <div className="form-grid-2">
                                            <div>
                                                <label>Type</label>
                                                <select value={carForm.type} onChange={e => setCarForm({ ...carForm, type: e.target.value })}>
                                                    <option value="sedan">Sedan</option>
                                                    <option value="SUV">SUV</option>
                                                    <option value="hatchback">Hatchback</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label>Fuel</label>
                                                <select value={carForm.fuelType} onChange={e => setCarForm({ ...carForm, fuelType: e.target.value })}>
                                                    <option value="petrol">Petrol</option>
                                                    <option value="diesel">Diesel</option>
                                                    <option value="electric">Electric</option>
                                                    <option value="hybrid">Hybrid</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-grid-2">
                                            <div>
                                                <label>Transmission</label>
                                                <select value={carForm.transmission} onChange={e => setCarForm({ ...carForm, transmission: e.target.value })}>
                                                    <option value="manual">Manual</option>
                                                    <option value="automatic">Automatic</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label>Seats</label>
                                                <input type="number" value={carForm.seats} onChange={e => setCarForm({ ...carForm, seats: e.target.value })} required />
                                            </div>
                                        </div>

                                        <div>
                                            <label>Price Per Day ($)</label>
                                            <input type="number" value={carForm.pricePerDay} onChange={e => setCarForm({ ...carForm, pricePerDay: e.target.value })} required />
                                        </div>

                                        <div>
                                            <label>Image URL</label>
                                            <input placeholder="https://..." value={imageInput} onChange={e => setImageInput(e.target.value)} />
                                        </div>

                                        <div className="form-actions">
                                            {isEditing && (
                                                <button type="button" onClick={resetForm} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                            )}
                                            <button type="submit" className="btn-primary" style={{ flex: 2, marginTop: 0 }}>
                                                {isEditing ? 'Update Car' : 'Add Car'}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Car List */}
                                <div className="admin-section section-list">
                                    <h2 style={{ marginBottom: '1rem' }}>Current Fleet</h2>
                                    <div className="table-responsive">
                                        <table className="user-table">
                                            <thead><tr><th>Car</th><th>Type</th><th>Price</th><th>Actions</th></tr></thead>
                                            <tbody>
                                                {cars.map(car => (
                                                    <tr key={car._id}>
                                                        <td data-label="Car">
                                                            <div style={{ fontWeight: 600 }}>{car.name} {car.model}</div>
                                                        </td>
                                                        <td data-label="Type">{car.type}</td>
                                                        <td data-label="Price">${car.pricePerDay}/day</td>
                                                        <td data-label="Actions">
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <button
                                                                    onClick={() => handleEditCar(car)}
                                                                    className="btn-secondary"
                                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCar(car._id)}
                                                                    className="btn-danger"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {cars.length === 0 && <tr><td colSpan="4" className="text-center">No cars in fleet.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'rentals' && (
                            <div className="admin-section">
                                <h2>All Bookings</h2>
                                <div className="table-responsive">
                                    <table className="user-table">
                                        <thead><tr><th>User</th><th>Car</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {rentals.map(rental => (
                                                <tr key={rental._id}>
                                                    <td data-label="User">
                                                        {rental.user ? (
                                                            <div>
                                                                <div style={{ fontWeight: 600 }}>{rental.user.username}</div>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rental.user.email}</div>
                                                            </div>
                                                        ) : 'Unknown User'}
                                                    </td>
                                                    <td data-label="Car">{rental.car ? `${rental.car.name} ${rental.car.model}` : 'Unknown Car'}</td>
                                                    <td data-label="Dates">
                                                        <div style={{ fontSize: '0.9rem' }}>
                                                            {new Date(rental.startDate).toLocaleDateString()}
                                                            <span style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>→</span>
                                                            {new Date(rental.endDate).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td data-label="Status">
                                                        <span className={`badge ${rental.status === 'booked' ? 'badge-success' : 'badge-danger'}`}
                                                            style={{
                                                                background: rental.status === 'cancelled' ? 'rgba(239, 68, 68, 0.15)' : undefined,
                                                                color: rental.status === 'cancelled' ? '#f87171' : undefined,
                                                                border: rental.status === 'cancelled' ? '1px solid rgba(239, 68, 68, 0.2)' : undefined
                                                            }}>
                                                            {rental.status}
                                                        </span>
                                                    </td>
                                                    <td data-label="Actions">
                                                        {rental.status === 'booked' && (
                                                            <button
                                                                onClick={() => handleCancelRental(rental._id)}
                                                                className="btn-danger"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {rentals.length === 0 && <tr><td colSpan="5" className="text-center">No bookings found.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="admin-section">
                                <h2>User Management</h2>
                                <div className="table-responsive">
                                    <table className="user-table">
                                        <thead><tr><th>User</th><th>Contact</th><th>Role</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u._id}>
                                                    <td data-label="User">
                                                        <div style={{ fontWeight: 600 }}>{u.username}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {u._id}</div>
                                                    </td>
                                                    <td data-label="Contact">
                                                        <div>{u.email}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.phone || 'No phone'}</div>
                                                    </td>
                                                    <td data-label="Role">
                                                        <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td data-label="Actions">
                                                        {u.role !== 'admin' && (
                                                            <button
                                                                onClick={() => handleDeleteUser(u._id)}
                                                                className="btn-danger"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
