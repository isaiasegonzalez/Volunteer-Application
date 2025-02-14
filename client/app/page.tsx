"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Modak, Poppins } from "next/font/google";

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const LandingPage = () => {
  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      <nav className="flex items-center justify-between px-8 py-4">
        <div className={`text-2xl ${modak.className} text-[#FF8BA7]`}>Vola!</div>
        <div className="flex items-center space-x-8">
          <Link href="/login" className="text-[#FF8BA7] hover:text-[#FF8BA7]/90 flex items-center">
            👤 <span className="ml-1">Login</span>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-16 flex items-center">
        <div className="w-1/2">
          <h1 className={`text-7xl mb-2 ${modak.className} text-[#FF8BA7] leading-tight`}>
            Volunteering.
          </h1>
          <h2 className="text-4xl font-bold text-[#33272A] mb-6">made easy!</h2>
          <p className="text-[#594A4E] text-lg mb-8 max-w-lg leading-relaxed">
            Join a community of changemakers and make a difference effortlessly. 
            Vola connects you with volunteer opportunities that match your skills, 
            location, and availability—so you can focus on what truly matters: giving back.
          </p>
          <button className="bg-[#FFC6C7] hover:bg-[#FF8BA7] text-white px-8 py-3 rounded-lg text-lg transition-colors">
            Get Started with Vola
          </button>
        </div>

        <div className="w-1/2 relative">
          {/* Dynamic circle with softer gradient */}
          <div className="relative w-[600px] h-[600px]">
            <svg
              viewBox="0 0 600 600"
              className="w-full h-full absolute top-0 left-0"
            >
              <defs>
                <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#FFB5C9', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#E5C4FF', stopOpacity: 0.8 }} />
                </linearGradient>
                <clipPath id="blob">
                  <path d="M550,300 C550,450 450,550 300,550 C150,550 50,450 50,300 C50,150 150,50 300,50 C450,50 550,150 550,300 Z" />
                </clipPath>
              </defs>
              <g clipPath="url(#blob)">
                <rect x="0" y="0" width="600" height="600" fill="url(#circleGradient)" />
              </g>
            </svg>

            {/* Single illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src= "/imgs/undraw_collaborators_rgw4 1.png" // Update with your actual image path
                alt="Volunteer illustration"
                width={400}
                height={400}
                priority
                className="object-contain z-10"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;