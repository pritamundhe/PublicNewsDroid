import React, { useState } from 'react';

const PaymentPage1 = () => {
  const [activeTab, setActiveTab] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const amount = 167;
  const banks = [
    'HDFC', 'ICICI', 'Axis', 'SBI', 'Standard Chartered Bank', 'Yes Bank'
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'card':
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="Enter Card Number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg mb-4">
                <p className="text-gray-500">QR Code Placeholder</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan the QR using any UPI app on your mobile phone like PhonePe, Paytm, GooglePay, BHIM, etc.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Generate QR Code
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input
                type="text"
                placeholder="Username@bankname"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                A payment request will be sent to this UPI ID
              </p>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <input
                id="auto-debit"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="auto-debit" className="ml-2">
                Automatically debit to renew subscription for every billing cycle. <span className="text-blue-600">See how it works</span>
              </label>
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {banks.map((bank) => (
                <button
                  key={bank}
                  className={`p-3 border rounded-md text-left ${selectedBank === bank ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => setSelectedBank(bank)}
                >
                  {bank}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search banks"
                className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                className="absolute left-2 top-3 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        );

      case 'emi':
        return (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No EMI Plans found</h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't fetch any EMI plans for this.
              <br />
              Please check with other Options
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-6">Payment Methods</h1>

      <div className="mb-4">
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
          <span className="font-medium">Amount</span>
          <span className="font-bold">₹{amount}</span>
        </div>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          className={`px-4 py-2 rounded-md whitespace-nowrap ${activeTab === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('card')}
        >
          Credit / Debit Card
        </button>
        <button
          className={`px-4 py-2 rounded-md whitespace-nowrap ${activeTab === 'upi' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('upi')}
        >
          UPI
        </button>
        <button
          className={`px-4 py-2 rounded-md whitespace-nowrap ${activeTab === 'netbanking' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('netbanking')}
        >
          NetBanking
        </button>
        <button
          className={`px-4 py-2 rounded-md whitespace-nowrap ${activeTab === 'emi' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('emi')}
        >
          EMI on Cards
        </button>
      </div>

      {renderTabContent()}

      <div className="mt-6">
        <button className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700">
          Pay ₹{amount}
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        secured by <span className="font-medium">JUSPAY</span>
      </div>
    </div>
  );
};

export default PaymentPage1;