"use client";
import React, { useState } from "react";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [queryType, setQueryType] = useState("general");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const res = await fetch("https://murgan-backend-1.onrender.com/contactus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, queryType }),
      });
      if (res.ok) {
        setStatus("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
        setQueryType("general");
      } else {
        setStatus("Failed to send message.");
      }
    } catch {
      setStatus("Failed to send message.");
    }
  };

  return (
    <section className="max-w-xl mx-auto mt-12 p-6">
      <h1 className="text-4xl font-extrabold text-black mb-6 text-center">Contact Us</h1>
      <p className="text-center text-gray-700 mb-8">
        We'd love to hear from you! Reach out to us for any questions, feedback, or support.
      </p>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                <div className="flex gap-8 justify-center">
          <label className="flex items-center space-x-2 cursor-pointer text-black font-semibold">
            <input
              type="radio"
              name="queryType"
              value="general"
              checked={queryType === "general"}
              onChange={() => setQueryType("general")}
              className="accent-black"
            />
            <span>General Query</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer text-black font-semibold">
            <input
              type="radio"
              name="queryType"
              value="bulk"
              checked={queryType === "bulk"}
              onChange={() => setQueryType("bulk")}
              className="accent-black"
            />
            <span>Bulk Orders</span>
          </label>
        </div>
        <input
          type="text"
          placeholder="Your Name"
          className="border border-black rounded px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm hover:shadow-md"
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          className="border border-black rounded px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm hover:shadow-md"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Your Message"
          rows={5}
          className="border border-black rounded px-4 py-3 text-black placeholder-gray-500 resize-y focus:outline-none focus:ring-2 focus:ring-black transition-shadow shadow-sm hover:shadow-md"
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-white text-black font-bold py-3 rounded border-2 border-black hover:bg-black hover:text-white transition-colors shadow-sm hover:shadow-lg"
        >
          Send Message
        </button>
        {status && (
          <div className="text-center text-sm mt-4 text-black font-medium">{status}</div>
        )}
      </form>
    </section>
  );
};

export default ContactUs;