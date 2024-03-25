import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { RecoilRoot } from "recoil";
import { AppWallet, activeWallet } from "../service/state";
import { RecoilObserver } from "../service/testUtils";

const testState = {
  address: process.env.TEST_ADDRESS,
  name: 'testWallet',
  wallet: process.env.TEST_PRIVATE_KEY
} as AppWallet;
const Wrapper = ({ children }: { children: any }) => {
  return (
    <RecoilRoot>
      <RecoilObserver node={activeWallet} _value={testState} />
      <NativeBaseProvider>
        <NavigationContainer>
          {children}
        </NavigationContainer>
      </NativeBaseProvider>
    </RecoilRoot>
  )
}

export default Wrapper;