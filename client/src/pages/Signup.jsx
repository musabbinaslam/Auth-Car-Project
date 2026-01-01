import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        license: '',
        cnic: ''
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join us today and get started</p>
                </div>
                {error && <div className="alert error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Driving License Number"
                            value={formData.license}
                            onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="CNIC / Passport"
                            value={formData.cnic}
                            onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Sign Up</button>
                </form>
                <div className="mt-4 text-center">
                    <p style={{ color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" className="text-link">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
