import React from "react";
import {
  useNetwork,
  useAddress,
  useBalance,
  useSigner,
  useWalletProvider
} from "../context";
import { useProvider } from "../hooks";
import { Contract } from "@ethersproject/contracts";
import { useTokenBalance } from "eth-hooks";
import { LinkAdd, ILink } from "../constants";

export default function Home() {
  const network = useNetwork();
  const address = useAddress();
  const balance = useBalance();
  const provider = useWalletProvider();
  const signer = useSigner();
  const localProvider = useProvider();
  const ILinkContract = new Contract(LinkAdd, ILink, localProvider);
  const LinkBalance = useTokenBalance(ILinkContract, address);

  return (
    <div style={{ padding: 16 }}>
      {JSON.stringify(network)}
      {JSON.stringify(address)}
      {JSON.stringify(balance)}
      {JSON.stringify(provider)}
      {JSON.stringify(signer)}
      {JSON.stringify(LinkBalance)}
    </div>
  );
}
