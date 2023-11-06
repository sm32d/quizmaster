"use client";
import { useState } from "react";

const LoginForm = () => {
  async function create(formData) {
    setIsLogging(true);
    const jsonObject = {};

    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    console.log(jsonObject);

    const response = await fetch("http://127.0.0.1:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonObject),
    });
    // revalidate cache
  }
  const [isLogging, setIsLogging] = useState(false);
  return (
    <form action={create} className="card-body">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          name="username"
          placeholder="username"
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="email"
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control mt-6">
        <button className="btn btn-primary">
          {isLogging ? (
            <span className="loading loading-dots loading-md"></span>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
