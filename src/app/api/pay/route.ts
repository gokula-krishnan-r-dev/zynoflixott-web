import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: "rzp_live_VVxtgFlGk9YK8d",
  key_secret: "scJ6DIWgsqJBMSippsTgaluq",
});

export async function POST(request: NextRequest) {
  const { amount, currency } = (await request.json()) as {
    amount: string;
    currency: string;
  };

  var options = {
    amount: amount,
    currency: currency,
    receipt: "rcp1",
  };
  const order = await razorpay.orders.create(options);
  console.log(order);
  return NextResponse.json({ orderId: order.id }, { status: 200 });
}
