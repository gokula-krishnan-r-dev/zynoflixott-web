// Mock user ID for demonstration purposes
// In a real application, this would come from authentication
export const userId =
  typeof window !== "undefined" ? localStorage.getItem("userId") : null;

export const accessToken =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

export const transaction =
  typeof window !== "undefined" ? localStorage.getItem("transactionId") : null;

export const isProduction =
  typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

export const isLogin = typeof window !== "undefined" ? localStorage.getItem("isLogin") === "true" : false;

/** True if the current user is a Student Brand Ambassador (gets full video access without subscription). */
export const isStudentAmbassador =
  typeof window !== "undefined" ? localStorage.getItem("userType") === "student_ambassador" : false;

export const authId =
  typeof window !== "undefined" ? localStorage.getItem("userId") : null;
