"use client";
import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { toast } from "sonner";

const Wallet: NextPage = () => {
  const [earnings, setEarnings] = useState(0);

  const handleWithdraw = () => {
    toast.success(
      "Withdrawal request sent successfully, please wait for approval"
    );
  };

  return (
    <div className="min-h-screen h-screen flex items-center justify-center  py-8 px-4">
      <Head>
        <title>Wallet</title>
      </Head>
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-3xl">
        <h1 className="text-2xl font-bold mb-4">WALLET</h1>
        <div className="mb-4 flex items-center gap-4">
          <span className="block text-white text-xl font-semibold">
            EARNINGS:
          </span>
          <span className="block text-gray-100 text-xl font-semibold">
            {earnings.toFixed(2)} USD
          </span>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleWithdraw}
        >
          WITHDRAW
        </button>
        <div className="">
          <span></span>
          <p className="mt-4 text-gray-100">1000 views = 1 USD</p>
        </div>
        <p className="mt-2 text-gray-100">
          Upload 10 short films on Zynoflix OTT and get an opportunity for the
          big screen.
        </p>
        <InvestmentCalculator />
      </div>
    </div>
  );
};

export default Wallet;
import React from "react";

const InvestmentCalculator: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <div className="row gy-5">
          <div className="col-lg-7">
            <div className="section-title mb-0">
              <h2 className="text-2xl font-bold">
                Why You Choose IKO is worth buying today?
              </h2>
              <p className="text-gray-600">
                Use the window for the planned investment and calculate the
                estimated <br /> Iko price and your monthly dividends at a fixed
                time
              </p>
            </div>
          </div>
          <div className="col-lg-5 text-center">
            <img
              alt="img"
              loading="lazy"
              width="256"
              height="256"
              className="mx-auto"
              src="/_next/static/media/why_1-1.0b2942d6.png"
            />
          </div>
        </div>
      </div>
      <div className="row gy-5 justify-between">
        <div className="col-lg-5">
          <div className="wcu-amount-quantity mb-6">
            <div className="amount mb-4">
              <h5 className="font-semibold">Amount invested</h5>
              <p className="text-xl">$50,000</p>
            </div>
            <div className="quantity">
              <h5 className="font-semibold">Quantity Iko</h5>
              <p className="text-xl">500,000 Iko</p>
            </div>
          </div>
          <ul className="space-y-4">
            <li>
              <h6 className="font-semibold">Expected FOX price</h6>
              <p>0.36 $</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>$100</span>
                <span>$100,000</span>
              </div>
            </li>
            <li>
              <h6 className="font-semibold">Expected FOX price</h6>
              <p>0.36 $</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>$100</span>
                <span>$100,000</span>
              </div>
            </li>
            <li>
              <h6 className="font-semibold">Calculation time</h6>
              <p>Q3 2020</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>$100</span>
                <span>$100,000</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-lg-6">
          <div className="space-y-6">
            <div className="feature-card p-4 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <img
                  alt="img"
                  loading="lazy"
                  width="40"
                  height="40"
                  className="mr-4"
                  src="/_next/static/media/feature-icon1-1.b96f1c37.svg"
                />
                <h4 className="text-lg font-semibold">
                  The expected value of your investment
                </h4>
              </div>
              <p className="text-xl">$180,000</p>
              <p>ROI = 360%</p>
            </div>
            <div className="feature-card p-4 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <img
                  alt="img"
                  loading="lazy"
                  width="36"
                  height="36"
                  className="mr-4"
                  src="/_next/static/media/feature-icon1-2.96d30118.svg"
                />
                <h4 className="text-lg font-semibold">
                  Expected monthly dividend
                </h4>
              </div>
              <p className="text-xl">3600 FOX = $1296</p>
            </div>
            <div className="feature-card p-4 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <img
                  alt="img"
                  loading="lazy"
                  width="40"
                  height="40"
                  className="mr-4"
                  src="/_next/static/media/feature-icon1-3.870c508b.svg"
                />
                <h4 className="text-lg font-semibold">Masternode bonus</h4>
              </div>
              <p className="text-xl">$180,000</p>
              <p>ROI = 360%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
