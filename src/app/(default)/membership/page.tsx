"use client";
import axios from "@/lib/axios";
import { ZRPKEY } from "@/lib/config";
import { isLogin } from "@/lib/user";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const Page = () => {
  const [transactionId, setTransactionId] = React.useState<string>("");
  console.log(transactionId, "transactionId");
  const router = useRouter();
  const options = {
    key: ZRPKEY,
    amount: "19900", //  = INR 199
    name: "Zynoflix OTT Platform",
    description: "Month Membership",
    image: "./logo/logo-1.png",
    order_id: "order_7HtFNLS98dSj8x",
    handler: async function (response: any) {
      const isSuccessful = response.razorpay_payment_id;
      const transaction = localStorage.getItem("transactionId");
      if (!isSuccessful) {
        const response1 = await axios.put(`/payment/${transaction}`, {
          status: "failed",
        });
        console.log(response1);
        toast.error("Payment failed");
        return;
      }

      const response1 = await axios.put(`/payment/${transaction}`, {
        status: "success",
      });

      if (response1.data.status === "success") {
        toast.success("Payment successful");
        router.push("/");
      }

      console.log(response1);
    },
    prefill: {
      name: "Gaurav",
      contact: "9999999999",
      email: "demo@demo.com",
    },
    notes: {
      address: "some address",
    },
    theme: {
      color: "#F37254",
      hide_topbar: false,
    },
  };

  const openPayModal = async (options: any) => {
    if (isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }

    const response = await axios.post("/payment", options);

    console.log(response.data.order);

    options.order_id = response.data.order.transactionId;
    setTransactionId(response.data.order.transactionId);
    localStorage.setItem("transactionId", response.data.order._id);

    var rzp1 = new (window as any).Razorpay(options) as any;
    await rzp1.open();
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <main>
      <section className="min-h-screen pt-24 h-full">
        <div className="text-white py-6 sm:py-6">
          <div className="mx-auto max-w-7xl px-0 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="lg:text-3xl text-lg font-bold tracking-tight sm:text-4xl">
                Simple no-tricks pricing
              </h2>
              <p className="mt-3 text-xs lg:text-lg leading-8">
                Our user-friendly event creation tools allow you to set event
                details, manage RSVPs, and customize event pages with ease. In
                addition to creating beautiful event listings, you can
                effortlessly set up live streams, ensuring a smooth experience
                for both you and your attendees.
              </p>
            </div>
            <div className="mx-auto mt-4 lg:mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
              <div className="p-8 sm:p-10 lg:flex-auto">
                <h3 className="lg:text-2xl text-lg font-bold tracking-tight ">
                  month membership
                </h3>
                <p className="mt-6 text-xs lg:text-base leading-7 ">
                  Experience the power of seamless event creation and live
                  streaming with our Month Membership. This all-in-one package
                  empowers you to create, promote, and broadcast your events
                  effortlessly. Whether it&apos;s a conference, a virtual
                  seminar, or an online concert, you can now turn your vision
                  into reality and connect with a global audience. <br /> <br />
                  Sign up for the Month Membership for Event Creation and Live
                  Streaming today and elevate your event planning experience.
                  Start hosting events that stand out and leave a lasting impact
                  with the integration of live streaming technology.
                </p>
                <div className="mt-10 flex items-center gap-x-4">
                  <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                    What included
                  </h4>
                  <div className="h-px flex-auto bg-gray-100" />
                </div>
                <ul
                  role="list"
                  className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6  sm:grid-cols-2 sm:gap-6"
                >
                  <li className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    1 month subscription fees
                  </li>
                  <li className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Apply unlimited Jobs
                  </li>
                  <li className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Earn unlimitedly
                  </li>
                </ul>
              </div>
              <div className="-mt-2 !text-gray-600 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                  <div className="mx-auto max-w-xs px-8">
                    <p className="text-base font-semibold ">
                      Pay once, own it month
                    </p>
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-gray-900">
                        ₹199
                      </span>
                      <span className="text-sm font-semibold leading-6 tracking-wide ">
                        INR
                      </span>
                    </p>
                    <button
                      onClick={() => openPayModal(options)}
                      className="px-6 text-white font-semibold rounded-xl py-3 my-4 bg-blue-500 "
                    >
                      Pay Now
                    </button>
                    <p className="mt-6 text-xs leading-5 ">
                      Invoices and receipts available for easy company
                      reimbursement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
