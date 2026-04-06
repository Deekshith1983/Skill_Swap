const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateMobile = (mobile) => {
  const re = /^\d{10}$/;
  return re.test(mobile.replace(/\D/g, ''));
};

module.exports = {
  validateEmail,
  validatePassword,
  validateMobile
};
