const values = {
  AddToken: {
    address_placeholder: 'Enter Token Address',
    chain_placeholder: 'Select Chain',
    name_placeholder: 'Enter Token Name', 
    submit_button: 'Save Token',
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
    view_wallet_title: 'Wallet',
  },
  CreateNetwork: {
    chainId_placeholder: 'Enter Chain ID',
    explorer_placeholder: 'Enter Block Explorer Url (optional)',
    name_placeholder: 'Enter Name',
    rpcUrl_placeholder: 'Enter RPC Url',
    submit_button: 'Save Network',
    symbol_placeholder: 'Enter Chain Symbol',
  },
  CreateWallet: {
    instructions : 'When creating a new wallet you will receive a sequence of mnemonics which represent your "personal password". Anyone with this sequence may be able to reconfigure your wallet in any new device. Keep it stored as secure as possible. Only you should have access to this information.',
    instructions_button: 'Generate',
    mnemonic_confirm_button: 'Confirm Mnemonic',
    mnemonic_confirm_instructions: 'Save Mnemonic Phrase',
    mnemonic_error: 'Mnemonic phrases must match',
    mnemonic_error_button: 'Continue',
    name_entry_button: 'Save Wallet',
    name_entry_button_loadingtext: 'Submitting',
    name_entry_input_placeholder: 'Set Wallet Name',
  },
  Menu: {
    network_button: 'NETWORKS',
    password_button: 'PASSWORD',
    wallet_button: 'WALLETS',
  },
  NewWallet: {
    create_button: 'Create Wallet',
    instructions: "Create new or retrieve from mnenomic",
    recover_button: 'Recover Wallet',
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
    nah: 'Nahuatl',
  },
  SelectNetwork: {
    new_button: 'New Network',
    select_button: 'Select Network',
    select_button_tooltip: 'More Options'
  },
  SelectWallet: { 
    new_button: 'New Wallet',
    select_button: 'Select Wallet',
    select_button_tooltip: 'More Options'
  },
  SendToken: {
    address_placeholder: 'Enter Receiver Address',
    submit_button: 'Send',
    title: 'Send Token',
    token_placeholder: 'Select Token',
  },
  ViewWallet: {
    clear_button: 'Clear Transactions',
    holdings_placeholder: 'Insert Coin Holdings',
    new_button: 'Add Token',
    tab_list: ['Holdings', 'Transactions', 'NFTs'],
    transactions_placeholder: 'Insert Transaction History',
  }
};

export default values;