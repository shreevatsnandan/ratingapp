const Register = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-md bg-white">
      <h2 className="text-2xl font-semibold mb-6">Register</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
