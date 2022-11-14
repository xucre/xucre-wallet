const values = {
AddToken: {
    address_placeholder: 'Digite o endereço do token',
    chain_placeholder: 'Selecionar cadeia',
    name_placeholder: 'Digite o nome do token',
    submit_button: 'Salvar Token',
},
CreateNetwork: {
    chainId_placeholder: 'Digite o ID da cadeia',
    explorer_placeholder: 'Digite a URL do Explorador de Blocos (opcional)',
    name_placeholder: 'Digite o nome',
    rpcUrl_placeholder: 'Digite o URL RPC',
    submit_button: 'Salvar rede',
    symbol_placeholder: 'Digite o símbolo da cadeia',
  },
  CreateWallet: {
    instructions: 'Ao criar uma nova carteira, você receberá uma sequência de mnemônicos que representam sua "senha pessoal". Qualquer pessoa com essa sequência pode reconfigurar sua carteira em qualquer novo dispositivo. Mantenha -o armazenado o mais seguro possível. Somente você deve ter acesso a essas informações.',
    instructions_button: 'Gerar',
    mnemonic_confirm_button: 'Confirmar mnemônico',
    mnemonic_confirm_instructions: 'Salvar frase mnemônica',
    mnemonic_error: 'As frases mnemônicas devem corresponder',
    mnemonic_error_button: 'Continuar',
    name_entry_button: 'Salvar carteira',
    name_entry_button_loadingtext: 'Enviando',
    name_entry_input_placeholder: 'Definir nome da carteira',
  },
  Menu: {
    network_button: 'NETWORKS',
    wallet_button: 'WALLETS',
  },
  NewWallet: {
    create_button: 'Criar Carteira',
    instructions: "Crie novo ou recupere de mnenomic",
    recover_button: 'Recuperar carteira',
  },
  Qrwallet: {
    instructions: 'Compartilhe para receber fundos'
  },
  RecoverWallet: {
    instructions: 'Insira a sequência de mnemônicos do seu processo de criação de carteira original.',
    instructions_button: 'Recuperar',
    mnemonic_entry_input_placeholder: 'Digite a frase mnemônica separada por espaços únicos',
    mnemonic_not_complete: 'Mnemonic não é o tamanho apropriado',
    name_entry_input_placeholder: 'Definir nome da carteira',
    save_button: 'Salvar',
    save_button_loadingtext: 'Enviando'
    },
  SelectLanguage : {
    in: 'Inglês',
    es: 'Espanhol',
    po: 'Portugues'
  },
  SelectNetwork: {
    new_button: 'Nova Rede',
    select_button: 'Selecionar rede',
    select_button_tooltip: 'Mais opções'
  },
  SelectWallet: {
    new_button: 'Nova carteira',
    select_button: 'Selecionar carteira',
    select_button_tooltip: 'Mais opções'
  },
  SendToken: {
    address_placeholder: 'Digite o endereço do destinatário',
    submit_button: 'Enviar',
    title: 'Enviar token:',
    token_placeholder: 'Selecionar token',
  },
  ViewWallet: {
    clear_button: 'Limpar transações',
    holdings_placeholder: 'Inserir Holdings de moedas',
    new_button: 'Adicionar Token',
    tab_list: ['Participações', 'Transações'],
    transaction_placeholder: 'Inserir histórico de transações',
  }
};

  export default values;