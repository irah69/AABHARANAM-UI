"use client";
import React, { useState } from "react";

// ...existing code...

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
      const res = await fetch("http://localhost:8080/contactus", {
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
    <section className="bg-black contact-us-section p-8 bg-white rounded shadow-md max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        We&apos;d love to hear from you! Reach out to us for any questions, feedback, or support.
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          className="border p-2 rounded"
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          className="border p-2 rounded"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="queryType"
              value="general"
              checked={queryType === "general"}
              onChange={() => setQueryType("general")}
            />
            <span className="ml-2">General Query</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="queryType"
              value="bulk"
              checked={queryType === "bulk"}
              onChange={() => setQueryType("bulk")}
            />
            <span className="ml-2">Bulk Orders</span>
          </label>
        </div>
        <textarea
          placeholder="Your Message"
          className="border p-2 rounded"
          rows={4}
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800"
        >
          Send Message
        </button>
        {status && <div className="text-center text-sm mt-2">{status}</div>}
      </form>
    </section>
  );
};


export default ContactUs;
