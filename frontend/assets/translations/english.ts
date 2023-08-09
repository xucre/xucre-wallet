/* eslint-disable sort-keys */
const values = {
  AddToken: {
    address_placeholder: "Enter Token Address",
    chain_placeholder: "Select Chain",
    name_placeholder: "Enter Token Name",
    submit_button: "Save Token",
    title: "Wallet"
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
  CreateNetwork: {
    button_save: "Save",
    chainId_placeholder: "Enter Chain ID",
    explorer_placeholder: "Enter Block Explorer Url (optional)",
    name_placeholder: "Enter Name",
    rpcUrl_placeholder: "Enter RPC Url",
    submit_button: "Save",
    symbol_placeholder: "Enter Chain Symbol"
  },
  CreateWallet: {
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
  LanguagePage: {
    menu_button: "Language",
    select_language: "Select your Language",
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
    connections_button: 'Connections',
    network_button: "Networks",
    nft_button: "Nfts",
    password_button: "Password",
    qr_scan_button: "QR Scan",
    requests_button: 'Requests',
    wallet_button: "Wallets"
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
  RecoverWallet: {
    instructions: "Please input the sequence of mnemonics from your original wallet creation process.",
    instructions_button: "Recover",
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
    title: "Networks"
  },
  SelectWallet: {
    new_button: "New Wallet",
    select_button: "Select Wallet",
    select_button_tooltip: "More Options",
    title: "Select Wallet"
  },
  SendToken: {
    address_placeholder: "Enter Receiver Address",
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
    title: "Wallet"
  },
  TokenItem: {
    delete_button: 'Delete Token',
    menu_accessiblity_label: "More options menu",
    send_token_button: "Send"
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
    title: "History"
  },
  WhatsAppNotification:{
    button: "Send WhatsApp notification",
    Send_Button: "Send Whatsapp"
  },
  totalBalance:{
    title: "Total Balance"
  },
  termsConditions: {
    terms: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce convallis eu massa vel congue. In malesuada cursus velit non egestas. In hac habitasse platea dictumst. Quisque malesuada mollis magna id elementum. Aenean at neque in nisi lobortis iaculis. Maecenas elementum posuere justo non venenatis. Ut faucibus et lectus at accumsan. Donec accumsan maximus ex eu vestibulum. Quisque id enim id justo porttitor pretium. Donec eget mauris gravida, cursus nisl eget, consequat sapien. Aenean at lobortis turpis, rhoncus porttitor risus. Integer nec velit sapien. Sed euismod, mi sed varius fermentum, nisl ex lacinia ante, eu interdum turpis arcu aliquam dolor. Nunc porttitor id neque quis placerat. Nulla nunc est, fermentum at vulputate sed, bibendum condimentum lectus. Morbi maximus maximus eros a scelerisque. Quisque elementum condimentum vulputate. Nam arcu magna, aliquet ac augue non, gravida efficitur purus. Cras molestie congue sem sit amet dictum. In consectetur orci nisi, ut finibus velit auctor eu. In et tortor orci.Pellentesque ut dignissim purus, sit amet semper ligula. Etiam consequat vel est et semper. Fusce ut sodales nunc. Praesent vel metus diam. Suspendisse in lorem nulla. Vivamus ut consectetur enim. Mauris vestibulum sit amet purus feugiat faucibus. Duis metus metus, suscipit a arcu eu, lacinia consequat ex. Sed semper tellus elit, quis feugiat nisl dignissim vitae.Quisque tempor ligula dolor, sed fringilla magna pulvinar et. Sed non volutpat justo. Curabitur pharetra semper vestibulum. Cras lobortis egestas posuere. Aenean at ipsum varius, accumsan orci ut, ultrices tellus. Vestibulum tempor blandit nibh id cursus. Curabitur semper metus quis ante maximus dictum. Etiam urna nisl, tempor a laoreet non, maximus in nisl. Donec ac molestie augue. Vestibulum bibendum ex non urna commodo, quis euismod ligula tristique."
  }
    
};

export default values;