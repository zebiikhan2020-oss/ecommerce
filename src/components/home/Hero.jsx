"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    /* Stiffness kam ki hai aur damping badhaye hai taake sukoon sa smoothly ooper se drop ho */
    <motion.section 
      initial={{ opacity: 0, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 35,   // Speed ko slow karne ke liye isay 60 se 35 kar diya
        damping: 18,     // Smoothness badhane aur jhatka kam karne ke liye 18 kar diya
        duration: 1.5    // Total duration ko 0.9s se badha kar 1.5s kar diya taake aaram se aaye
      }}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white border-b border-blue-900/40"
    >
      
      {/* Decorative Modern Background Glow Shapes */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-0 left-10 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 relative z-10">

        {/* Left Side Content */}
        <div className="max-w-xl text-center lg:text-left flex flex-col items-center lg:items-start">
          
          {/* Welcome Badge Pill */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            <p className="text-xs md:text-sm font-semibold tracking-wider text-blue-300 uppercase">
              Welcome to <span className="text-white font-extrabold tracking-normal text-sm md:text-base">iShop</span>
            </p>
          </div>

          {/* Premium Typography Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-blue-200">
            Upgrade Your
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-200 bg-clip-text text-transparent">Tech Lifestyle</span>
          </h1>

          {/* Subtitle Description */}
          <p className="mt-6 text-sm md:text-base lg:text-lg text-slate-300 font-medium max-w-lg leading-relaxed">
            Discover the latest Mobiles, Laptops, Watches and Accessories at the best prices with trusted sellers.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start">
            <Link
              href="/products"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-950/40 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all duration-300 transform active:scale-95 text-center text-sm"
            >
              Shop Now ⚡
            </Link>

            <Link
              href="/signup"
              className="bg-white/5 border border-white/10 backdrop-blur-md text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white hover:text-blue-950 transition-all duration-300 transform active:scale-95 text-center text-sm"
            >
              Create Account
            </Link>
          </div>

        </div>

        {/* Right Side Image Showcase */}
        <div className="flex justify-center lg:justify-end flex-1 w-full max-w-md lg:max-w-none">
          <div className="relative group p-4 sm:p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-lg shadow-2xl transition-all duration-500 hover:border-blue-500/30 hover:shadow-blue-950/50">
            
            {/* Soft inner glow behind image */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <img
              src="/images/img1.jpg"
              alt="Hero Image"
              className="w-[220px] sm:w-[250px] md:w-[280px] lg:w-[300px] xl:w-[330px] h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </div>

      </div>
    </motion.section>
  );
}