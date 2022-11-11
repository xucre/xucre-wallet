const values = {
  AddToken: {
  address_placeholder: 'Ingrese dirección del Token',
  chain_placeholder: 'Seleccione Chain',
  name_placeholder: 'Ingrese Nombre del Token',
  submit_button: 'Guardar Token',
  },
  CreateNetwork: {
  chainId_placeholder: 'Ingrese Chain ID',
  explorer_placeholder: 'Ingrese Block Explorer Url (opcional)',
  name_placeholder: 'Ingrese Nombre',
  rpcUrl_placeholder: 'Ingrese RPC Url',
  submit_button: 'Guardar Red',
  symbol_placeholder: 'Ingrese Chain Symbol',
  },
  CreateWallet: {
    instructions : 'Al crear una nueva billetera, recibirá una secuencia de mnemónicos que representan su "contraseña personal". Cualquier persona con esta secuencia puede reconfigurar su billetera en cualquier dispositivo nuevo. Manténgalo almacenado lo más seguro posible. Solo usted debe tener acceso a esta información.',
    instructions_button: 'Generar',
    mnemonic_confirm_button: 'Confirmar mnemotécnico',
    mnemonic_confirm_instructions: 'Guardar frase mnemotécnica',
    mnemonic_error: 'Las frases mnemotécnicas deben coincidir',
    mnemonic_error_button: 'Continuar',
    name_entry_button: 'Guardar billetera',
    name_entry_button_loadingtext: 'Enviando',
    name_entry_input_placeholder: 'Establecer nombre de billetera',
  },
  Menu: {
    network_button: 'REDES',
    wallet_button: 'BILLETERAS',
  },
  NewWallet: {
    create_button: 'Crear Billetera',
    instructions: 'Crear Nueva o recuperar usando mnemónicos',
    recover_button: 'Recuperar Billetera',
  },
  QRWallet: {
    instructions: 'Compartir para recibir fondos'
  },
  RecoverWallet: {
    instructions: 'Porfavor ingrese la secuencia de mnemónicos del proceso de creacion de su wallet original.',
    instructions_button: 'Recuperar',
    mnemonic_entry_input_placeholder: 'Ingrese frase mnemónica separada por espacios',
    mnemonic_not_complete: 'El mnemónicos no tiene la longitud adecuada',
    name_entry_input_placeholder: 'Ingrese Nombre de la billetera',
    save_button: 'Guardar',
    save_button_loadingtext: 'Enviando'
  },
  SelectLanguage : {
    en: 'Ingles',
    es: 'Español',
  },
  SelectNetwork: {
    new_button: 'Nueva Red',
    select_button: 'Seleccione Red',
    select_button_tooltip: 'Mas Opciones'
  },
  SelectWallet: {
    new_button: 'Nueva billetera',
    select_button: 'Seleccione billetera',
    select_button_tooltip: 'Mas opciones'
  },
  SendToken: {
    address_placeholder: 'Ingrese direccion del Receptor',
    submit_button: 'Enviar',
    title: 'Enviar Token',
    token_placeholder: 'Seleccionar Token',
  },
  ViewWallet: {
    clear_button: 'Limpiar Transacciones',
    holdings_placeholder: 'Insertar existencias de monedas',
    new_button: 'Agregar Token',
    tab_list: ['Valores en cartera', 'Transacciones'],
    transactions_placeholder: 'Insertar historial de transacciones'
  }
};

export default values;