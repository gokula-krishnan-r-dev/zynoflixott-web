// pages/terms-and-conditions.tsx
import { NextPage } from "next";
import Head from "next/head";

const TermsAndConditions: NextPage = () => {
  return (
    <div className="min-h-screen bg-body flex flex-col">
      <Head>
        <title>Zynoflix OTT - Terms and Conditions</title>
        <meta
          name="description"
          content="Terms and Conditions of Zynoflix OTT"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-grow  max-w-4xl mx-auto bg-body p-8 rounded-lg shadow-lg mt-24">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="mb-4">
          Zynoflix OTT is a platform owned by Fuero Networks Technologies
          Private Limited where users can legally upload their short films for a
          fee of 500rs. This app allows users to launch their short films and
          gain exposure to a larger audience. However, there are certain terms
          and conditions that must be followed.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Content Guidelines</h2>
        <p className="mb-4">
          Users are not allowed to upload any 18+ content on the platform. All
          content must be suitable for general audiences. Additionally, users
          are required to upload original content only. Simply copying and
          pasting short films from other sources is strictly prohibited.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Monetization</h2>
        <p className="mb-4">
          In order to initiate monetization, users must have a minimum of 5000
          followers on their profile. By meeting this requirement, creators can
          start earning money through their short films on Zynoflix OTT.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Legal Rights</h2>
        <p className="mb-4">
          By adhering to these guidelines, creators can showcase their talent
          and potentially earn money through their short films on Zynoflix OTT.
          All rights reserved by Fuero Networks Technologies Private Limited.
        </p>
      </main>
    </div>
  );
};

export default TermsAndConditions;
