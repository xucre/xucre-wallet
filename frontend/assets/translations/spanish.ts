const values = {
  CreateWallet: {
    instructions : 'Al crear una nueva billetera, recibirá una secuencia de mnemónicos que representan su "contraseña personal". Cualquier persona con esta secuencia puede reconfigurar su billetera en cualquier dispositivo nuevo. Manténgalo almacenado lo más seguro posible. Solo usted debe tener acceso a esta información.',
    instructions_button: 'Generar',
    mnemonic_confirm_button: 'Confirmar mnemotécnico',
    mnemonic_confirm_instructions: 'Guardar frase mnemotécnica',
    mnemonic_error: 'Las frases mnemotécnicas deben coincidir',
    mnemonic_error_button: 'Continuar',
    name_entry_button: 'Guardar billetera',
    name_entry_button_loadingtext: 'Sumisión',
    name_entry_input_placeholder: 'Establecer nombre de billetera',
  },
  Menu: {
    create_button: 'CREAR',
  },
  SelectLanguage : {
    en: 'Inglesa',
    es: 'Español',
  },
  SelectWallet: { 
    new_button: 'Nueva billetera',
    select_button: 'Seleccione Monedero',
    select_button_tooltip: 'Mas opciones'
  },
  ViewWallet: {
    holdings_placeholder: 'Insertar existencias de monedas',
    tab_list: ['Valores en cartera', 'Transacciones'],
    transactions_placeholder: 'Insertar historial de transacciones'
  }
};

export default values;