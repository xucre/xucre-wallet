import { TranslationType } from ".";
/* eslint-disable sort-keys */
const values : TranslationType = {
  AddToken: {
    address_placeholder: "Ingrese dirección del Token",
    chain_placeholder: "Seleccione Chain",
    name_placeholder: "Ingrese Nombre del Token",
    submit_button: "Guardar Token",
    title: "Billetera"
  },
  App: {
    select_network_title: "Redes",
    select_wallet_title: "Wallets",
    send_transaction_title: "Enviar Transacción",
    set_password_title: "Ingresar contraseña",
    sign_message_title: "Firmar Mensaje",
    sign_transaction_title: "Firmar Transacción",
    token_title: "Billetera",
    view_network_title: "Redes",
    view_wallet_title: "Billetera"
  },
  Buttons_Footer: {
    buttonswap: "SWAP",
    history: "Historial",
    home: "Inicio",
    profile: "Perfil",
    support: "Soporte"
  },
  Buttons_Header: {
    buy: "Comprar",
    connect: "Conectar",
    nft: "NFT",
    receive: "Recibir",
    send: "Enviar",
    profile: "Perfil",
    ramp: "En rampa"
  },
  ConnectionRequest: {
    approve_button: "Aprobar",
    next_button: "Siguiente",
    reject_button: "Rechazar",
    rejected: "Rechazado por el Usuario",
    title: "Solicitud de conexión",
    wallet_select_instructions: "Seleccionar Billetera(s)"
  },
  Connections: {
    title: "Conexiones",
    delete_button: "Disconnect"
  },
  ConnectManagement: {
    tab_list: [
      'Connections',
      'Requests'
    ]
  },
  CreateNetwork: {
    button_save: "Guardar",
    chainId_placeholder: "Ingrese Chain ID",
    explorer_placeholder: "Ingrese Block Explorer Url (opcional)",
    name_placeholder: "Ingrese Nombre",
    rpcUrl_placeholder: "Ingrese RPC Url",
    submit_button: "Guardar Red",
    symbol_placeholder: "Ingrese Chain Symbol",
    title: "Nueva Network"
  },
  CreateWallet: {
    add_to_google: "Agregar a Google Wallet",
    instructions: "Al crear una nueva billetera, recibirá una secuencia de mnemónicos que representan su \"contraseña personal\". Cualquier persona con esta secuencia puede reconfigurar su billetera en cualquier dispositivo nuevo. Manténgalo almacenado lo más seguro posible. Solo usted debe tener acceso a esta información.",
    instructions_button: "Generar",
    instructions_nameWallet: "Establecer nombre de billetera",
    instructions_newWwallet: "Nueva Billetera",
    mnemonic_confirm_button: "Continuar",
    mnemonic_confirm_instructions: "Guardar frase mnemotécnica",
    mnemonic_error: "Las frases mnemotécnicas deben coincidir",
    mnemonic_error_button: "Continuar",
    mnemonic_instructions: "Seleccione el pedido y guarde estas palabras. Si los pierdes nunca podrás recuperar tu billetera",
    name_entry_button: "Guardar billetera",
    name_entry_button_loadingtext: "Enviando",
    name_entry_input_placeholder: "Establecer nombre de billetera",
    name_wallet: "Nombre de la Billetera"
  },
  ExportWallet: {
    folder_button: 'Seleccionar carpeta',
    button_loading: 'Generando',
    button: 'Exportar',
    instructions: 'Por favor recuerde su contraseña. Cifrará su billetera para que solo usted pueda recuperarla.',
    invalid_wallet: 'Invalid Wallet Selected',
    title: 'Exportar billetera'
  },
  LanguagePage: {
    menu_button: 'IDIOMA',
    select_language: "ESPAÑOL",
    title_language: "ELIGE TU IDIOMA"
  },
  LegacyEthSign: {
    approve_button: "Aprobar",
    header: "Solicitud de firma",
    reject_button: "Rechazar",
    title: "Firmar mensaje"
  },
  LegacySendTransaction: {
    amount: "Monto: ",
    approve_button: "Aprobar",
    from: "De: ",
    header: "Firmar transacción",
    reject_button: "Rechazar",
    title: "Enviar transacción",
    to: "Para: "
  },
  LegacySignTransaction: {
    approve_button: "Aprobar",
    header: "Firmar transacción",
    reject_button: "Rechazar",
    title: "Firmar transacción"
  },
  LegacySignTypedData: {
    approve_button: "Aprobar",
    header: "Firmar solicitud de mensaje",
    header_origin: "Origen: ",
    reject_button: "Rechazar",
    title: "Firmar Mensaje"
  },
  Listener: {
    failure_message: "Transacción fallida",
    success_message: "Transacción exitosa"
  },
  Menu: {
    connections_button: 'CONEXIONES',
    network_button: "REDES",
    nft_button: "NFTS",
    password_button: "CONTRASEÑA",
    qr_scan_button: "ESCANER QR",
    requests_button: 'PETICIONES',
    wallet_button: "BILLETERAS"
  },
  NewWallet: {
    about: "Crea una nueva billetera o si ya tienes una recuperala atraves de la frase de seguridad",
    create_button: "Crear Billetera",
    instructions: "Tu Billetera",
    recover_button: "Recuperar Billetera"
  },
  PasswordComponent: {
    error_message: "Contraseña invalida",
    form_label: "Contraseña",
    form_placeholder: "Ingresar Contraseña",
    header: "Contraseña",
    submit_button: "Enviar"
  },
  QRReader: {
    permission_denied: "Sin acceso a la cámara",
    permission_request: "Solicitando permiso de cámara",
    rescan: "Toque para escanear de nuevo"
  },
  QRWallet: {
    instructions: "Compartir para recibir fondos",
    toast_send: "WhatsApp enviado exitosamente!"
  },
  RecoverMnemonic: {
    instructions: 'Porfavor ingrese la secuencia de mnemónicos del proceso de creacion de su wallet original.',
    wallet_name_label: 'Nombre de la billetera',
    mnemonic_label: 'Mnemotécnico'
  },
  RecoverPrivateKey: {
    instructions: 'Please enter the name, password, and private key from the pass in your Google Wallet.',
    wallet_name_label: 'Nombre de la billetera',
    password_label: 'Contraseña',
    private_key_label: 'Llave privada'
  },
  RecoverWallet: {
    instructions: "Porfavor ingrese la secuencia de mnemónicos del proceso de creacion de su wallet original.",
    header: 'Recuperar billetera',
    instructions_button: "Recuperar",
    private_key_button: "Del archivo",
    mnemonic_entry_input_placeholder: "Ingrese frase mnemónica separada por espacios",
    mnemonic_not_complete: "El mnemónicos no tiene la longitud adecuada",
    name_entry_input_placeholder: "Ingrese Nombre de la billetera",
    save_button: "Guardar",
    save_button_loadingtext: "Enviando",
    select_button: "Seleccione Archivo",
  },
  Requests: {
    title: "Peticiones",
    delete_button: 'Borrar',
    expired_text: 'Caducado'
  },
  SelectExtension: {
    ethichub_description: 'Invertir en proyectos de agricultura sostenible',
    title: 'Extensiones',
    ramp_title: 'Rampa',
    ramp_description: 'Compra y vende criptomonedas con fiat',
    swap_title: 'Intercambio',
    swap_description: 'Intercambia tokens ERC20 en cualquier cadena',
    ubeswap_description: 'Intercambiar tokens ERC20 en Celo',
    warpcast_description: 'Portal a la red Farcaster',
  },
  SelectLanguage: {
    en: "Inglés",
    es: "Español",
    nah: "Nahuatl",
    pt: "Portugués",
    qu: "Quechua"
  },
  SelectNetwork: {
    delete_button: 'Delete Network',
    new_button: "Nueva Red",
    select_button: "Seleccione Red",
    select_button_tooltip: "Mas Opciones",
    select_network: "Seleccione o crear una nueva red",
    select_network_default: "Seleccione la red predeterminada",
    title: "Redes"
  },
  SelectWallet: {
    export_button: "Exportar billetera",
    new_button: "Nueva billetera",
    select_button: "Seleccione billetera",
    select_button_tooltip: "Mas opciones",
    title: "Seleccione Billetera"
  },
  SendToken: {
    address_placeholder: "Ingrese direccion del Receptor",
    not_enough_error: "Insufficient Balance",
    submit_button: "Enviar",
    title: "Enviar Token",
    token_placeholder: "Seleccionar Token"
  },
  SendTransaction: {
    amount: "Cantidad: ",
    approve_button: "Aprobar",
    from: "De: ",
    header: "Firmar transacción",
    hide_data: "Hide Data",
    reject_button: "Rechazar",
    title: "Enviar transacción",
    to: "Para: ",
    view_data: "View Data"
  },
  SetPassword: {
    form_confirmation: "Confirmar contraseña",
    form_error_text: "Se requieren al menos 6 caracteres.",
    form_helper_text: "Debe tener como mínimo 6 caracteres.",
    form_new_header: "Contraseña",
    form_old_header: "Contraseña actual",
    form_save_button: "Guardar",
    password_placeholder: "Contraseña",
    title: "Configurar la Contraseña",
    update_button: "Actualiza contraseña",
  },
  SignEth: {
    approve_button: "Aprobar",
    header: "Solicitud de Firma",
    reject_button: "Rechazar",
    title: "Firmar Mensaje"
  },
  SignTransaction: {
    approve_button: "Aprobar",
    header: "Firmar transacción",
    reject_button: "Rechazar",
    title: "Firmar transacción"
  },
  SignTyped: {
    approve_button: "Aprobar",
    header: "Firmar solicitud de mensaje",
    header_origin: "Origen: ",
    reject_button: "Rechazar",
    title: "Firmar Mensaje"
  },
  SupportPage: {
    button_cancel: "Cancelar",
    button_send: "Enviar correo",
    describe_issue: "Describe tu problema",
    introduction: "Si tienes problemas con nuestra aplicacion, por favor contactanos a support@xucre.com o usa el siguiente formulario",
    subject_send: "Asunto",
    title: "Contacto",
    to_send: "De",
    toast_send: "Correo enviado exitosamente!"
  },
  SwapToken: {
    title: "Billetera"
  },
  TokenItem: {
    blacklist_button: 'Mark as Spam',
    delete_button: 'Delete Token',
    menu_accessiblity_label: "Menu más opciones",
    send_token_button: "Enviar"
  },
  TransactionFeed: {
    title: "Transacciones"
  },
  ViewNetwork: {
    active_network: "Red Activa",
    edit_button: "Editar",
    title: "Redes",
    use_network: "Usar Red"
  },
  ViewWallet: {
    clear_button: "Limpiar Transacciones",
    holdings_placeholder: "Insertar existencias de monedas",
    new_button: "Agregar Token",
    no_network_error: 'No Network Selected',
    tab_list: [
      "Valores en cartera",
      "Transacciones"
    ],
    title: "Billetera",
    transactions_placeholder: "Insertar historial de transacciones"
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
    button: "Enviar notificación de WhatsApp",
    Send_Button: "Enviar Whatsapp",
    notificationNumber: "Por favor ingrese el código del país incluyendo el signo +"
  },
  ui: {
    open: "Abierto",
    close: "Cerrar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    featured: 'Presentado',
    all: 'Todo',
  },
  totalBalance:{
    title: "Balance total"
  },
  termsConditions: {
    terms:"Política de privacidad de XucreWallet y Xucre.net Fecha de vigencia: 1 de julio de 2023 Gracias por usar XucreWallet, una billetera descentralizada desarrollada por Xucre Inc. Esta política de privacidad describe cómo recopilamos, usamos, divulgamos y protegemos la información personal cuando usa nuestra aplicación. Lea esta política detenidamente para comprender nuestras prácticas con respecto a sus datos personales. 1. Información que recopilamos 1.1. Información personal: podemos recopilar cierta información personal de usted, como su nombre, dirección de correo electrónico, número de teléfono y cualquier otra información que nos proporcione cuando crea una cuenta o realiza transacciones dentro de la aplicación XucreWallet. 1.2. Información de la billetera: cuando usa XucreWallet, podemos recopilar y almacenar información relacionada con sus transacciones de criptomonedas, incluido el historial de transacciones, las direcciones de la billetera y los montos de las transacciones. 2. Uso de la Información 2.1. Xucre Inc. no tiene la capacidad de acceder, modificar, controlar o revertir ninguna transacción o cambio realizado dentro de la aplicación XucreWallet. No podemos recuperar credenciales de billetera perdidas u olvidadas, incluidas frases mnemotécnicas o claves privadas. Es su exclusiva responsabilidad mantener el almacenamiento seguro y la copia de seguridad de las credenciales de su billetera. 2.2. Usaremos la información personal que proporcione únicamente con el fin de proporcionar y mejorar los servicios de XucreWallet. Esto incluye: facilitar transacciones, brindar atención al cliente, prevenir actividades fraudulentas o no autorizadas y cumplir con las obligaciones legales. 3. Divulgación de información 3.1. Podemos compartir su información personal con proveedores de servicios externos seleccionados, únicamente en la medida necesaria para proporcionar los servicios asociados con XucreWallet. Estos proveedores de servicios externos están obligados a mantener la confidencialidad y seguridad de su información personal de acuerdo con las leyes aplicables. 3.2. Podemos divulgar su información personal si así lo exige la ley o en respuesta a un proceso legal válido, como una orden judicial o una solicitud del gobierno. 4. Seguridad de datos 4.1. Xucre Inc. toma medidas razonables para asegurar su información personal y protegerla del acceso, alteración o divulgación no autorizados. Sin embargo, tenga en cuenta que ninguna medida de seguridad puede garantizar una protección completa y no podemos garantizar que su información personal permanezca siempre segura. 5. Transferencias de datos transfronterizas 5.1. Xucre Inc. opera en múltiples jurisdicciones, incluidas las Islas Vírgenes Británicas, los Estados Unidos (Delaware) y Ecuador (Quito). Al usar XucreWallet, acepta la transferencia de su información personal a estas jurisdicciones, que pueden tener leyes de protección de datos diferentes a las de su país. 6. Sitios web y servicios de terceros 6.1. La aplicación XucreWallet puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por Xucre Inc. Esta política de privacidad se aplica solo a nuestra aplicación, y no somos responsables de las prácticas de privacidad de ningún sitio web o servicio de terceros. 7. Cambios a esta Política de Privacidad 7.1. Xucre Inc. puede actualizar esta política de privacidad de vez en cuando. Le notificaremos cualquier cambio material mediante la publicación de la política actualizada dentro de la aplicación XucreWallet o a través de otros medios apropiados. Le animamos a que revise esta política periódicamente para cualquier actualización. 8. Contáctenos 8.1. Si tiene alguna pregunta o inquietud sobre esta política de privacidad o nuestras prácticas de datos, contáctenos en info@xucre.net. Al usar XucreWallet, acepta los términos y condiciones descritos en esta política de privacidad. Si no está de acuerdo con esta política, no utilice nuestra aplicación. Condiciones de servicio del sitio web Xucre.net Fecha de vigencia: 1 de julio de 2023 Estos términos de servicio ( Términos ) rigen su uso del sitio web de XucreWallet, incluidas las aplicaciones de software asociadas (colectivamente, el  Servicio ), proporcionadas por Xucre Inc. ( Xucre ,  nosotros ,  nos  o  nuestro ). Al utilizar el Servicio, usted acepta estar sujeto a estos Términos. Si no está de acuerdo con estos Términos, no utilice el Servicio. 1. Elegibilidad 1.1. Debe tener al menos 18 años para utilizar el Servicio. Al usar el Servicio, usted declara y garantiza que tiene al menos 18 años y que tiene la capacidad legal para celebrar estos Términos. Si está utilizando el Servicio en nombre de una entidad, declara y garantiza que tiene autoridad para vincular a esa entidad con estos Términos. 2. Cuentas de usuario 2.1. Para usar ciertas funciones del Servicio, es posible que deba crear una cuenta de usuario. Usted es responsable de brindar información precisa y completa durante el proceso de registro de la cuenta y de mantener la confidencialidad de las credenciales de su cuenta. 2.2. Usted es el único responsable de todas las actividades que ocurran bajo su cuenta de usuario. Xucre Inc. no es responsable de ningún acceso o uso no autorizado de su cuenta. Si sospecha algún acceso no autorizado, debe notificarnos de inmediato. 3. Uso del Servicio 3.1. XucreWallet es una billetera descentralizada que le permite administrar su criptomoneda. Al usar el Servicio, comprende y reconoce que Xucre Inc. no tiene la capacidad de acceder, modificar, controlar o revertir ninguna transacción o cambio realizado dentro de la aplicación XucreWallet, incluida la pérdida o recuperación de credenciales de billetera, como frases mnemotécnicas. o claves privadas. 3.2. Usted acepta utilizar el Servicio solo para fines lícitos y de conformidad con todas las leyes y reglamentos aplicables. Usted es responsable de asegurarse de que su uso del Servicio no viole ningún derecho de terceros. 4. Derechos de propiedad intelectual 4.1. El Servicio, incluido cualquier software, contenido y materiales disponibles a través del Servicio, son propiedad de Xucre Inc. y están protegidos por las leyes de propiedad intelectual. No puede copiar, modificar, distribuir, vender o arrendar ninguna parte del Servicio sin nuestro consentimiento previo por escrito. 5. Privacidad 5.1. Recopilamos, usamos y divulgamos información personal de acuerdo con nuestra Política de privacidad. Al usar el Servicio, usted acepta nuestra recopilación, uso y divulgación de información personal como se describe en la Política de privacidad. 6. Exenciones de responsabilidad y limitaciones de responsabilidad 6.1. El Servicio se proporciona  tal cual  y  según disponibilidad , sin garantías ni representaciones, ya sean expresas o implícitas. No garantizamos la precisión, integridad o puntualidad del Servicio. 6.2. Xucre Inc. no será responsable de ningún daño directo, indirecto, incidental, especial, consecuente o ejemplar, incluida la pérdida de ganancias, que resulte de su uso del Servicio. 7. Indemnización 7.1. Usted acepta indemnizar, defender y eximir a Xucre Inc., sus directores, funcionarios, empleados y agentes de cualquier reclamo, responsabilidad, daño, costo y gasto (incluidos los honorarios razonables de los abogados) que surjan de o en relación con con su uso del Servicio, su incumplimiento de estos Términos o su violación de cualquier ley o derechos de terceros. 8. Enmiendas y Terminación 8.1. Nos reservamos el derecho de modificar o actualizar estos Términos en cualquier momento. Cualquier cambio entrará en vigencia inmediatamente después de la publicación de los Términos revisados en el sitio web de XucreWallet o dentro de la aplicación. Su uso continuado del Servicio después de la publicación de cualquier cambio constituye su aceptación de dichos cambios. Si no está de acuerdo con los Términos modificados, debe dejar de usar el Servicio. 8.2. Podemos rescindir o suspender su acceso al Servicio, con o sin motivo, en cualquier momento y sin previo aviso. 9. Ley aplicable y resolución de disputas 9.1. Estos Términos se regirán e interpretarán de acuerdo con las leyes de las Islas Vírgenes Británicas, sin tener en cuenta sus principios de conflicto de leyes. 9.2. Cualquier disputa que surja de o en relación con estos Términos se resolverá mediante negociaciones de buena fe. Si la disputa no puede resolverse amistosamente, se remitirá y se resolverá finalmente mediante arbitraje de acuerdo con las reglas del Centro de Arbitraje Internacional de las Islas Vírgenes Británicas. 10. Divisibilidad 10.1. Si alguna disposición de estos Términos se considera inválida, ilegal o inaplicable, la validez, legalidad o aplicabilidad de las disposiciones restantes no se verán afectadas ni perjudicadas de ninguna manera. 11. Acuerdo completo 11.1. Estos Términos constituyen el acuerdo completo entre usted y Xucre Inc. con respecto a su uso del Servicio y reemplazan cualquier acuerdo, entendimiento o acuerdo anterior o contemporáneo. Si tiene alguna pregunta o inquietud sobre estos Términos, contáctenos en info@xucre.net Al usar XucreWallet, usted acepta cumplir con estos Términos. Condiciones de servicio para Xucre Wallet Android/iOS Fecha de vigencia: 1 de julio de 2023 Estos Términos de servicio ( Términos ) constituyen un acuerdo legalmente vinculante entre usted ( Usuario  o  usted ) y Xucre Wallet ( Xucre ,  nosotros  o  nosotros ) con respecto a su uso de Xucre Wallet, una billetera digital web3 disponible en Ecuador, Perú y México. Al acceder, registrarse o utilizar Xucre Wallet, usted acepta estar sujeto a estos Términos. Lea atentamente estos Términos antes de utilizar la Cartera Xucre. 1. Definiciones 1.1 Xucre Wallet: Se refiere a la aplicación de billetera digital proporcionada por Xucre que permite a los Usuarios administrar y almacenar activos digitales, incluidas criptomonedas y tokens no fungibles (NFT). 1.2 Activos digitales: se refiere a criptomonedas, tokens y otras representaciones digitales de valor que son compatibles con Xucre Wallet. 1.3 NFT: se refiere a tokens no fungibles, activos digitales únicos que se almacenan y administran dentro de Xucre Wallet. 2. Actividades Prohibidas 2.1 Actividades ilegales: Usted acepta no utilizar Xucre Wallet para ninguna actividad ilegal, incluidos, entre otros, lavado de dinero, financiamiento del terrorismo, fraude o cualquier otra actividad que viole las leyes o regulaciones aplicables. 2.2 Cumplimiento de las leyes: Deberá cumplir con todas las leyes, reglamentos y pautas aplicables relacionadas con el uso de Xucre Wallet, incluidas las relacionadas con criptomonedas, transacciones financieras y privacidad de datos. 3. Clasificación de Criptos 3.1 Clasificación de activos: Xucre Wallet considera las criptomonedas como activos digitales de acuerdo con las interpretaciones legales vigentes. Por lo tanto, cualquier referencia a criptomonedas dentro de estos Términos se considerará como referencia a activos digitales. 4. Compra, Venta e Intercambio de Tokens 4.1 Servicios de intercambio: Xucre Wallet puede brindarle la capacidad de comprar, vender e intercambiar activos digitales a través de intercambios de terceros aprobados. Usted reconoce y acepta que cualquier transacción facilitada por Xucre Wallet que involucre activos digitales está sujeta a los términos y condiciones de estos intercambios de terceros. 4.2 Riesgo y responsabilidad: Xucre Wallet no garantiza la disponibilidad, precisión o puntualidad de los servicios de intercambio. Usted comprende y acepta que la compra, venta e intercambio de activos digitales implican riesgos inherentes y que usted es el único responsable de evaluar y asumir dichos riesgos. 5. NFT dentro de Xucre Wallet 5.1 Almacenamiento y administración de NFT: Xucre Wallet permite a los Usuarios almacenar y administrar NFT dentro de la billetera. Sin embargo, Xucre Wallet no respalda ni controla la creación, emisión o intercambio de NFT y no será responsable de ninguna transacción o disputa relacionada con NFT. 5.2 Mercado NFT: Xucre Wallet puede proporcionar acceso a mercados NFT dentro de la billetera. El uso de dichos mercados está sujeto a sus respectivos términos y condiciones, y Xucre Wallet no será responsable de la disponibilidad, legalidad o calidad de los NFT enumerados en estos mercados. 6. Soporte multilingüe 6.1 Opciones de idioma: Xucre Wallet está disponible en los idiomas español, portugués, inglés, quechua y náhuatl. Puede elegir el idioma preferido para su uso de la Monedero Xucre. 6.2 Discrepancias en la traducción: En caso de discrepancias entre las versiones en diferentes idiomas de estos Términos, prevalecerá la versión en español. 7. Propiedad Intelectual 7.1 Xucre Wallet: Xucre Wallet y sus logotipos asociados, marcas comerciales, derechos de autor y otros derechos de propiedad intelectual son propiedad de Xucre o sus licenciantes. No debe usar, modificar, reproducir, distribuir o crear trabajos derivados basados en Xucre Wallet o su contenido, a menos que Xucre lo autorice expresamente. 8. Terminación 8.1 Terminación por parte de Xucre Wallet: Xucre Wallet se reserva el derecho de suspender o cancelar su acceso a Xucre Wallet en cualquier momento, con o sin causa, sin previo aviso. 8.2 Efecto de la rescisión: al momento de la rescisión, usted acepta dejar de usar Xucre Wallet y reconoce que Xucre Wallet no será responsable ante usted ni ante terceros por los daños, pérdidas o responsabilidades que resulten de la rescisión. 9. Disposiciones generales 9.1 Acuerdo completo: estos Términos constituyen el acuerdo completo entre usted y Xucre Wallet con respecto a su uso de Xucre Wallet y reemplazan cualquier acuerdo, comunicación o entendimiento anterior. 9.2 Modificación: Xucre Wallet se reserva el derecho de modificar o actualizar estos Términos en cualquier momento a su entera discreción. Cualquier cambio será efectivo al publicar los Términos modificados en el sitio web de Xucre Wallet o dentro de la aplicación. 9.3 Ley aplicable y jurisdicción: Estos Términos se regirán e interpretarán de conformidad con las leyes de Ecuador. Cualquier disputa que surja de o en conexión con estos Términos será resuelta exclusivamente por los tribunales de Ecuador. 9.4 Divisibilidad: si alguna disposición de estos Términos se considera inválida o inaplicable, dicha disposición se interpretará en la mayor medida permitida por la ley aplicable, y las disposiciones restantes continuarán en pleno vigor y efecto. Al descargar, instalar y usar Xucre Wallet, usted reconoce que ha leído, entendido y aceptado estos Términos de servicio. ",
    button_Accept: "Aceptar",
    title: "Términos y condiciones",
    accept_terms: "Acepto los términos y condiciones"
  }
};

export default values;