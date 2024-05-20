import English from "./english";
import Nahuatl from './nahuatl';
import Portuguese from './portuguese';
import Quechua from './quechua';
import Spanish from './spanish';
import SelectExtension from '../../pages/extensions/SelectExtension';
import NftDashboard from '../../pages/nft/NftDashboard';

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
  SelectExtension: any,
  ExportWallet: any,
  LanguagePage: any,
  LegacyEthSign: any,
  LegacySendTransaction: any,
  LegacySignTransaction: any,
  LegacySignTypedData: any,
  Listener: any,
  Menu: any,
  NewWallet: any,
  NftDashboard: any,
  PasswordComponent: any,
  QRReader: any,
  QRWallet: any,
  RecoverMnemonic: any,
  RecoverPrivateKey: any,
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
  TransactionFeed: any,
  ViewNetwork: any,
  ViewToken: any,
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
  ui: any
}



export default {
  en: English,
  es: Spanish,
  nah: Nahuatl,
  pt: Portuguese,
  qu: Quechua
}