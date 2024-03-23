//Global state insertion in main code
"use client";
import { RecoilRoot } from "recoil";

export default function RecoilContextProvider({ children }: { children: React.ReactNode }) {
  return (<RecoilRoot>{children}</RecoilRoot>);
}
