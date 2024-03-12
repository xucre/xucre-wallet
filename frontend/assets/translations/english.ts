import { TranslationType } from ".";
import TransactionFeed from '../../components/transaction/TransactionFeed';
import RecoverMnemonic from '../../components/wallet/RecoverMnemonic';
/* eslint-disable sort-keys */
const values : TranslationType = {
  AddToken: {
    address_placeholder: "Enter Token Address",
    chain_placeholder: "Select Chain",
    name_placeholder: "Enter Token Name",
    submit_button: "Save Token",
    title: "Add Token"
  },
  App: {
    select_network_title: "Networks",
    select_wallet_title: "Wallets",
    send_transaction_title: "Send Transaction",
    set_password_title: "Set Password",
    sign_message_title: "Sign Message",
    sign_transaction_title: "Sign Transaction",
    token_title: "Wallet",
    view_network_title: "Network",
    view_wallet_title: "Wallet"
  },
  Buttons_Footer: {
    buttonswap: "SWAP",
    history: "History",
    home: "Home",
    profile: "Profile",
    support: "Support"
  },
  Buttons_Header: {
    buy: "Buy",
    connect: "Connect",
    nft: "NFT",
    receive: "Receive",
    send: "Send",
    profile: "Profile",
  },
  ConnectionRequest: {
    approve_button: "Approve",
    next_button: "Next",
    reject_button: "Reject",
    rejected: "rejected by user",
    title: "Connection Request",
    wallet_select_instructions: "Select wallet(s) to connect"
  },
  Connections: {
    delete_button: "Disconnect"
  },
  ConnectManagement: {
    tab_list: [
      'Connections',
      'Requests'
    ]
  },
  CreateNetwork: {
    button_save: "Save",
    chainId_placeholder: "Enter Chain ID",
    explorer_placeholder: "Enter Block Explorer Url (optional)",
    name_placeholder: "Enter Name",
    rpcUrl_placeholder: "Enter RPC Url",
    submit_button: "Save",
    symbol_placeholder: "Enter Chain Symbol",
    title: "New Network"
  },
  CreateWallet: {
    add_to_google: "Add to Google Wallet",
    instructions: "When creating a new wallet you will receive a sequence of mnemonics which represent your \"personal password\". Anyone with this sequence may be able to reconfigure your wallet in any new device. Keep it stored as secure as possible. Only you should have access to this information.",
    instructions_button: "Next",
    instructions_nameWallet: "Set your wallet name",
    instructions_newWwallet: "New Wallet",
    mnemonic_confirm_button: "Next",
    mnemonic_confirm_instructions: "Save Mnemonic Phrase",
    mnemonic_error: "Mnemonic phrases must match",
    mnemonic_error_button: "Next",
    mnemonic_instructions: "Please select the order and save this words. If you lose them you will never be able to recover your wallet",
    name_entry_button: "Save Wallet",
    name_entry_button_loadingtext: "Submitting",
    name_entry_input_placeholder: "Set Wallet Name",
    name_wallet: "Wallet name"
  },
  ExportWallet: {
    button_loading: 'Generating',
    instructions: 'Please remember your password. It will encrypt your wallet so only you can retrieve it.',
    invalid_wallet: 'Invalid Wallet Selected',
    title: 'Export Wallet'
  },
  LanguagePage: {
    menu_button: "LANGUAGE",
    select_language: "ENGLISH",
    title_language: "SELECT YOUR LANGUAGE"
  },
  LegacyEthSign: {
    approve_button: "Approve",
    header: "Signature Request",
    reject_button: "Reject",
    title: "Sign Message"
  },
  LegacySendTransaction: {
    amount: "Amount ",
    approve_button: "Approve",
    from: "From ",
    header: "Sign Transaction",
    reject_button: "Reject",
    title: "Send Transaction",
    to: "To "
  },
  LegacySignTransaction: {
    approve_button: "Approve",
    header: "Sign Transaction",
    reject_button: "Reject",
    title: "Sign Transaction"
  },
  LegacySignTypedData: {
    approve_button: "Approve",
    header: "Sign Message Request",
    header_origin: "Origin: ",
    reject_button: "Reject",
    title: "Sign Message"
  },
  Listener: {
    failure_message: "Transaction Failed",
    success_message: "Transaction Successful"
  },
  Menu: {
    connections_button: 'CONNECTIONS',
    network_button: "NETWORKS",
    nft_button: "NFTS",
    password_button: "PASSWORD",
    qr_scan_button: "QR SCAN",
    requests_button: 'REQUESTS',
    wallet_button: "WALLETS"
  },
  NewWallet: {
    about: "Create a new wallet or if you already have one retrieve it through your security phrase",
    create_button: "Create Wallet",
    instructions: "Your Wallet",
    recover_button: "Recover Wallet"
  },
  PasswordComponent: {
    error_message: "Invalid Password",
    form_label: "Password",
    form_placeholder: "Input password",
    header: "Password",
    submit_button: "Submit"
  },
  QRReader: {
    permission_denied: "No access to camera",
    permission_request: "Requesting for camera permission",
    rescan: "Tap to Scan Again"
  },
  QRWallet: {
    instructions: "Share to receive funds",
    toast_send: "WhatsApp sent successfully!"
  },
  RecoverMnemonic: {
    instructions: 'Please enter the name and the sequence of mnemonics from your original wallet creation process.',
    wallet_name_label: 'Wallet Name',
    mnemonic_label: 'Mnemonic'
  },
  RecoverPrivateKey: {
    instructions: 'Please enter the name, password, and private key from the pass in your Google Wallet.',
    wallet_name_label: 'Wallet Name',
    password_label: 'Password',
    private_key_label: 'Private Key'
  },
  RecoverWallet: {
    instructions: "Please input the sequence of mnemonics from your original wallet creation process.",
    instructions_button: "Recover",
    header: 'Recover Wallet',
    mnemonic_button: "Mnemonic",
    google_wallet_button: "Google Wallet Pass",
    mnemonic_entry_input_placeholder: "Enter mnemonic phrase separated by single spaces",
    mnemonic_not_complete: "Mnemonic not the appropriate length",
    name_entry_input_placeholder: "Set Wallet Name",
    save_button: "Save",
    save_button_loadingtext: "Submitting"
  },
  Requests: {
    delete_button: 'Delete',
    expired_text: 'Expired'
  },
  SelectLanguage: {
    en: "English",
    es: "Spanish",
    nah: "Nahuatl",
    pt: "Portuguese",
    qu: "Quechua"
  },
  SelectNetwork: {
    delete_button: 'Delete Network',
    new_button: "New Network",
    select_button: "Select Network",
    select_button_tooltip: "More Options",
    select_network: "Select or create a new network",
    select_network_default: "Select Default Network",
    title: "Networks"
  },
  SelectWallet: {
    export_button: "Export Wallet",
    new_button: "New Wallet",
    select_button: "Select Wallet",
    select_button_tooltip: "More Options",
    title: "Select Wallet"
  },
  SendToken: {
    address_placeholder: "Enter Receiver Address",
    not_enough_error: "Insufficient Balance",
    submit_button: "Send",
    title: "Send Token",
    token_placeholder: "Select Token"
  },
  SendTransaction: {
    amount: "Amount: ",
    approve_button: "Approve",
    from: "From: ",
    header: "Sign Transaction",
    hide_data: "Hide Data",
    reject_button: "Reject",
    title: "Send Transaction",
    to: "To: ",
    view_data: "View Data"
  },
  SetPassword: {
    form_confirmation: "Confirm Password",
    form_error_text: "At least 6 characters are required.",
    form_helper_text: "Must be atleast 6 characters.",
    form_new_header: "Password",
    form_old_header: "Current Password",
    form_save_button: "Save",
    password_placeholder: "password",
    update_button: "Update Password",
    title: "Set Password"
  },
  SignEth: {
    approve_button: "Approve",
    header: "Signature Request",
    reject_button: "Reject",
    title: "Sign Message"
  },
  SignTransaction: {
    approve_button: "Approve",
    header: "Sign Transaction",
    reject_button: "Reject",
    title: "Sign Transaction"
  },
  SignTyped: {
    approve_button: "Approve",
    header: "Sign Message Request",
    header_origin: "Origin: ",
    reject_button: "Reject",
    title: "Sign Message"
  },
  SupportPage: {
    button_cancel: "Cancel",
    button_send: "Send Email",
    describe_issue: "Describe your issue",
    introduction: "If you have problems with our app please contact us at support@xucre.com or use the form below",
    subject_send: "Subject",
    title: "Support",
    to_send: "From",
    toast_send: "Email sent successfully!"
  },
  SwapToken: {
    title: "Swap"
  },
  TokenItem: {
    blacklist_button: 'Mark as Spam',
    delete_button: 'Delete Token',
    menu_accessiblity_label: "More options menu",
    send_token_button: "Send"
  },
  TransactionFeed: {
    title: "Transactions"
  },
  ViewNetwork: {
    active_network: "Active Network",
    edit_button: "Edit",
    title: "Network",
    use_network: "Use Network"
  },
  ViewWallet: {
    clear_button: "Clear Transactions",
    holdings_placeholder: "Insert Coin Holdings",
    new_button: "Add Token",
    no_network_error: 'No Network Selected',
    tab_list: [
      "Holdings",
      "Transactions"
    ],
    title: "Wallet",
    transactions_placeholder: "Insert Transaction History"
  },
  WalletConnect : {
    session_proposal: ['Session Proposal', 'A dapp wants to connect your wallet'],
    session_request_sign_tx: ['Sign Transaction', 'Please approve or reject request'],
    session_request_send_tx: ['Send Transaction', 'Please approve or reject request'],
  },
  WalletHistory: {
    title: "History",
    total_balance: 'Total Balance'
  },
  WhatsAppNotification:{
    button: "Send WhatsApp notification",
    Send_Button: "Send Whatsapp",
    notificationNumber: "Please enter the country code including the + sign"
  },
  totalBalance:{
    title: "Total Balance"
  },
  termsConditions: {
    terms: "Privacy Policy for XucreWallet and Xucre.net Effective Date: July 1st, 2023 Thank you for using XucreWallet, a decentralized wallet developed by Xucre Inc. This privacy policy outlines how we collect, use, disclose, and protect personal information when you use our application. Please read this policy carefully to understand our practices regarding your personal data. 1. Information We Collect 1.1. Personal Information: We may collect certain personal information from you, such as your name, email address, phone number, and any other information you provide to us when you create an account or perform transactions within the XucreWallet application. 1.2. Wallet Information: When you use XucreWallet, we may collect and store information related to your cryptocurrency transactions, including transaction history, wallet addresses, and transaction amounts. 2. Use of Information 2.1. Xucre Inc. does not have the ability to access, modify, control, or revert any transactions or changes made within the XucreWallet application. We cannot recover lost or forgotten wallet credentials, including mnemonic phrases or private keys. It is your sole responsibility to maintain the secure storage and backup of your wallet credentials. 2.2. We will use the personal information you provide solely for the purpose of providing and improving the XucreWallet services. This includes: facilitating transactions, providing customer support, preventing fraudulent or unauthorized activities, and complying with legal obligations. 3. Disclosure of Information 3.1. We may share your personal information with selected third-party service providers, solely to the extent necessary to provide the services associated with XucreWallet. These third-party service providers are obligated to maintain the confidentiality and security of your personal information in accordance with applicable laws. 3.2. We may disclose your personal information if required by law or in response to a valid legal process, such as a court order or government request. 4. Data Security 4.1. Xucre Inc. takes reasonable measures to secure your personal information and protect it from unauthorized access, alteration, or disclosure. However, please be aware that no security measures can guarantee complete protection, and we cannot guarantee that your personal information will always remain secure. 5. Cross-Border Data Transfers 5.1. Xucre Inc. operates in multiple jurisdictions, including the British Virgin Islands, the United States (Delaware), and Ecuador (Quito). By using XucreWallet, you consent to the transfer of your personal information to these jurisdictions, which may have different data protection laws than your country. 6. Third-Party Websites and Services 6.1. The XucreWallet application may contain links to third-party websites or services that are not owned or controlled by Xucre Inc. This privacy policy applies only to our application, and we are not responsible for the privacy practices of any third-party websites or services. 7. Changes to this Privacy Policy 7.1. Xucre Inc. may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy within the XucreWallet application or through other appropriate means. We encourage you to review this policy periodically for any updates. 8. Contact Us 8.1. If you have any questions or concerns about this privacy policy or our data practices, please contact us at info@xucre.net. By using XucreWallet, you agree to the terms and conditions outlined in this privacy policy. If you do not agree to this policy, please do not use our application. Terms of Service for Xucre.net Website Effective Date: July 1st, 2023 These terms of service ( Terms ) govern your use of the XucreWallet website, including any associated software applications (collectively, the  Service ), provided by Xucre Inc. ( Xucre ,  we ,  us , or  our ). By using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service. 1. Eligibility 1.1. You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using the Service on behalf of an entity, you represent and warrant that you have authority to bind that entity to these Terms. 2. User Accounts 2.1. In order to use certain features of the Service, you may be required to create a user account. You are responsible for providing accurate and complete information during the account registration process and for maintaining the confidentiality of your account credentials. 2.2. You are solely responsible for all activities that occur under your user account. Xucre Inc. is not responsible for any unauthorized access to or use of your account. If you suspect any unauthorized access, you must notify us immediately. 3. Use of the Service 3.1. XucreWallet is a decentralized wallet that allows you to manage your cryptocurrency. By using the Service, you understand and acknowledge that Xucre Inc. does not have the ability to access, modify, control, or revert any transactions or changes made within the XucreWallet application, including the loss or recovery of wallet credentials, such as mnemonic phrases or private keys. 3.2. You agree to use the Service only for lawful purposes and in compliance with all applicable laws and regulations. You are responsible for ensuring that your use of the Service does not violate any third-party rights. 4. Intellectual Property Rights 4.1. The Service, including any software, content, and materials made available through the Service, are owned by Xucre Inc. and protected by intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the Service without our prior written consent. 5. Privacy 5.1. We collect, use, and disclose personal information in accordance with our Privacy Policy. By using the Service, you consent to our collection, use, and disclosure of personal information as described in the Privacy Policy. 6. Disclaimers and Limitations of Liability 6.1. The Service is provided on an  as is  and  as available  basis, without any warranties or representations, whether express or implied. We do not guarantee the accuracy, completeness, or timeliness of the Service. 6.2. Xucre Inc. shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including lost profits, resulting from your use of the Service. 7. Indemnification 7.1. You agree to indemnify, defend, and hold Xucre Inc., its directors, officers, employees, and agents harmless from any and all claims, liabilities, damages, costs, and expenses (including reasonable attorneys' fees) arising out of or in connection with your use of the Service, your breach of these Terms, or your violation of any law or third-party rights. 8. Amendments and Termination 8.1. We reserve the right to modify or update these Terms at any time. Any changes will be effective immediately upon posting the revised Terms on the XucreWallet website or within the application. Your continued use of the Service after the posting of any changes constitutes your acceptance of such changes. If you do not agree to the modified Terms, you must stop using the Service. 8.2. We may terminate or suspend your access to the Service, with or without cause, at any time and without prior notice. 9. Governing Law and Dispute Resolution 9.1. These Terms shall be governed by and construed in accordance with the laws of the British Virgin Islands, without regard to its conflict of laws principles. 9.2. Any dispute arising out of or in connection with these Terms shall be resolved through negotiations in good faith. If the dispute cannot be resolved amicably, it shall be referred to and finally resolved by arbitration in accordance with the rules of the British Virgin Islands International Arbitration Centre. 10. Severability 10.1. If any provision of these Terms is held to be invalid, illegal, or unenforceable, the validity, legality, or enforceability of the remaining provisions shall not in any way be affected or impaired. 11. Entire Agreement 11.1. These Terms constitute the entire agreement between you and Xucre Inc. regarding your use of the Service and supersede any prior or contemporaneous agreements, understandings, or arrangements. If you have any questions or concerns about these Terms, please contact us at info@xucre.net By using XucreWallet, you agree to comply with these Terms. Terms of Service for Xucre Wallet Android/iOS Effective Date: July 1st, 2023 These Terms of Service ( Terms ) constitute a legally binding agreement between you ( User  or  you ) and Xucre Wallet ( Xucre,   we,  or  us ) regarding your use of the Xucre Wallet, a web3 digital wallet available in Ecuador, Peru, and Mexico. By accessing, registering, or using the Xucre Wallet, you agree to be bound by these Terms. Please read these Terms carefully before using the Xucre Wallet. 1. Definitions 1.1 Xucre Wallet: Refers to the digital wallet application provided by Xucre that allows Users to manage and store digital assets, including cryptocurrencies and non-fungible tokens (NFTs). 1.2 Digital Assets: Refers to cryptocurrencies, tokens, and other digital representations of value that are supported by the Xucre Wallet. 1.3 NFTs: Refers to non-fungible tokens, unique digital assets that are stored and managed within the Xucre Wallet. 2. Prohibited Activities 2.1 Illegal Activities: You agree not to use the Xucre Wallet for any illegal activities, including but not limited to money laundering, terrorist financing, fraud, or any other activity that violates applicable laws or regulations. 2.2 Compliance with Laws: You shall comply with all applicable laws, regulations, and guidelines related to the use of the Xucre Wallet, including those related to cryptocurrencies, financial transactions, and data privacy. 3. Classification of Cryptos 3.1 Asset Classification: Xucre Wallet considers cryptocurrencies to be digital assets in accordance with current legal interpretations. Therefore, any references to cryptocurrencies within these Terms shall be considered as references to digital assets. 4. Buying, Selling, and Exchanging of Tokens 4.1 Exchange Services: Xucre Wallet may provide you with the ability to buy, sell, and exchange digital assets through approved third-party exchanges. You acknowledge and agree that any transactions facilitated by Xucre Wallet involving digital assets are subject to the terms and conditions of these third-party exchanges. 4.2 Risk and Responsibility: Xucre Wallet does not guarantee the availability, accuracy, or timeliness of exchange services. You understand and accept that the buying, selling, and exchanging of digital assets involve inherent risks and that you are solely responsible for evaluating and assuming those risks. 5. NFTs within Xucre Wallet 5.1 NFT storage and management: Xucre Wallet enables Users to store and manage NFTs within the wallet. However, Xucre Wallet does not endorse or control the creation, issuance, or exchange of NFTs and shall not be held liable for any NFT-related transactions or disputes. 5.2 NFT Marketplace: Xucre Wallet may provide access to NFT marketplaces within the wallet. The use of such marketplaces is subject to their respective terms and conditions, and Xucre Wallet shall not be responsible for the availability, legality, or quality of the NFTs listed on these marketplaces. 6. Multi-language Support 6.1 Language Options: Xucre Wallet is available in Spanish, Portuguese, English, Quechua, and Nahuatl languages. You may choose the preferred language for your use of the Xucre Wallet. 6.2 Translation Discrepancies: In the event of any discrepancies between different language versions of these Terms, the Spanish version shall prevail. 7. Intellectual Property 7.1 Xucre Wallet: Xucre Wallet and its associated logos, trademarks, copyrights, and other intellectual property rights are owned by Xucre or its licensors. You shall not use, modify, reproduce, distribute, or create derivative works based on Xucre Wallet or its contents unless expressly authorized by Xucre. 8. Termination 8.1 Termination by Xucre Wallet: Xucre Wallet reserves the right to suspend or terminate your access to the Xucre Wallet at any time, with or without cause, without prior notice. 8.2 Effect of Termination: Upon termination, you agree to cease all use of the Xucre Wallet and acknowledge that Xucre Wallet shall not be liable to you or any third party for any damages, losses, or liabilities resulting from the termination. 9. General Provisions 9.1 Entire Agreement: These Terms constitute the entire agreement between you and Xucre Wallet concerning your use of the Xucre Wallet and supersede any prior agreements, communications, or understandings. 9.2 Modification: Xucre Wallet reserves the right to modify or update these Terms at any time in its sole discretion. Any changes will be effective upon posting of the modified Terms on the Xucre Wallet website or within the application. 9.3 Governing Law and Jurisdiction: These Terms shall be governed by and construed in accordance with the laws of Ecuador. Any disputes arising out of or in connection with these Terms shall be resolved exclusively by the courts of Ecuador. 9.4 Severability: If any provision of these Terms is deemed invalid or unenforceable, such provision shall be interpreted to the fullest extent permitted by applicable law, and the remaining provisions shall continue in full force and effect. By downloading, installing and using the Xucre Wallet, you acknowledge that you have read, understood, and agreed to these Terms of Service.",
    button_Accept: "Accept",
    title: "Terms and Conditions",
    accept_terms: "I accept the terms and conditions"

  } 
};

export default values;