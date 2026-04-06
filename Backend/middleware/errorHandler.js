const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }
  
  res.status(err.statusCode || 500).json({ 
    message: err.message || 'Server error' 
  });
};

module.exports = errorHandler;
