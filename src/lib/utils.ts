import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "./axios";
import { userId } from "./user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchUser = async () => {
  const res = await axios.get("/auth/user/" + userId);
  return res.data.user;
};
