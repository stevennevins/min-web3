import { JsonRpcProvider } from "@ethersproject/providers";
import { INFURA_URL, INFURA_ID } from "../constants";

const localProvider = new JsonRpcProvider(INFURA_URL + INFURA_ID);

//Could make this a useEffect hook with the network as the dep array
const useProvider = () => {
  // useProvider to get connection to local provider
  return localProvider;
};

export default useProvider;
