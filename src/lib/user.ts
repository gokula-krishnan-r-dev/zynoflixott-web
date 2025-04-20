export const userId =
  typeof window !== "undefined" ? localStorage.getItem("userId") : null;

export const accessToken =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

export const transaction =
  typeof window !== "undefined" ? localStorage.getItem("transactionId") : null;

export const isProduction =
  typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

export const isLogin =
  typeof window !== "undefined" ? !localStorage.getItem("isLogin") : false;
export const authId =
  typeof window !== "undefined" ? localStorage.getItem("userId") : null;
