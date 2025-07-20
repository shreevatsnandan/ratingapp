import { useState } from "react";
import { md5 } from 'js-md5';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
      
    let password1 = md5(password);
    console.log(JSON.stringify({ email, password1 }));
    try {
     const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password1 }),  
      });

        const data = await res.json();
     
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user_id', data.id);
      if (res.ok) {
        console.log("Login success:", data);
        if (data.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (data.role === "storeowner") {
          window.location.href = "/store/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-md bg-white"
    >
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <div className="space-y-4">
        {error && <p className="text-red-600">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
