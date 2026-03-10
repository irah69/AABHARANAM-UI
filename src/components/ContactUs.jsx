
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  Globe,
  Shield,
  Zap
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email anytime",
    value: "support@murgan.com",
    link: "mailto:support@murgan.com"
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our team",
    value: "+91 9876543210",
    link: "tel:+919876543210"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our headquarters",
    value: "Hyderabad, India",
    link: "https://maps.app.goo.gl/B3s3vHLaP2oG1VNp9"
  }
];

const companyStats = [
  { label: "Response Time", value: "< 2 hours", icon: Clock },
  { label: "Global Clients", value: "500+", icon: Globe },
  { label: "Security Level", value: "SOC 2", icon: Shield },
  { label: "Success Rate", value: "99.9%", icon: Zap }
];

export default function ContactUs() {

  const [formData,setFormData]=useState({
    name:"",
    email:"",
    company:"",
    message:""
  });

  const [isSubmitting,setIsSubmitting]=useState(false);
  const [isSubmitted,setIsSubmitted]=useState(false);
  const [error,setError]=useState("");

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();

    if(!formData.name || !formData.email || !formData.message){
      setError("Please fill all required fields.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    await new Promise((res)=>setTimeout(res,1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (

<section className="py-24 pb-32 min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">

<div className="max-w-7xl mx-auto px-6">

{/* HEADER */}

<div className="text-center mb-16">

<div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
<Sparkles size={16}/>
<span className="text-sm text-gray-600">Let's Connect</span>
</div>

<h2 className="text-5xl font-bold text-gray-900 mb-4">
Get in Touch
</h2>

<p className="text-gray-600 max-w-2xl mx-auto">
Ready to transform your business with AI? Let's start a conversation about your goals.
</p>

</div>

{/* STATS */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">

{companyStats.map((stat,i)=>{

const Icon = stat.icon;

return(
<motion.div
key={i}
whileHover={{scale:1.05}}
className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100"
>

<Icon className="mx-auto mb-2 text-gray-800"/>

<p className="font-bold text-lg">{stat.value}</p>

<p className="text-gray-500 text-sm">{stat.label}</p>

</motion.div>
)

})}

</div>

{/* MAIN GRID */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

{/* CONTACT FORM */}

<div className="w-full">

<h3 className="text-2xl font-semibold text-gray-900 mb-4">
Send us a message
</h3>

<p className="text-gray-500 mb-8">
Tell us about your project and we'll get back to you soon.
</p>

<AnimatePresence>

{!isSubmitted ? (

<form onSubmit={handleSubmit} className="space-y-6">

<input
type="text"
name="name"
placeholder="Your Name *"
value={formData.name}
onChange={handleChange}
required
className="w-full border border-gray-300 bg-white p-4 rounded-xl"
/>

<input
type="email"
name="email"
placeholder="Email *"
value={formData.email}
onChange={handleChange}
required
className="w-full border border-gray-300 bg-white p-4 rounded-xl"
/>

<input
type="text"
name="company"
placeholder="Company"
value={formData.company}
onChange={handleChange}
className="w-full border border-gray-300 bg-white p-4 rounded-xl"
/>

<textarea
rows="6"
name="message"
placeholder="Tell us about your project *"
value={formData.message}
onChange={handleChange}
required
className="w-full border border-gray-300 bg-white p-4 rounded-xl"
/>

{error && (
<p className="text-red-500 text-sm">{error}</p>
)}

<button
className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition"
>

{isSubmitting ? "Sending..." : (
<>
<Send size={18}/>
Send Message
</>
)}

</button>

</form>

) : (

<div className="text-center py-10">

<CheckCircle size={50} className="mx-auto text-green-500 mb-4"/>

<h3 className="text-xl font-bold text-gray-900 mb-2">
Message Sent!
</h3>

<p className="text-gray-500">
We'll get back to you within 24 hours.
</p>

</div>

)}

</AnimatePresence>

</div>

{/* CONTACT METHODS */}

<div className="flex flex-col gap-8 w-full lg:mt-32">

{contactMethods.map((method,i)=>{

const Icon = method.icon;

return(

<motion.a
key={i}
href={method.link}
target="_blank"
rel="noopener noreferrer"
whileHover={{scale:1.02}}
className="group flex items-start gap-6 p-7 w-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
>

<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-black transition">
<Icon size={22} className="text-gray-700 group-hover:text-white"/>
</div>

<div className="flex flex-col flex-1">

<h4 className="font-semibold text-gray-900 text-lg mb-1">
{method.title}
</h4>

<p className="text-gray-500 text-sm mb-2">
{method.description}
</p>

<span className="text-blue-600 font-medium">
{method.value}
</span>

</div>

<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 group-hover:bg-black transition">
<ArrowRight className="text-gray-500 group-hover:text-white"/>
</div>

</motion.a>

)

})}

</div>

</div>

</div>

</section>

  );
}

