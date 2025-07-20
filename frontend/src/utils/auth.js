export const checkRole = (expectedRole) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

if (role !== expectedRole) {
    window.location.href = '';
  }
};

export const logout = () => {
  localStorage.clear();
};