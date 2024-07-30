import { NextPage } from "next";
import Head from "next/head";

const RefundPolicy: NextPage = () => {
  return (
    <div className="min-h-screen bg-body py-10">
      <Head>
        <title>ZynoFlixOTT Refund Policy</title>
        <meta name="description" content="Refund policy of ZynoFlix" />
      </Head>
      <main className="max-w-6xl mt-12 mx-auto bg-body p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">ZynoFlix Refund Policy</h1>
        <p className="mb-4">
          ZynoFlix is an Over-The-Top (OTT) platform that provides streaming
          services to its subscribers. Like any other online service provider,
          ZynoFlix has a refund policy in place to protect the rights of its
          customers and ensure a transparent and fair transaction process.
        </p>
        <p className="mb-4">
          The refund policy of ZynoFlix is in compliance with the relevant laws
          and regulations under the Act Law. This policy outlines the terms and
          conditions under which a customer may be eligible for a refund of
          their subscription fee.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Eligibility Criteria</h2>
        <p className="mb-4">
          Customers who wish to request a refund must meet certain conditions,
          such as having a valid reason for requesting a refund and providing
          proof of their subscription payment. Additionally, customers must
          adhere to the specified timeline for requesting a refund, which is
          typically within a certain number of days from the date of
          subscription.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Method of Payment</h2>
        <p className="mb-4">
          The refund policy of ZynoFlix also specifies the method of payment
          that will be used for issuing the refund. This ensures that the refund
          process is carried out in a secure and efficient manner, protecting
          the financial rights of both the customer and the platform.
        </p>
        <h2 className="text-2xl font-semibold mb-4">
          Customer Dissatisfaction
        </h2>
        <p className="mb-4">
          In the event that a customer is dissatisfied with the services
          provided by ZynoFlix and wishes to cancel their subscription, the
          refund policy ensures that the customer can do so in a timely and
          hassle-free manner. This not only protects the interests of the
          customer but also upholds the reputation of the platform as a reliable
          and customer-centric service provider.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Overall Policy</h2>
        <p className="mb-4">
          Overall, the refund policy of ZynoFlix is designed to promote
          transparency, fairness, and customer satisfaction. By adhering to the
          terms and conditions outlined in the refund policy, both the platform
          and its customers can ensure a smooth and seamless transaction
          process, in full compliance with the Act Law.
        </p>
      </main>
    </div>
  );
};

export default RefundPolicy;
