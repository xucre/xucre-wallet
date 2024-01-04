import { TranslationType } from ".";
/* eslint-disable sort-keys */
const values : TranslationType = {
  AddToken: {
    address_placeholder: 'Token direccionta qillqay',
    chain_placeholder: 'Kadena akllay', 
    name_placeholder: 'Token sutita qillqay', 
    submit_button: 'Tokenta waqaychay', 
    title: 'Belletera'
  }, 
  App: {
    select_network_title: 'Llikakuna',
    select_wallet_title: 'Belleterakuna', 
    send_transaction_title: 'Rantinakuyta kachay', 
    set_password_title: 'ContraseÃ±a churay', 
    sign_message_title: 'Willakuy firma', 
    sign_transaction_title: 'Rantinakuy firma', 
    token_title: 'Belletera', 
    view_network_title: "Llika",  
    view_wallet_title: "Belletera"
  }, 
  Buttons_Footer: { 
    buttonswap: "SWAP", 
    history: "Willakuy", 
    home: "Wasi", 
    profile: "Perfil", 
    support: "Yanapakuy"  
  },  
  Buttons_Header: { 
      buy: "Rantiy", 
      connect: "Conectar",
      nft: "NFT", 
      receive: "Chaskiy", 
      send: "Kachay"  
    },
  ConnectionRequest: {
    approve_button: 'Aprobay',
    next_button: 'Qhipaman',
    reject_button: 'Qhipachay',
    rejected: 'ruraqpa mana chaskisqan',
    title: "T/'inkinakuy maÃ±akuy",
    wallet_select_instructions: 'Belletera(s) akllay'
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
    button_save: 'Waqaychay',
    chainId_placeholder: 'Kadena ID nisqaman yaykuy', 
    explorer_placeholder: 'Block Explorer URL nisqapi qillqay (munasqa)',
    name_placeholder: 'Sutita qillqay', 
    rpcUrl_placeholder: 'RPC URL nisqapi qillqay',
    submit_button: 'Waqaychay', 
    symbol_placeholder: 'Kadena siqiman yaykuy',
    title: "New Network"
  },
  CreateWallet: {
    instructions : 'Musuq billetera ruwachkaspa huk secuencia mnemÃ³nicas chaskinki mayqinkunachus "kikin contraseÃ±aykita" riqsichinku. Pipas kay qatiqniyuqqa mayqin musuq dispositivopipas billeteraykita wakmanta ruwayta atinman. Atikusqanman hina allinta waqaychay. Kay willakuymanqa qamllam haykunayki.',
    instructions_button: 'Qhipaman',
    instructions_nameWallet: 'Billeteraykipa sutinta churay',
    instructions_newWwallet: 'Musuq Billetera',
    mnemonic_confirm_button: 'Qhipaman', 
    mnemonic_confirm_instructions: 'Mnemonico nisqa rimayta waqaychay', 
    mnemonic_error: 'Mnemonico rimaykuna tupanan tiyan',
    mnemonic_error_button: 'Qhipaman', 
    mnemonic_instructions: 'mnemonic_instructions: "Ama hina kaspa, kamachiyta akllay hinaspa kay simikunata waqaychay. Sichus chinkachinki chayqa manan hayk\'aqpas billeteraykita kutichiyta atiwaqchu"',
    name_entry_button: 'Qillqata waqaychay', 
    name_entry_button_loadingtext: 'Kachay', 
    name_entry_input_placeholder: 'Belletera sutita churay', 
    name_wallet: 'Belletera suti',    
  },
  LanguagePage: { 
      menu_button: "AKLLAY", 
      select_language: "QUECHUA",
      title_language: "SIMIYKITA AKLLAY"
  },
  LegacyEthSign: {
    approve_button: 'Aprobay',
    header: 'Firma maÃ±akuy',
    reject_button: 'Qhipachay',
    title: 'Willakuy firma'
  },
  LegacySendTransaction: {
    amount: 'Qullqi: ',
    approve_button: 'Aprobay',
    from :'Kaymanta: ',
    header: 'TransacciÃ³n firma',
    reject_button: 'Qhipachay',
    title: 'TransacciÃ³n  kachay',
    to: 'Kay: '
  },
  LegacySignTransaction: {
    approve_button: 'Aprobay',
    header: 'TransacciÃ³n firma',
    reject_button: 'Qhipachay',
    title: 'TransacciÃ³n firma'
  },
  LegacySignTypedData: {
    approve_button: 'Aprobay',
    header: 'Willakuy maÃ±akuy firmay',
    header_origin: 'Qallariy: ',
    reject_button: 'Qhipachay',
    title: 'Willakuy firma'
  },
  Listener: {
    failure_message: 'TransacciÃ³n mana atisqachu',
    success_message: 'TransacciÃ³n Allinmi'
  },
  Menu: {
    connections_button: 'CONNECTIONS',
    currency_button: 'CURRENCY',
    network_button: 'LLIKAKUNA',
    nft_button: 'NFTS', 
    password_button: 'KICHANA',
    qr_scan_button: 'QR ESCANA',
    requests_button: 'REQUESTS',
    wallet_button: 'BALLEERAS'
  },
  NewWallet: { 
    about: "Huk musuq billetera ruway utaq sichus alreade hukniyuq kanki chayta kutichiy harkay rimayniykiwan",
    create_button: 'Belleterata ruway', 
    instructions: "Billeterayki",
    recover_button: 'Qillqata kutichiy', 
  }, 
  PasswordComponent: {
    error_message: 'Mana allin yaykuna rimay',
    form_label: 'ContraseÃ±a',
    form_placeholder: 'Yaykuy yaykuna rimay',
    header: 'ContraseÃ±a',
    submit_button: 'Kachay'
  },
  QRReader: {
    permission_denied: 'Mana kamaraman yaykuychu',
    permission_request: 'Kamaramanta permisota maÃ±akuy',
    rescan: 'Hukmanta escanear Ã±it\'iy'
  },
    QRWallet: {
    instructions: 'Qullqita chaskinapaq rakinakuy',
    toast_send: "WhatsApp allinta apachisqa!"
  },
  RecoverWallet: { 
    instructions: 'Ama hina kaspa, Ã±awpaq billetera ruwayniykimanta mnemÃ³nicos nisqap qatiqninta qillqay.',
    instructions_button: 'Kutichiy', 
    mnemonic_entry_input_placeholder: 'Huk ch\'usaqkunawan t\'aqasqa mnemonico rimayta qillqay',      
    mnemonic_not_complete: 'Mnemonico mana tupaq largo',
    name_entry_input_placeholder: 'Belletera sutita churay',
    save_button: 'Waqaychay', 
    save_button_loadingtext: 'Kachasqa'
  }, 
  Requests: {
    delete_button: 'Chinkachiy',
    expired_text: 'Tukusqa'
  },
  SelectLanguage : {
    en: 'InglÃ©s',
    es: 'Kastilla',
    nah: 'Nahualt',
    pt: 'PortuguÃ©s',
    qu: 'Runasimi'
  },
  SelectNetwork: {
    delete_button: 'Delete Network',
    new_button: 'Musuq Llika', 
    select_button: 'Llika akllay', 
    select_button_tooltip: 'Aswan akllanakuna',
    select_network: 'Akllay icha musuq llikata ruray',
    select_network_default: "Ñawpaqmanta ruwasqa llika akllay",
    title: 'Llikakuna'
  },
  SelectWallet: {
    new_button: 'Musuq Billetera', 
    select_button: 'Akllay Wallet', 
    select_button_tooltip: 'Aswan akllanakuna',
    title: 'Akllay Wallet'
  }, 
  SendToken: { 
    address_placeholder: 'Chaskiqpa direccionninta qillqay', 
    not_enough_error: "Insufficient Balance",
    submit_button: 'Kachay', 
    title: 'Kachay Token', 
    token_placeholder: 'Token akllay', 
  }, 
  SendTransaction: {
    amount: 'Qullqi: ',
    approve_button: 'Aprobay',
    from :'Kaymanta: ',
    header: 'TransacciÃ³n firma',
    hide_data: "Hide Data",
    reject_button: 'Quipachay',
    title: 'TransacciÃ³n kachay',
    to: 'Kay: ',
    view_data: "View Data"
  },
  SetPassword: {
    form_confirmation: 'ContraseÃ±ata takyachiy',
    form_error_text: '6 qillqakunallapas necesitakun.',
    form_helper_text: '6 qillqayuqlla kanan tiyan.',
    form_new_header: 'ContraseÃ±a',
    form_old_header: 'Kunan Yaykuna rimay',
    form_save_button: 'Waqaychay',
    password_placeholder: 'yaykuna rimay',
    title: 'ContraseÃ±a churay'
  },
  SignEth: {
    approve_button: 'Aprobay',
    header: 'Firma maÃ±akuy',
    reject_button: 'Qhipachay',
    title: 'Willakuy firma'
  },
  SignTransaction: {
    approve_button: 'Aprobay',
    header: 'TransacciÃ³n firma',
    reject_button: 'Qhipachay',
    title: 'TransacciÃ³n firma'
  },
  SignTyped: {
    approve_button: 'Aprobay',
    header: 'Willakuy maÃ±akuy firmay',
    header_origin: 'Qallariy: ',
    reject_button: 'Qhipachay',
    title: 'Willakuy firma'
  },  
  SupportPage: {  
    button_cancel: "Chantaq",
      button_send: "E-mailta apachiy",  
      describe_issue: "Sasachakuyniykimanta willay",  
      introduction: "Sichus appniykuwan sasachakuyniyuq kanki chayqa kaypi rimanakuy support@xucre.com utaq uraypi formulariota llamk'achiy",
      subject_send: "Rimana",  
      title: "Yanapakuy", 
      to_send: "Kaymanta",  
      toast_send: "Â¡E-correo electrÃ³nico allinta apachisqa!"  
    },  
  SwapToken: {
    title: 'Chuspa'
  },
  TokenItem: {
    delete_button: 'Delete Token',
    menu_accessiblity_label: "Aswan akllanakuna menÃº",
    send_token_button: 'Kachay'
  },
  TransactionFeed: {
    title: "Transacciones"
  },
  ViewNetwork: {
    active_network: 'Llika llamk\'achiq',
    edit_button: 'Apuy',    
    title: 'Llika',
    use_network: 'Llika llamk\'achiyta'
  },
  ViewWallet: { 
    clear_button: 'Rantinakuykunata ch\'uyanchana', 
    holdings_placeholder: 'Qolqe hap\'inakunata churay',
    new_button: 'Token yapay', 
    no_network_error: 'No Network Selected',
    tab_list: [
              'Holdings nisqa', 
              'Transacciones nisqakuna'
    ],
    title: 'Belletera',
    transactions_placeholder: 'Ruranamanta willayta churay',
  },
  WalletConnect : {
    session_proposal: ['Session Proposal', 'A dapp wants to connect your wallet'],
    session_request_sign_tx: ['Sign Transaction', 'Please approve or reject request'],
    session_request_send_tx: ['Send Transaction', 'Please approve or reject request'],
  },
  WalletHistory: {  
    title: "Willarina",
    total_balance: 'Total Balance'
  },
  WhatsAppNotification:{
    button: "Kachay WhatsApp Willana",
    Send_Button: "Kachay Whatsapp",
    notificationNumber: "Ama hina kaspa, mama llaqtap chikuta + qillqawan qillqay"
  },
  totalBalance:{
    title: "Allin pachapi"
  },
  termsConditions: {
    terms:"XucreWallet kaqpaq chaymanta Xucre.net kaqpaq sapalla willay kamachiy Punchaw kamachiy: 1 ñiqin inti raymi killapi 2023 watapi Gracias XucreWallet llamk'achisqaykimanta, huk descentralizado billetera Xucre Inc. kaqwan ruwasqa Kay sapalla willay kamachiy imayna sapalla willayta huñusqayku, llamk'achiyku, willayku chaymanta waqaychayku mayk'aq ruwanaykuta llamk'achkanki. Ama hina kaspa, kay kamachiyta allinta ñawiriy ruwasqaykumanta sapalla willayniykimanta hamut'anaykipaq. 1. Huñusqanchik Willakuykuna 1.1. Sapanchasqa Willay: Wakin sapalla willayta qammanta huñuykuman, kayhina sutiyki, correo electrónico direccionniyki, telefono yupayniyki chaymanta ima wak willayta quwasqaykiku mayk'aq huk yupayta ruwanki utaq ruwanakuna ruwanki XucreWallet ruwana ukhupi. 1.2. Wallet Willakuy: XucreWallet llamk'achkanki, willayta huñuykuman chaymanta waqaychayta atiykuman criptomoneda ruwasqaykiwan tupaq, chaymanta ruwaypa historian, billetera direccionkuna chaymanta ruwana qullqikuna. 2. Willakuykunata apaykachana 2.1. Xucre Inc. mana atiyniyuqchu yaykuyta, tikrayta, kamachiyta utaq kutichiyta ima ruwanakuna utaq tikray ruwasqa XucreWallet ruwana ukhupi. Mana chinkasqa utaq qunqasqa billetera credencialkunata kutichiyta atiykuchu, chaymanta mnemónica frases utaq sapalla llavekuna. Sapallan ruwasqayki kanki waqaychasqa waqaychayta chaymanta waqaychasqa waqaychayta billetera credencialesniykimanta. 2.2. Sapanchasqa willayta qusqayki sapalla XucreWallet yanapakuykunata qunaykupaq chaymanta allinchaypaq llamk'achisaqku. Kayqa: ruwanakunata yanapay, yanapakuy rantiqman quy, pantasqa utaq mana kamachisqa ruwaykunata harkay, chaymanta kamachiy kamachiykunata hunt'ay. 3. Willakuykunata willay 3.1. Sapanchasqa willakuyniyki akllasqa kimsa kaq yanapakuy quqkunawan qunakuykuman, sapalla mayk'akamachus XucreWallet kaqwan tinkisqa yanapakuykunata qunaykupaq. Kay kimsa kaq yanapakuy quqkuna kamachisqa kanku pakasqa chaymanta waqaychasqa sapalla willayniykimanta kamachiykunamanhina. 3.2. Sapanchasqa willakuyniykimanta willayta atiykuman sichus kamachiy kamachin utaq allin kamachiy ruwayman kutichispa, ahinataq tribunal kamachiyman utaq gobierno mañakuyman. 4. Willakuypa Waqaychasqan 4.1. Xucre Inc. allin ruwaykunata ruwan sapalla willakuyniyki waqaychaypaq chaymanta mana kamachisqa yaykuymanta, tikraymanta utaq willakuymanta harkananpaq. Ichaqa, ama hina kaspa, yachay mana ima harkakuypas hunt'asqa hark'ayta garantizayta atinchu, manataqmi garantizayta atiykuchu sapalla willakuyniyki sapa kuti waqaychasqa kananpaq. 5. Fronteras chimpapi Willakuykunata apachiy 5.1. Xucre Inc. achka jurisdiccionkunapi llamkan, chaymanta Islas Vírgenes Británicas, Estados Unidos (Delaware), Ecuador (Quito). XucreWallet llamk'achispa, sapalla willayniyki kay jurisdiccionkunaman t'inkisqa kananpaq ari ñinki, mayqinkunachus wakhina willaykunata amachay kamachiykunayuq kankuman suyuykimanta. 6. Kimsa kaq Web kitikuna chaymanta Serviciokuna 6.1. XucreWallet ruwana kimsa kaq web kitikunaman utaq yanapakuykunaman t'inkikunayuq kanman mayqinkunachus mana Xucre Inc. kaqpa kaqnin utaq kamachisqachu Kay pakasqa kamachiy ruwanaykupaqlla ruwakun, chaymanta mana sapalla willay ruwaykunamanta mayqin kimsa kaq web kitikuna utaq yanapakuykunamanta ruwasqachu kayku. 7. Kay Sapanchasqa Willayta tikray 7.1. Xucre Inc. kay sapalla willay kamachiyta sapa kuti musuqyachinman. Willasqaykiku ima material tikraykunamantapas musuqchasqa kamachiyta XucreWallet ruwana ukhupi utaq wak allin ruwaykunawan churaspa. Kallpanchaykiku kay kamachiyta sapa kuti qhawayta ima musuqyachiykunapaqpas. 8. Ñoqaykuwan rimanakuy 8.1. Sichus ima tapuyniykipas utaq llakikuyniykipas kay pakasqa kamachiymanta utaq willay ruwasqaykumanta, ama hina kaspa info@xucre.net kaqpi rimanakuy. XucreWallet llamk'achispa, kay sapalla willay kamachiypi kamachiykunata chaymanta kamachiykunata ari ñinki. Sichus mana kay kamachiywan acuerdopichu kanki, ama hina kaspa ama aplicacionniykuta llamk'achiychu. Xucre.net Web kitipaq Yanapakuymanta kamachiykuna Punchaw kamachiy: 1 ñiqin inti raymi killapi 2023 watapi Kay yanapakuymanta kamachiykuna ( Términos ) XucreWallet web kitita llamk'achisqaykita kamachin, mayqin tinkisqa software ruwanakunatapas (huñusqa,  Servicio ), Xucre Inc. ( Xucre ,  ñuqayku ,  ñuqayku , utaq  ñuqanchik ). Yanapakuyta llamk'achispa, kay Términos kaqwan watasqa kayta ari ñinki. Sichus mana kay Términos kaqwan acuerdopichu kanki, ama hina kaspa ama Serviciota llamk'achiychu. 1. Allin kaynin 1.1. Serviciota llamk'achinaykipaqqa 18 watayuqllaraq kanayki tiyan. Yanapakuyta llamk'achispa, representanki chaymanta garantizanki 18 watayuqllapas kasqaykita chaymanta kay Términos kaqman yaykunapaq kamachiy atiyniyuq kasqaykita. Sichus huk entidadpa sutinpi Yanapakuyta llamk'achkanki, representanki chaymanta garantizanki chay entidadta kay Términos kaqman wataypaq atiyniyuq kasqaykita. 2. Usuariokunaq Cuentakuna 2.1. Yanapakuypa wakin ruwanakunata llamk'achinapaq, huk ruwaq yupayta ruwanayki tiyan. Qam responsable kanki chiqa chaymanta hunt'asqa willayta quypaq yupay registro ruwaypi chaymanta yupayniyki credenciales pakasqa waqaychaypaq. 2.2. Qam sapallayki responsable kanki llapa ruwaykunamanta mayqinkunachus ruwaq yupayniykipi ruwakunku. Xucre Inc. mana responsablechu kanku ima mana kamachisqa yaykuymanta utaq yupayniyki llamk'achiyta. Sichus ima mana kamachisqa yaykuytapas sospechanki chayqa, chaylla willawanayki tiyan. 3. Serviciota servichikuy 3.1. XucreWallet huk descentralizado billetera kaqmi, chaymi criptomonedayki kamachiyta atikun. Yanapakuywan llamk'achispa, entiendenki chaymanta riqsikunki Xucre Inc. mana atiyniyuqchu yaykuyta, tikrayta, kamachiyta utaq kutichiyta ima ruwanakuna utaq tikray ruwasqa XucreWallet ruwana ukhupi, chaymanta chinkachiy utaq kutichiy billetera credenciales kaqmanta, kayhina frases mnemónicas kaqmanta otaq llaves privadas nisqakuna. 3.2. Ari ñinki Serviciota kamachiypaq propósitokunallapaq chaymanta llapa kamachiykunata chaymanta kamachiykunata hunt'aspa llamk'achiyta. Qam responsable kanki kay Serviciota llamk'achisqayki mana ima kimsa kaq derechokunata sarunchasqanmanta. 4. Propiedad Intelectual nisqa hayñikuna 4.1. Yanapakuy, mayqin software, contenido chaymanta materialkuna Yanapakuyniqta ruwasqa, Xucre Inc. kaqpa kaqnin chaymanta propiedad intelectual kamachiykunawan waqaychasqa. Mana atikunkichu copiayta, tikrayta, rakiyta, rantiyta utaq arrendayta mayqin parte Yanapakuymanta mana ñawpaq qillqasqa consentimientoykuwan. 5. Sapanchasqa kay 5.1. Sapanchasqa willayta huñuyku, llamk'achiyku chaymanta willayku Sapanchasqa Willayniykumanhina. Yanapakuyta llamk'achispa, sapalla willayniyku huñusqayku, llamk'achiyku chaymanta willakuyniykuman ari ñinki imaynachus Sapanchasqa Willayniykupi willasqa. 6. Descargos y Limitaciones de Responsabilidad nisqa 6.1. Yanapakuyqa  imayna kasqanmanhina  chaymanta  kasqa  kaqpi qusqa, mana ima garantiayuq utaq representacionniyuq, expresa utaq implícita kaqpipas. Mana garantizaykuchu Yanapakuypa chiqan kayninta, hunt'asqa kayninta utaq pachanpi kayninta. 6.2. Xucre Inc. mana ima directo, indirecto, incidental, especial, consecuente utaq ejemplo daños kaqmanta, chaymanta chinkachisqa gananciakunamanta, Serviciota llamk'achisqaykimanta ruwasqachu kanqa. 7. Indemnización nisqa 7.1. Ari ñinki indemnizacionta, defiendeyta chaymanta Xucre Inc., directorninkunata, oficialninkunata, llamkaqkunata chaymanta agentenkunata mana ima mana allintapas ruwanaykipaq mayqin chaymanta tukuy reclamaciones, pasivos, daños, costos chaymanta gastos (kayhina razonable abogadokunap qullqinkuna) paqarisqa utaq tinkisqa Yanapakuy llamk'achisqaykiwan, kay Términos p'akisqaykiwan utaq mayqin kamachiy utaq kimsa kaq derechokuna pantasqaykiwan. 8. Allinchay hinaspa Tukuchiy 8.1. Kay Términos kaqta mayk'aqllapas tikraypaq utaq musuqyachiypaq derechoykuta waqaychayku. Ima tikraypas chaylla efectivo kanqa chaymanta musuqchasqa Términos XucreWallet web kitipi utaq ruwana ukhupi churasqa. Ima tikraykunatapas churasqaykimanta qhipaman Yanapakuyta llamk'achiyniykiqa, chay tikraykunata chaskisqaykita ruwan. Sichus mana hukchasqa Términos kaqwan ari ñinkichu, Yanapakuy llamk'achiyta saqinayki tiyan. 8.2. Yanapakuyman yaykuyniyki tukuchiyta utaq sayachiyta atiykuman, imaraykupas utaq mana imaraykupas, mayk'aqllapas chaymanta mana ñawpaq willayniyuq. 9. Kamachiy Kamachiy hinaspa Ch’aqway allichay 9.1. Kay Términos kamachisqa chaymanta t'ikrakunqa Islas Vírgenes Británicas kamachiykunamanhina, mana kamachiykunawan ch'aqway kamachiykunata qhawaspa. 9.2. Ima ch'aqwaypas kay Términos kaqmanta utaq chaywan tinkisqa kaqpas allin sunquwan rimanakuywan allichasqa kanqa. Sichus mana allintachu ch’aqwayta allichayta atikunman chayqa, chay ch’aqwayqa arbitraje nisqawanmi qhawarisqa kanqa, qhepamantaq allichasqa kanqa Centro Internacional de Arbitraje de Islas Vírgenes Británicas nisqa kamachikuykunaman hina. 10. T’aqay atiy 10.1.1. Sichus mayqin kamachiypas kay Términos kaqmanta mana valido, mana kamachiyniyuq utaq mana hunt'achiy atikuq hina qhawasqa, validez, legalidad utaq hunt'achiy atiy puchuq kamachiykunamanta mana imahinapas afectasqachu utaq mana allinchu kanqa. 11. Tukuy Rimanakuy 11.1.1. Kay Términos llapa acuerdota ruwan qamwan Xucre Inc. kaqwan Yanapakuy llamk'achisqaykimanta chaymanta ima ñawpaq utaq kunan pacha rimanakuykunata, hamut'aykunata utaq arreglokunatapas rantinpi ruwanku. Sichus ima tapuyniykipas utaq llakikuyniykipas kay Términos kaqmanta kan, ama hina kaspa info@xucre.net kaqpi rimanakuy XucreWallet llamk'achispa, kay Términos hunt'anaykipaq ari ñinki. Xucre Wallet Android/iOS kaqpaq Yanapakuymanta kamachiykuna Punchaw kamachiy: 1 ñiqin inti raymi killapi 2023 watapi Kay Yanapakuymanta Términos ( Términos ) huk kamachiymanhina rimanakuy ruwan qamwan ( Usuario  utaq  qam ) chaymanta Xucre Wallet ( Xucre,   ñuqayku , utaq  ñuqayku ) Xucre Wallet llamk'achisqaykimanta, huk web3 digital billetera Ecuador, Perú, México suyukunapi tarikun. Xucre Wallet kaqman yaykuspa, qillqakuspa utaq llamk'achispa, kay Términos kaqwan watasqa kayta ari ñinki. Ama hina kaspa, kay Términos nisqakunata allinta ñawiriy manaraq Xucre Wallet nisqawan llamk'achkaspa. 1. Definiciones 1.1 Xucre Wallet: Xucre qusqa digital billetera ruwanamanta riman mayqinchus Usuariokunaman digital kaqninkunata kamachiyta chaymanta waqaychayta saqin, criptomonedas chaymanta mana fungible tokens (NFTs) kaqwan. 1.2 Digital Activos: Criptomonedas, tokens, wak digital representaciones valores kaqmanta riman mayqinkunachus Xucre Walletwan yanapasqa kanku. 1.3 NFTs: Mana fungible tokens kaqmanta riman, sapalla digital kaqniyuq kaqmanta mayqinkunachus waqaychasqa chaymanta kamachisqa kanku Xucre Wallet ukhupi. 2. Hark’asqa Ruwaykuna. 2.2 Kamachiykuna hunt'aynin: Llapa kamachiykunata, kamachiykunata chaymanta kamachiykunata Xucre Wallet llamk'achiyta tinkinki, chaymanta criptomonedakunawan, qullqi ruwaykunawan chaymanta willay pakasqa kaqwan tupaq. 3. Criptos nisqakunaq t’aqakuynin 3.1 Clasificación de activos: Xucre Wallet criptomonedakunata digital activokuna hina qhawan kunan kamachiy interpretacionkunaman hina. Chayrayku, ima referenciakuna criptomonedakunamanta kay Términos ukhupi qhawasqa kanqa referenciakuna hina digital kaqniyuq kaqmanta. 4. Fichas rantiy, qhatuy, t’inkinakuy ima 4.1 T'inkinakuy Yanapakuykuna: Xucre Wallet atiyta qusunkiman rantiyta, ranqhayta chaymanta digital kaqninkunata t'inkinapaq aprobasqa kimsa kaq t'inkinakuykunawan. Reqsikunki chaymanta ari ñinki mayqin ruwaykunapas Xucre Wallet kaqwan yanapasqa mayqinkunachus digital kaqniyuq kanku chaymanta kay kimsa kaq t'inkinakuy kamachiykunaman chaymanta kamachiykunaman kamachisqa kanku. 4.2 Riesgo chaymanta Responsabilidad: Xucre Wallet mana garantizanchu serviciokuna intercambio kaqmanta tarikuyninta, chiqan kayninta utaq pachanpi kayninta. Entiendenki chaymanta chaskinki kay rantiy, rantiy chaymanta intercambio kaqmanta activos digitales kaqmanta riesgos inherentes kaqwan chaymanta qam sapalla responsable kanki chay riesgokuna chaninchaypaq chaymanta hapiypaq. 5. Xucre Wallet ukupi NFTkuna 5.1 NFT waqaychay chaymanta kamachiy: Xucre Wallet Usuariokuna NFTkuna billetera ukhupi waqaychayta chaymanta kamachiyta atichin. Ichaqa, Xucre Wallet mana NFTs ruwayta, quyta utaq t'inkiyta allinchu utaq kamachin chaymanta mana ima NFT kaqwan tupaq ruwanakuna utaq ch'aqwaykunamanta ruwasqachu kanqa. 5.2 NFT Qhatu: Xucre Wallet NFT qhatukunaman yaykuyta qunman billetera ukhupi. Chay qhatukuna llamk'achiyninqa sapankanku términos chaymanta condicionesninkumanhina kachkan, chaymanta Xucre Wallet mana responsablechu kanqa kay NFTs kay qhatukunapi listasqa kayninmanta, legalidadninmanta utaq calidadninmanta. 6. Achka simipi Yanapakuy 6.1 Simi akllaykuna: Xucre Wallet kastillu, portugués, inglés, quechua, nahuatl simikunapi kan. Xucre Wallet llamk'achinaykipaq munasqayki simita akllawaq. 7. Propiedad Intelectual nisqa 7.1 Xucre Wallet: Xucre Wallet chaymanta chaywan tinkisqa logotipokuna, rantiqpa markankuna, copyrightkuna chaymanta wak intelectual propiedad derechokuna Xucre utaq licencia quqninkunamanta kanku. Mana llamk'achinkichu, tikrayta, mirachiyta, rakiyta utaq ruwankichu derivado llamk'aykunata Xucre Wallet kaqpi utaq chaymanta chaymanta mana Xucre expresamente kamachisqa kaqtin. 8. Tukuchiy 8.1 Xucre Wallet kaqwan tukuchiy: Xucre Wallet derechota waqaychan Xucre Wallet kaqman yaykuyniyki sayachiyta utaq tukuchiypaq mayk'aqllapas, imaraykupas utaq mana imaraykupas, mana ñawpaq willayniyuq. . 9. Hatun Kamachiykuna 9.1 Llapan rimanakuy: Kay Términos llapa rimanakuy qamwan Xucre Wallet kaqwan ruwanku Xucre Wallet llamk'achisqaykimanta chaymanta ima ñawpaq rimanakuykunata, willakuykunata utaq hamut'aykunata rantinpi ruwanku. 9.2 Hukchay: Xucre Wallet derechota waqaychan kay Términos tikraypaq utaq musuqyachiypaq mayk'aqllapas sapalla munayninpi. Ima tikraypas allin kanqa chaymanta tikrasqa Términos Xucre Wallet web kitipi utaq ruwana ukhupi churasqa. 9.3 Kamachiy Kamachiy hinaspa Jurisdicción: Kay Términos nisqakunaqa Ecuador suyupa kamachikuyninman hinam kamachisqa hinaspa t’ikrakunqa. Ima ch'aqwaypas kay Términos nisqamanta utaq chaywan tupaq, Ecuador suyupi tribunalkunalla allichasqa kanqa. Xucre Wallet uraykachispa, churaspa chaymanta llamk'achispa, riqsikunki kay Yanapakuymanta Términos ñawirisqaykita, entiendesqaykita chaymanta ari ñisqaykita. ", 
    button_Accept: "Uyakuy",
    title: "Términos y Condiciones nisqakuna",
    accept_terms: "Chay términos y condiciones nisqakunatan chaskikuni"
  }

};

export default values;