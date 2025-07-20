import React, { useState } from 'react';

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (formData.name.length < 20 || formData.name.length > 60) {
      errs.name = 'Name must be between 20 and 60 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errs.email = 'Invalid email format.';
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      errs.password = 'Password must be 8-16 chars, include an uppercase letter and a special character.';
    }

    if (formData.address.length > 400) {
      errs.address = 'Address must be 400 characters or less.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/add/addUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('User created successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          address: '',
          role: 'user',
        });
        setErrors({});
      } else {
        setMessage(data.message || 'Error creating user');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to submit form');
    }
  };

  return (
    <div className="mx-auto p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Add New User</h2>

      {message && (
        <p className="mb-2 text-sm text-blue-600 font-semibold">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
        </div>

        <div>
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="w-full p-2 border rounded"
            value={formData.address}
            onChange={handleChange}
            required
          />
          {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
        </div>

        <select
          name="role"
          className="w-full p-2 border rounded"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="storeowner">Store Owner</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
