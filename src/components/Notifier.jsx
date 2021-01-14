import { hexlify } from "@ethersproject/bytes";
import Notify from "bnc-notify";
import { BncKey } from "../constants";
import { useNetwork, useAddress, useBalance, useSigner } from "../context";
import { useProvider } from "../hooks";

// https://docs.blocknative.com/notify
//switch to using the context

export default function Notifier(provider, gasPrice, etherscan) {
  if (typeof provider !== "undefined") {
    // eslint-disable-next-line consistent-return
    return async (tx) => {
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      console.log("network", network);
      const options = {
        dappId: BncKey,
        system: "ethereum",
        networkId: network.chainId,
        // darkMode: Boolean, // (default: false)
        transactionHandler: (txInformation) => {
          console.log("HANDLE TX", txInformation);
        }
      };
      const notify = Notify(options);

      let etherscanNetwork = "";
      if (network.name && network.chainId > 1) {
        etherscanNetwork = network.name + ".";
      }

      let etherscanTxUrl = "https://" + etherscanNetwork + "etherscan.io/tx/";
      if (network.chainId === 100) {
        etherscanTxUrl = "https://blockscout.com/poa/xdai/tx/";
      }

      try {
        let result;
        if (tx instanceof Promise) {
          console.log("AWAITING TX", tx);
          result = await tx;
        }
        console.log("RESULT:", result);

        // if it is a valid Notify.js network, use that, if not, just send a default notification
        if ([1, 3, 4, 5, 42, 100].indexOf(network.chainId) >= 0) {
          const { emitter } = notify.hash(result.hash);
          emitter.on("all", (transaction) => {
            return {
              onclick: () =>
                window.open((etherscan || etherscanTxUrl) + transaction.hash)
            };
          });
        }
        // else {
        //   notification.info({
        //     message: "Local Transaction Sent",
        //     description: result.hash,
        //     placement: "bottomRight"
        //   });
        // }

        return result;
      } catch (e) {
        console.log(e);
        console.log("Transaction Error:", e.message);
        // notification.error({
        //   message: "Transaction Error",
        //   description: e.message
        // });
      }
    };
  }
}
