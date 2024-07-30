// @ts-nimport Axios from "axios";
import Axios from "axios";

import dotenv from "dotenv";
import { accessToken } from "./user";
dotenv.config();

console.log(process.env.NEXT_PUBLIC_API_URL, "api");

const SERVER = "http://3.109.200.73:8080";

// const SERVER = "http://65.0.55.141:8080";
// const SERVER = "http://localhost:8080";

const axios = Axios.create({
  baseURL: `${SERVER}/api`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
});

export default axios;
