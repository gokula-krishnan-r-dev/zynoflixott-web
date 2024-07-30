"use client";
import CreateFormSubmit from "@/components/form/form-table";
import axios from "@/lib/axios";
import { ZRPKEY } from "@/lib/config";
import { isLogin } from "@/lib/user";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";

const Page = () => {
  const [transactionId, setTransactionId] = React.useState<string>("");
  const { data, isLoading } = useQuery("getMonthlySub", async () => {
    const response = await axios.get(`/payment`);
    return response.data;
  });

  const isCompleted = data?.order.filter(
    (item: any) => item.membershipType === "upload-video"
  );

  const [isSuccessful, setIsSuccessful] = React.useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }
    if (isCompleted?.[0]?.isVideo_uploaded) {
      setIsSuccessful(true);
    }
  }, [isCompleted]);

  const options = {
    key: ZRPKEY,
    membershipType: "upload-video",
    amount: "49900", //  = INR 199
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
        setIsSuccessful(true);
        toast.success("Payment successful");
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

  const openPayModal = async () => {
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
      <div className="px-24 py-24">
        <CreateFormSubmit
          isSuccessful={isSuccessful}
          openPayModal={openPayModal}
        />
      </div>
    </main>
  );
};

export default Page;
