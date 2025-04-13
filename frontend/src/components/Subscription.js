import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Subscription() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center font-times">
        <h1 className="text-4xl font-bold text-center mb-5 font-serif">
          Choose the best plan for your needs
        </h1>
        <p className=" text-md font-medium text-gray-700 mb-8 max-w-2xl">
          Invest in trust with a digital subscription that keeps you ahead of the curve.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* All Access Plan */}
          <div className="bg-white border shadow-xl rounded-2xl p-6 max-w-sm">
            <h2 className="text-2xl font-semibold mb-1">All Access</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Digital + E-paper subscription so that you don’t miss anything
            </p>
            <p className="text-xl font-bold mb-4">₹142 <span className="text-sm font-medium text-gray-600">/month</span></p>
            <button className="bg-red-600 hover:bg-red-400 text-white py-2 px-4 rounded-md font-semibold mb-5">
              View Plans
            </button>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✅ Full access to all journalism of Public news droid</li>
              <li>✅ Access to ePaper archives</li>
              <li>✅ Access to all premium stories</li>
              <li>✅ Access to all exclusive newsletters</li>
              <li>✅ Ad-lite experience across platforms</li>
            </ul>
          </div>

          {/* Competitive Exams Plan */}
          <div className="bg-white border shadow-xl rounded-2xl p-6 max-w-sm">
            <h2 className="text-2xl font-semibold mb-1">Competitive Exams</h2>
            <p className="text-gray-600 mb-4 text-sm">
              All Access + UPSC Essential Monthly Magazine
            </p>
            <p className="text-xl font-bold mb-4">₹167 <span className="text-sm font-medium text-gray-600">/month</span></p>
            <button className="bg-red-600 hover:bg-red-400 text-white py-2 px-4 rounded-md font-semibold mb-5">
              View Plans
            </button>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✅ Download the monthly UPSC Essentials magazine</li>
              <li>✅ Full access to all journalism of Public News Droid</li>
              <li>✅ Access to ePaper archives</li>
              <li>✅ Access to all premium stories</li>
              <li>✅ Access to all exclusive newsletters</li>
              <li>✅ Ad-lite experience across platforms</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
