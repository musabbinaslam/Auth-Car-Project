const validateSignup = (req, res, next) => {
    const { username, email, password, phone, cnic, license } = req.body;

    if (!username || !email || !password || !phone || !cnic || !license) {
        return res.status(400).json({ status: 'fail', message: 'Please provide all fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid email format' });
    }

    // Phone validation (PK format: +923001234567 or 03001234567)
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid phone number format. Use 03XXXXXXXXX' });
    }

    // CNIC validation (13 digits)
    const cnicRegex = /^[0-9]{13}$/;
    if (!cnicRegex.test(cnic.replace(/-/g, ''))) {
        return res.status(400).json({ status: 'fail', message: 'Invalid CNIC format. Must be 13 digits' });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }
    next();
};

module.exports = { validateSignup, validateLogin };
