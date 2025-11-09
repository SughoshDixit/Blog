import NextAuth from "next-auth";
import { authOptions } from "../../../Lib/authOptions";

export default NextAuth(authOptions);
