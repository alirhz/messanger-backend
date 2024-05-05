const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Token');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        req.decoded = decoded; // Assigning the decoded object to req.decoded
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { verifyToken };