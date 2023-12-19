import English from "./english";
import Nahuatl from './nahuatl';
import Portuguese from './portuguese';
import Quechua from './quechua';
import Spanish from './spanish';

export interface TranslationType {
  AddToken: any,
  App: any,
  Buttons_Footer: any,
  Buttons_Header: any,
  ConnectionRequest: any,
  Connections: any,
  ConnectManagement: any,
  CreateNetwork: any,
  CreateWallet: any,
  LanguagePage: any,
  LegacyEthSign: any,
  LegacySendTransaction: any,
  LegacySignTransaction: any,
  LegacySignTypedData: any,
  Listener: any,
  Menu: any,
  NewWallet: any,
  PasswordComponent: any,
  QRReader: any,
  QRWallet: any,
  RecoverWallet: any,
  Requests: any,
  SelectLanguage: any,
  SelectNetwork: any,
  SelectWallet: any,
  SendToken: any,
  SendTransaction: any,
  SetPassword: any,
  SignEth: any,
  SignTransaction: any,
  SignTyped: any,
  SupportPage: any,
  SwapToken: any,
  TokenItem: any,
  ViewNetwork: any,
  ViewWallet: {
    clear_button: string,
    holdings_placeholder: string,
    new_button: string,
    no_network_error: string,
    tab_list: string[],
    title: string,
    transactions_placeholder: string
  },
  WalletConnect: any,
  WalletHistory: any,
  WhatsAppNotification: any,
  totalBalance: any,
  termsConditions: any,
}



export default {
  en: English,
  es: Spanish,
  nah: Nahuatl,
  pt: Portuguese,
  qu: Quechua
}