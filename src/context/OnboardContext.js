import React, { Component, createContext, useContext } from "react";
import Onboard from "bnc-onboard";
import { Web3Provider } from "ethers/providers";
import { BncKey } from "../constants";

export const OnboardContext = createContext({});

export function useOnboardContext() {
  return useContext(OnboardContext);
}

const walletChecks = [{ checkName: "connect" }, { checkName: "network" }];

const wallets = [{ walletName: "metamask", preferred: true }];

class OnboardProvider extends Component {
  state = {
    onboard: {},
    address: "",
    balance: "",
    network: 0,
    wallet: {},
    mobileDevice: false,
    appNetworkId: 0,
    setup: () => null
  };

  constructor(props) {
    super(props);

    const initialisation = {
      dappId: BncKey,
      networkId: 42,
      walletCheck: walletChecks,
      walletSelect: {
        heading: "Select a wallet to connect",
        description:
          "This app is underdevelopment so feel free to reach out to me with any issues @stevennevins on twitter",
        wallets
      },
      subscriptions: {
        address: (address) => {
          this.setState({ address });
        },
        balance: (balance) => {
          this.setState({ balance });
        },
        network: (network) => {
          this.setState({ network });
        },
        wallet: (wallet) => {
          this.setState({ wallet });
        }
      }
    };

    const onboard = Onboard(initialisation);

    this.state = {
      ...this.state,
      onboard
    };
  }

  componentDidMount() {
    this.setup("MetaMask");
  }

  setup = async (defaultWallet) => {
    const { onboard } = this.state;
    try {
      const selected = await onboard.walletSelect(defaultWallet);
      if (selected) {
        const ready = await onboard.walletCheck();
        if (ready) {
          const walletState = onboard.getState();
          this.setState({ ...walletState });
          console.log(walletState);
        } else {
          // Connection to wallet failed
        }
      } else {
        // User aborted set up
      }
    } catch (error) {
      console.log("error onboarding", error);
    }
  };

  setConfig = (config) => this.state.onboard.config(config);

  render() {
    return (
      <OnboardContext.Provider value={{ ...this.state, setup: this.setup }}>
        {this.props.children}
      </OnboardContext.Provider>
    );
  }
}

export const useOnboard = () => {
  const { onboard } = useOnboardContext();
  return onboard;
};

export const useGetState = () => {
  const { onboard } = useOnboardContext();
  return onboard.getState();
};

export const useAddress = () => {
  const { address } = useOnboardContext();
  return address;
};

export const useBalance = () => {
  const { balance } = useOnboardContext();
  return balance;
};

export const useWallet = () => {
  const { wallet } = useOnboardContext();
  return wallet;
};

export const useNetwork = () => {
  const { network } = useOnboardContext();
  return network;
};

export const useSetup = () => {
  const { setup } = useOnboardContext();
  return setup;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useWalletProvider = () => {
  const { provider } = useWallet() || {};
  return provider;
};

export const useSigner = () => {
  const provider = useWalletProvider();
  const network = useNetwork();
  if (network && provider) {
    const signer = new Web3Provider(provider).getSigner();
    return signer;
  }
  return {};
};

export default OnboardProvider;
