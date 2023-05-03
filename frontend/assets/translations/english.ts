const values = {
  AddToken: {
    address_placeholder: 'Enter Token Address',
    chain_placeholder: 'Select Chain',
    name_placeholder: 'Enter Token Name', 
    submit_button: 'Save Token',
    title: 'Wallet'
  },
  App: {
    select_network_title: 'Networks',
    select_wallet_title: 'Wallets',
    send_transaction_title: 'Send Transaction',
    set_password_title: 'Set Password',
    sign_message_title: 'Sign Message',
    sign_transaction_title: 'Sign Transaction',
    token_title: 'Wallet',
    view_network_title: 'Network',
    view_wallet_title: 'Wallet'
  },
  ConnectionRequest: {
    approve_button: 'Approve',
    next_button: 'Next',
    reject_button: 'Reject',
    rejected: "rejected by user",
    title: 'Connection Request',
    wallet_select_instructions: 'Select Wallet(s)',
  },
  CreateNetwork: {
    button_save: 'Save',
    chainId_placeholder: 'Enter Chain ID',
    explorer_placeholder: 'Enter Block Explorer Url (optional)',
    name_placeholder: 'Enter Name',
    rpcUrl_placeholder: 'Enter RPC Url',
    submit_button: 'Save',
    symbol_placeholder: 'Enter Chain Symbol',
    button_save: 'Save'
  },
  CreateWallet: {
    instructions : 'When creating a new wallet you will receive a sequence of mnemonics which represent your "personal password". Anyone with this sequence may be able to reconfigure your wallet in any new device. Keep it stored as secure as possible. Only you should have access to this information.',
    instructions_button: 'Next',
    instructions_nameWallet: 'Set your wallet name',
    instructions_newWwallet: 'New Wallet',
    mnemonic_confirm_button: 'Next',
    mnemonic_confirm_instructions: 'Save Mnemonic Phrase',
    mnemonic_error: 'Mnemonic phrases must match',
    mnemonic_error_button: 'Next',
    mnemonic_instructions: 'Please select the order and save this words. If you lose them you will never be able to recover your wallet',
    name_entry_button: 'Save Wallet',
    name_entry_button_loadingtext: 'Submitting',
    name_entry_input_placeholder: 'Set Wallet Name',
    name_wallet: 'Wallet name'
  },
  LegacyEthSign: {
    approve_button: 'Approve',
    header: 'Signature Request',
    reject_button: 'Reject',
    title: 'Sign Message'
  },
  LegacySendTransaction: {
    amount: 'Amount: ',
    approve_button: 'Approve',
    from :'From: ',
    header: 'Sign Transaction',
    reject_button: 'Reject',
    title: 'Send Transaction',
    to: 'To: '
  },
  LegacySignTransaction: {
    approve_button: 'Approve',
    header: 'Sign Transaction',
    reject_button: 'Reject',
    title: 'Sign Transaction'
  },
  LegacySignTypedData: {
    approve_button: 'Approve',
    header: 'Sign Message Request',
    header_origin: 'Origin: ',
    reject_button: 'Reject',
    title: 'Sign Message'
  },
  Listener: {
    failure_message: 'Transaction Failed',
    success_message: 'Transaction Successful'
  },
  Menu: {
    network_button: 'NETWORKS',
    nft_button: 'NFTS',
    password_button: 'PASSWORD',
    qr_scan_button: 'QR SCAN',
    wallet_button: 'WALLETS',
  },
  NewWallet: {
    about: "Create a new wallet or if you already have one retrieve it through your security phrase",
    create_button: 'Create Wallet',
    instructions: "Your Wallet",
    recover_button: 'Recover Wallet',
  },
  PasswordComponent: {
    error_message: 'Invalid Password',
    form_label: 'Password',
    form_placeholder: 'Input password',
    header: 'Password',
    submit_button: 'Submit'
  },
  QRReader: {
    permission_denied: 'No access to camera',
    permission_request: 'Requesting for camera permission',
    rescan: 'Tap to Scan Again'
  },
  QRWallet: {
    instructions: 'Share to receive funds'
  },
  RecoverWallet: {
    instructions: 'Please input the sequence of mnemonics from your original wallet creation process.',
    instructions_button: 'Recover',
    mnemonic_entry_input_placeholder: 'Enter mnemonic phrase separated by single spaces',
    mnemonic_not_complete: 'Mnemonic not the appropriate length',
    name_entry_input_placeholder: 'Set Wallet Name',
    save_button: 'Save',
    save_button_loadingtext: 'Submitting'
  },
  SelectLanguage : {
    en: 'English',
    es: 'Spanish',
    pt: 'Portuguese',
    qu: 'Quechua',
    nah: 'Nahuatl'
  },
  SelectNetwork: {
    title: 'Networks',
    new_button: 'New Network',
    select_button: 'Select Network',
    select_button_tooltip: 'More Options',
    select_network: 'Select or create a new network',
    title: 'Networks'
  },
  SelectWallet: { 
    new_button: 'New Wallet',
    select_button: 'Select Wallet',
    select_button_tooltip: 'More Options',
    title: 'Select Wallet'
  },
  SendToken: {
    address_placeholder: 'Enter Receiver Address',
    submit_button: 'Send',
    title: 'Send Token',
    token_placeholder: 'Select Token',
  },
  SendTransaction: {
    amount: 'Amount: ',
    approve_button: 'Approve',
    from :'From: ',
    header: 'Sign Transaction',
    reject_button: 'Reject',
    title: 'Send Transaction',
    to: 'To: '
  },
  SetPassword: {
    form_confirmation: 'Confirm Password',
    form_error_text: 'At least 6 characters are required.',
    form_helper_text: 'Must be atleast 6 characters.',
    form_new_header: 'Password',
    form_old_header: 'Current Password',
    form_save_button: 'Save',
    password_placeholder: 'password',
    title: 'Set Password'
  },
  SignEth: {
    approve_button: 'Approve',
    header: 'Signature Request',
    reject_button: 'Reject',
    title: 'Sign Message'
  },
  SignTransaction: {
    approve_button: 'Approve',
    header: 'Sign Transaction',
    reject_button: 'Reject',
    title: 'Sign Transaction'
  },
  SignTyped: {
    approve_button: 'Approve',
    header: 'Sign Message Request',
    header_origin: 'Origin: ',
    reject_button: 'Reject',
    title: 'Sign Message'
  },
  SwapToken: {
    title: 'Wallet'
  },
  TokenItem: {
    menu_accessiblity_label: "More options menu",
    send_token_button: 'Send'
  },
  ViewNetwork: {
    title: 'Network',
    edit_button: 'Edit',
    active_network: 'Active Network',
    use_network: 'Use Network'
  },
  ViewWallet: {
    clear_button: 'Clear Transactions',
    holdings_placeholder: 'Insert Coin Holdings',
    new_button: 'Add Token',
    tab_list: ['Holdings', 'Transactions'],
    title: 'Wallet',
    transactions_placeholder: 'Insert Transaction History',
  },
  SupportPage:{
    title: 'Support',
    introduction: 'If you have problems with our app please contact us at support@xsucre.com or use the form below',
    to_send: 'From',
    subject_send:'Subject',
    describe_issue: 'Describe your issue',
    button_send: 'Send Email',
    toast_send: 'Email sent successfully!'
  },
  WalletHistory: {
    title: 'History'
  }, 
  Buttons_Header:{
    send: 'Send',
    receive: 'Receive',
    buy: 'Buy',
    nft: 'NFT'
  },
  Buttons_Footer:{
    home: 'Home',
    history: 'History',
    buttonswap: 'SWAP',
    support: 'Support',
    profile: 'Profile'
  }

};

export default values;