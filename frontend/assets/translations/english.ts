const values = {
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
    wallet_button: 'WALLETS',
  },
  SelectLanguage : {
    en: 'English',
    es: 'Spanish',
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
  ViewWallet: {
    holdings_placeholder: 'Insert Coin Holdings',
    tab_list: ['Holdings', 'Transactions'],
    transactions_placeholder: 'Insert Transaction History'
  }
};

export default values;