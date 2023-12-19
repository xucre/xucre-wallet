import { TranslationType } from ".";
/* eslint-disable sort-keys */
const values : TranslationType  = {
  AddToken: {
    address_placeholder: 'Digite o endereÃ§o do token',
    chain_placeholder: 'Selecionar cadeia',
    name_placeholder: 'Digite o nome do token',
    submit_button: 'Salvar Token',
    title: 'Carteira'
  },
  App: {
    select_network_title: 'Redes',
    select_wallet_title: 'Carteiras',
    send_transaction_title: 'Enviar transaÃ§Ã£o',
    set_password_title: 'Definir senha',
    sign_message_title: 'Assinar mensagem',
    sign_transaction_title: 'Assinar transaÃ§Ã£o',
    token_title: 'Carteira',
    view_network_title: 'Rede',
    view_wallet_title: 'Carteira',
  },
  Buttons_Footer: { 
    buttonswap: "SWAP", 
    history: "HistÃ³ria",
    home: "Inicio", 
    profile: "Perfil", 
    support: "Suporte"  
  },  
  Buttons_Header: { 
    buy: "Comprar", 
    connect: "ConexÃ£o",
    nft: "NFT", 
    receive: "Receber", 
    send: "Enviar"  
  },
  ConnectionRequest: {
    approve_button: 'Aprovar',
    next_button: 'AvanÃ§ar',
    reject_button: 'Rejeitar',
    rejected: "rejeitado pelo usuÃ¡rio",
    title: 'SolicitaÃ§Ã£o de ConexÃ£o',
    wallet_select_instructions: 'Selecionar carteira(s)',
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
    button_save: 'Salvar',
    chainId_placeholder: 'Digite o ID da cadeia',
    explorer_placeholder: 'Digite a URL do Explorador de Blocos (opcional)',
    name_placeholder: 'Digite o nome',
    rpcUrl_placeholder: 'Digite o URL RPC',
    submit_button: 'Salvar rede',
    symbol_placeholder: 'Digite o sÃ­mbolo da cadeia',
  },
  CreateWallet: {
    instructions: 'Ao criar uma nova carteira, vocÃª receberÃ¡ uma sequÃªncia de mnemÃ´nicos que representam sua "senha pessoal". Qualquer pessoa com essa sequÃªncia pode reconfigurar sua carteira em qualquer novo dispositivo. Mantenha -o armazenado o mais seguro possÃ­vel Somente vocÃª deve ter acesso a essas informaÃ§Ãµes.',
    instructions_button: 'Proximo',
    instructions_nameWallet: "Defina o nome da sua carteira",
    instructions_newWwallet: 'Nova Carteira',
    mnemonic_confirm_button: "Proximo",
    mnemonic_confirm_instructions: 'Salvar frase mnemÃ´nica',
    mnemonic_error: 'As frases mnemÃ´nicas devem corresponder',
    mnemonic_error_button: 'Proximo',
    mnemonic_instructions: "Por favor, selecione o pedido e salve estas palavras. Se vocÃª as perder, nunca poderÃ¡ recuperar sua carteira",
    name_entry_button: 'Salvar carteira',
    name_entry_button_loadingtext: 'Enviando',
    name_entry_input_placeholder: 'Definir nome da carteira',
    name_wallet: 'Nome da carteira',
  },
  LanguagePage: {  
    menu_button: "IDIOMA",
    select_language: "PORTUGUESE",
    title_language: "SELECIONE SUA LINGUA"
  },
  LegacyEthSign: {
    approve_button: 'Aprovar',
    header: 'Pedido de Assinatura',
    reject_button: 'Rejeitar',
    title: 'Mensagem de assinatura'
  },
  LegacySendTransaction: {
    amount: 'Valor: ',
    approve_button: 'Aprovar',
    from :'De: ',
    header: 'Assinar transaÃ§Ã£o',
    reject_button: 'Rejeitar',
    title: 'Enviar transaÃ§Ã£o',
    to: 'Para: '
  },
  LegacySignTransaction: {
    approve_button: 'Aprovar',
    header: 'Assinar transaÃ§Ã£o',
    reject_button: 'Rejeitar',
    title: 'Assinar TransaÃ§Ã£o'
  },
  LegacySignTypedData: {
    approve_button: 'Aprovar',
    header: 'SolicitaÃ§Ã£o de mensagem de assinatura',
    header_origin: 'Origem: ',
    reject_button: 'Rejeitar',
    title: 'Mensagem de assinatura'
  },
  Listener: {
    failure_message: 'Falha na transaÃ§Ã£o',
    success_message: 'TransaÃ§Ã£o bem-sucedida'
  },
  Menu: {
    connections_button: 'CONNECTIONS',
    network_button: 'REDES',
    nft_button: 'NFTS',
    password_button: 'SENHA',
    qr_scan_button: 'VERREDURA QR',
    requests_button: 'REQUESTS',
    wallet_button: 'CARTEIRAS',
  },
  NewWallet: {
    about: "Crie uma nova carteira ou se jÃ¡ tiver uma recupere-a atravÃ©s da sua frase de seguranÃ§a",
    create_button: 'Criar Carteira',
    instructions: "Sua Carteira",
    recover_button: 'Recuperar Carteira',
  },
  PasswordComponent: {
    error_message: 'Senha Invalida',
    form_label: 'Senha ',
    form_placeholder: 'Insira a Senha',
    header: 'Senha',
    submit_button: 'Enviar'
  },
  QRReader: {
    permission_denied: 'Sem acesso Ã  cÃ¢mera',
    permission_request: 'Solicitando permissÃ£o para cÃ¢mera',
    rescan: 'Toque para escanear novamente'
  },
  QRWallet: {
    instructions: "Compartilhe para receber fundos",
    toast_send: "WhatsApp enviado com sucesso!"
  },
  RecoverWallet: {
    instructions: 'Insira a sequÃªncia de mnemÃ´nicos do seu processo de criaÃ§Ã£o de carteira original.',
    instructions_button: 'Recuperar',
    mnemonic_entry_input_placeholder: 'Digite a frase mnemÃ´nica separada por espaÃ§os Ãºnicos',
    mnemonic_not_complete: 'Mnemonic nÃ£o Ã© o tamanho apropriado',
    name_entry_input_placeholder: 'Definir nome da carteira',
    save_button: 'Salvar',
    save_button_loadingtext: 'Enviando'
  },
  Requests: {
    delete_button: 'Excluir',
    expired_text: 'Expirado'
  },
  SelectLanguage : {
    en: 'InglÃªs',
    es: 'Espanhol',
    nah: 'Nahuatl',
    pt: 'PortuguÃªs',
    qu: 'QuÃ­chua'
  },
  SelectNetwork: {
    delete_button: 'Delete Network',
    new_button: 'Nova Rede',
    select_button: 'Selecionar rede',
    select_button_tooltip: 'Mais opÃ§Ãµes',
    Select_network: 'Selecione ou crie uma nova rede',
    select_network_default: "Selecione a rede padrão",
    title: 'Redes',
  },
  SelectWallet: {
    new_button: 'Nova carteira',
    select_button: 'Selecionar carteira',
    select_button_tooltip: 'Mais opÃ§Ãµes',
    title: 'Selecionar carteira'
  },
  SendToken: {
    address_placeholder: 'Digite o endereÃ§o do destinatÃ¡rio',
    not_enough_error: "Insufficient Balance",
    submit_button: 'Enviar',
    title: 'Enviar token:',
    token_placeholder: 'Selecionar token',
  },
  SendTransaction: {
    amount: 'Valor: ',
    approve_button: 'Aprovar',
    from :'De: ',
    header: 'Assinar transaÃ§Ã£o',
    hide_data: "Hide Data",
    reject_button: 'Rejeitar',
    title: 'Enviar transaÃ§Ã£o',
    to: 'Para: ',
    view_data: "View Data"
  },
  SetPassword: {
    form_confirmation: 'Confirmar Senha',
    form_error_text: 'Pelo menos 6 caracteres sÃ£o obrigatÃ³rios.',
    form_helper_text: 'Deve ter pelo menos 6 caracteres.',
    form_new_header: 'Senha',
    form_old_header: 'Senha atual',
    form_save_button: 'Salvar',
    password_placeholder: 'Senha',
    title: 'Definir Senha'
  },
  SignEth: {
    approve_button: 'Aprovar',
    header: 'Pedido de Assinatura',
    reject_button: 'Rejeitar',
    title: 'Mensagem de assinatura'
  },
  SignTransaction: {
    approve_button: 'Aprovar',
    header: 'Assinar transaÃ§Ã£o',
    reject_button: 'Rejeitar',
    title: 'Mensagem de assinatura'
  },
  SignTyped: {
    approve_button: 'Aprovar',
    header: 'SolicitaÃ§Ã£o de mensagem de assinatura',
    header_origin: 'Origem: ',
    reject_button: 'Rejeitar',
    title: 'Mensagem de assinatura'
  },
  SupportPage: { 
    button_cancel: "Cancelar",
    button_send: "Enviar e-mail",  
    describe_issue: "Descreva seu problema",  
    introduction: "Se vocÃª tiver problemas com nosso aplicativo, entre em contato conosco em support@xucre.com ou use o formulÃ¡rio abaixo",
    subject_send: "Assunto",  
    title: "Suporte", 
    to_send: "De",  
    toast_send: "E-mail enviado com sucesso!"  
  },
  SwapToken: {
    title: 'Carteira'
  },
  TokenItem: {
    delete_button: 'Delete Token',
    menu_accessiblity_label: "Menu mais opÃ§Ãµes",
    send_token_button: 'Enviar'
  },
  ViewNetwork: {
    active_network: 'Rede Ativa',
    edit_button: 'Editar',
    title: 'Rede',
    use_network: 'Use Rede'
  },
  ViewWallet: {
    clear_button: 'Limpar transaÃ§Ãµes',
    holdings_placeholder: 'Inserir Holdings de moedas',
    new_button: 'Adicionar Token',
    no_network_error: 'No Network Selected',
    tab_list: [
        "ParticipaÃ§Ãµes", 
        "TransaÃ§Ãµes"
    ],
    title: "Carteira",
    transactions_placeholder: 'Inserir histÃ³rico de transaÃ§Ãµes',
  },
  WalletConnect : {
    session_proposal: ['Session Proposal', 'A dapp wants to connect your wallet'],
    session_request_sign_tx: ['Sign Transaction', 'Please approve or reject request'],
    session_request_send_tx: ['Send Transaction', 'Please approve or reject request'],
  },
  WalletHistory: {  
    title: "HistÃ³ria",
    total_balance: 'Total Balance'   
  },  
  WhatsAppNotification:{
    button: "Enviar notificação pelo WhatsApp",
    Send_Button: "Enviar Whatsapp",
    notificationNumber: "Insira o código do país incluindo o sinal +"
  },
  totalBalance:{
    title: "Balanço total"
  },
  termsConditions: {
    terms: "Política de Privacidade para XucreWallet e Xucre.net Data efetiva: 1º de julho de 2023 Obrigado por usar o XucreWallet, uma carteira descentralizada desenvolvida pela Xucre Inc. Esta política de privacidade descreve como coletamos, usamos, divulgamos e protegemos informações pessoais quando você usa nosso aplicativo. Por favor, leia esta política cuidadosamente para entender nossas práticas em relação aos seus dados pessoais. 1. Informações que coletamos 1.1. Informações pessoais: podemos coletar algumas informações pessoais suas, como seu nome, endereço de e-mail, número de telefone e qualquer outra informação que você nos fornecer ao criar uma conta ou realizar transações no aplicativo XucreWallet. 1.2. Informações da carteira: quando você usa o XucreWallet, podemos coletar e armazenar informações relacionadas às suas transações de criptomoeda, incluindo histórico de transações, endereços de carteira e valores de transações. 2. Uso de informações 2.1. A Xucre Inc. não tem a capacidade de acessar, modificar, controlar ou reverter quaisquer transações ou alterações feitas no aplicativo XucreWallet. Não podemos recuperar credenciais de carteira perdidas ou esquecidas, incluindo frases mnemônicas ou chaves privadas. É sua exclusiva responsabilidade manter o armazenamento seguro e o backup de suas credenciais de carteira. 2.2. Usaremos as informações pessoais que você fornecer exclusivamente com o objetivo de fornecer e melhorar os serviços XucreWallet. Isso inclui: facilitar transações, fornecer suporte ao cliente, prevenir atividades fraudulentas ou não autorizadas e cumprir obrigações legais. 3. Divulgação de Informações 3.1. Podemos compartilhar suas informações pessoais com provedores de serviços terceirizados selecionados, apenas na medida do necessário para fornecer os serviços associados ao XucreWallet. Esses provedores de serviços terceirizados são obrigados a manter a confidencialidade e a segurança de suas informações pessoais de acordo com as leis aplicáveis. 3.2. Podemos divulgar suas informações pessoais se exigido por lei ou em resposta a um processo legal válido, como ordem judicial ou solicitação do governo. 4. Segurança de dados 4.1. A Xucre Inc. toma medidas razoáveis para proteger suas informações pessoais e protegê-las contra acesso, alteração ou divulgação não autorizados. No entanto, esteja ciente de que nenhuma medida de segurança pode garantir proteção completa e não podemos garantir que suas informações pessoais sempre permanecerão seguras. 5. Transferências de dados transfronteiriças 5.1. A Xucre Inc. opera em várias jurisdições, incluindo as Ilhas Virgens Britânicas, Estados Unidos (Delaware) e Equador (Quito). Ao usar o XucreWallet, você concorda com a transferência de suas informações pessoais para essas jurisdições, que podem ter leis de proteção de dados diferentes do seu país. 6. Sites e serviços de terceiros 6.1. O aplicativo XucreWallet pode conter links para sites ou serviços de terceiros que não são de propriedade ou controlados pela Xucre Inc. Esta política de privacidade se aplica apenas ao nosso aplicativo e não somos responsáveis pelas práticas de privacidade de quaisquer sites ou serviços de terceiros. 7. Alterações a esta Política de Privacidade 7.1. Xucre Inc. pode atualizar esta política de privacidade de tempos em tempos. Iremos notificá-lo sobre quaisquer alterações materiais publicando a política atualizada no aplicativo XucreWallet ou por outros meios apropriados. Nós encorajamos você a rever esta política periodicamente para quaisquer atualizações. 8. Contate-nos 8.1. Se você tiver alguma dúvida ou preocupação sobre esta política de privacidade ou nossas práticas de dados, entre em contato conosco em info@xucre.net. Ao usar o XucreWallet, você concorda com os termos e condições descritos nesta política de privacidade. Se você não concorda com esta política, por favor, não use nosso aplicativo. Termos de serviço do site Xucre.net Data efetiva: 1º de julho de 2023 Estes termos de serviço ( Termos ) regem o uso do site XucreWallet, incluindo quaisquer aplicativos de software associados (coletivamente, o  Serviço ), fornecidos pela Xucre Inc. ( Xucre ,  nós ,  nós  ou  nosso ). Ao usar o Serviço, você concorda em ficar vinculado a estes Termos. Se você não concorda com estes Termos, por favor, não use o Serviço. 1. Elegibilidade 1.1. Você deve ter pelo menos 18 anos de idade para usar o Serviço. Ao usar o Serviço, você declara e garante que tem pelo menos 18 anos de idade e capacidade legal para celebrar estes Termos. Se você estiver usando o Serviço em nome de uma entidade, você declara e garante que tem autoridade para vincular essa entidade a estes Termos. 2. Contas de usuário 2.1. Para usar certos recursos do Serviço, pode ser necessário criar uma conta de usuário. Você é responsável por fornecer informações precisas e completas durante o processo de registro da conta e por manter a confidencialidade das credenciais da sua conta. 2.2. Você é o único responsável por todas as atividades que ocorrem em sua conta de usuário. Xucre Inc. não é responsável por qualquer acesso não autorizado ou uso de sua conta. Se você suspeitar de algum acesso não autorizado, você deve nos notificar imediatamente. 3. Uso do Serviço 3.1. XucreWallet é uma carteira descentralizada que permite gerenciar sua criptomoeda. Ao usar o Serviço, você entende e reconhece que a Xucre Inc. não tem a capacidade de acessar, modificar, controlar ou reverter quaisquer transações ou alterações feitas no aplicativo XucreWallet, incluindo a perda ou recuperação de credenciais de carteira, como frases mnemônicas ou chaves privadas. 3.2. Você concorda em usar o Serviço apenas para fins legais e em conformidade com todas as leis e regulamentos aplicáveis. Você é responsável por garantir que seu uso do Serviço não viole nenhum direito de terceiros. 4. Direitos de propriedade intelectual 4.1. O Serviço, incluindo qualquer software, conteúdo e materiais disponibilizados por meio do Serviço, são de propriedade da Xucre Inc. e protegidos por leis de propriedade intelectual. Você não pode copiar, modificar, distribuir, vender ou alugar qualquer parte do Serviço sem o nosso consentimento prévio por escrito. 5. Privacidade 5.1. Coletamos, usamos e divulgamos informações pessoais de acordo com nossa Política de Privacidade. Ao usar o Serviço, você concorda com nossa coleta, uso e divulgação de informações pessoais conforme descrito na Política de Privacidade. 6. Isenções de responsabilidade e limitações de responsabilidade 6.1. O Serviço é fornecido  como está  e  conforme disponível , sem quaisquer garantias ou representações, expressas ou implícitas. Não garantimos a precisão, integridade ou pontualidade do Serviço. 6.2. A Xucre Inc. não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais, consequentes ou exemplares, incluindo lucros cessantes, resultantes do seu uso do Serviço. 7. Indenização 7.1. Você concorda em indenizar, defender e isentar a Xucre Inc., seus diretores, executivos, funcionários e agentes de todas e quaisquer reivindicações, responsabilidades, danos, custos e despesas (incluindo honorários advocatícios razoáveis) decorrentes ou relacionados com o uso do Serviço, violação destes Termos ou violação de qualquer lei ou direitos de terceiros. 8. Alterações e rescisão 8.1. Reservamo-nos o direito de modificar ou atualizar estes Termos a qualquer momento. Quaisquer alterações entrarão em vigor imediatamente após a publicação dos Termos revisados no site da XucreWallet ou no aplicativo. Seu uso continuado do Serviço após a publicação de quaisquer alterações constitui sua aceitação de tais alterações. Se você não concordar com os Termos modificados, deverá parar de usar o Serviço. 8.2. Podemos rescindir ou suspender seu acesso ao Serviço, com ou sem justa causa, a qualquer momento e sem aviso prévio. 9. Lei Aplicável e Resolução de Disputas 9.1. Estes Termos serão regidos e interpretados de acordo com as leis das Ilhas Virgens Britânicas, independentemente de seus conflitos de princípios legais. 9.2. Qualquer disputa decorrente ou relacionada a estes Termos será resolvida por meio de negociações de boa fé. Se a disputa não puder ser resolvida amigavelmente, ela será encaminhada e finalmente resolvida por arbitragem de acordo com as regras do Centro Internacional de Arbitragem das Ilhas Virgens Britânicas. 10. Divisibilidade 10.1. Se qualquer disposição destes Termos for considerada inválida, ilegal ou inexequível, a validade, legalidade ou aplicabilidade das demais disposições não serão afetadas ou prejudicadas de forma alguma. 11. Acordo Integral 11.1. Estes Termos constituem o acordo integral entre você e a Xucre Inc. em relação ao seu uso do Serviço e substituem quaisquer acordos, entendimentos ou acordos anteriores ou contemporâneos. Se você tiver alguma dúvida ou preocupação sobre estes Termos, entre em contato conosco em info@xucre.net Ao usar o XucreWallet, você concorda em cumprir estes Termos. Termos de Serviço da Carteira Xucre Android/iOS Data efetiva: 1º de julho de 2023 Estes Termos de Serviço ( Termos ) constituem um acordo juridicamente vinculativo entre você ( Usuário  ou  você ) e a Carteira Xucre ( Xucre ,  nós  ou  nós ) em relação ao uso da Carteira Xucre, uma carteira digital web3 disponível no Equador, Peru e México. Ao acessar, registrar ou usar a Carteira Xucre, você concorda em ficar vinculado a estes Termos. Por favor, leia estes Termos cuidadosamente antes de usar a Carteira Xucre. 1. Definições 1.1 Carteira Xucre: Refere-se ao aplicativo de carteira digital fornecido pela Xucre que permite aos Usuários gerenciar e armazenar ativos digitais, incluindo criptomoedas e tokens não fungíveis (NFTs). 1.2 Ativos Digitais: Refere-se a criptomoedas, tokens e outras representações digitais de valor que são suportadas pela Carteira Xucre. 1.3 NFTs: Refere-se a tokens não fungíveis, ativos digitais únicos que são armazenados e gerenciados dentro da Carteira Xucre. 2. Atividades Proibidas 2.1 Atividades ilegais: Você concorda em não usar a Carteira Xucre para quaisquer atividades ilegais, incluindo, entre outras, lavagem de dinheiro, financiamento do terrorismo, fraude ou qualquer outra atividade que viole as leis ou regulamentos aplicáveis. 2.2 Cumprimento das Leis: Você deve cumprir todas as leis, regulamentos e diretrizes aplicáveis relacionadas ao uso da Carteira Xucre, incluindo aquelas relacionadas a criptomoedas, transações financeiras e privacidade de dados. 3. Classificação das Criptomoedas 3.1 Classificação dos Ativos: A Carteira Xucre considera as criptomoedas como ativos digitais de acordo com as interpretações legais vigentes. Portanto, quaisquer referências a criptomoedas dentro destes Termos devem ser consideradas como referências a ativos digitais. 4. Compra, venda e troca de tokens 4.1 Serviços de troca: A Carteira Xucre pode fornecer a você a capacidade de comprar, vender e trocar ativos digitais por meio de trocas de terceiros aprovadas. Você reconhece e concorda que quaisquer transações facilitadas pela Xucre Wallet envolvendo ativos digitais estão sujeitas aos termos e condições dessas trocas de terceiros. 4.2 Risco e Responsabilidade: A Carteira Xucre não garante a disponibilidade, precisão ou pontualidade dos serviços de câmbio. Você entende e aceita que a compra, venda e troca de ativos digitais envolvem riscos inerentes e que você é o único responsável por avaliar e assumir esses riscos. 5. NFTs dentro da Carteira Xucre 5.1 Armazenamento e gerenciamento de NFT: O Xucre Wallet permite que os usuários armazenem e gerenciem NFTs dentro da carteira. No entanto, a Xucre Wallet não endossa ou controla a criação, emissão ou troca de NFTs e não deve ser responsabilizada por quaisquer transações ou disputas relacionadas a NFT. 5.2 NFT Marketplace: A Carteira Xucre pode fornecer acesso a mercados NFT dentro da carteira. O uso de tais mercados está sujeito aos seus respectivos termos e condições, e a Xucre Wallet não se responsabiliza pela disponibilidade, legalidade ou qualidade dos NFTs listados nesses mercados. 6. Suporte multilíngue 6.1 Opções de idioma: A Carteira Xucre está disponível nos idiomas espanhol, português, inglês, quíchua e nahuatl. Você pode escolher o idioma preferido para o uso da Carteira Xucre. 6.2 Discrepâncias de tradução: No caso de qualquer discrepância entre as diferentes versões destes Termos, a versão em espanhol prevalecerá. 7. Propriedade Intelectual 7.1 Carteira Xucre: A Carteira Xucre e seus logotipos, marcas registradas, direitos autorais e outros direitos de propriedade intelectual associados são de propriedade da Xucre ou de seus licenciadores. Você não deve usar, modificar, reproduzir, distribuir ou criar trabalhos derivados com base na Carteira Xucre ou em seu conteúdo, a menos que expressamente autorizado pela Xucre. 8. Rescisão 8.1 Rescisão pela Carteira Xucre: A Carteira Xucre se reserva o direito de suspender ou encerrar seu acesso à Carteira Xucre a qualquer momento, com ou sem justa causa, sem aviso prévio. 8.2 Efeito da Rescisão: Após a rescisão, você concorda em cessar todo o uso da Carteira Xucre e reconhece que a Carteira Xucre não será responsável perante você ou terceiros por quaisquer danos, perdas ou responsabilidades resultantes da rescisão. 9. Disposições Gerais 9.1 Acordo Integral: Estes Termos constituem o acordo integral entre você e a Carteira Xucre em relação ao uso da Carteira Xucre e substituem quaisquer acordos, comunicações ou entendimentos anteriores. 9.2 Modificação: A Carteira Xucre reserva-se o direito de modificar ou atualizar estes Termos a qualquer momento, a seu exclusivo critério. Quaisquer alterações entrarão em vigor após a publicação dos Termos modificados no site da Carteira Xucre ou no aplicativo. 9.3 Lei Aplicável e Jurisdição: Estes Termos serão regidos e interpretados de acordo com as leis do Equador. Quaisquer disputas decorrentes ou relacionadas a estes Termos serão resolvidas exclusivamente pelos tribunais do Equador. 9.4 Divisibilidade: Se qualquer disposição destes Termos for considerada inválida ou inexequível, tal disposição deverá ser interpretada na extensão máxima permitida pela lei aplicável, e as demais disposições continuarão em pleno vigor e efeito. Ao baixar, instalar e usar a Carteira Xucre, você reconhece que leu, entendeu e concordou com estes Termos de Serviço. ",
    button_Accept: "Aceitar",
    title: "Termos e Condições",
    accept_terms: "Eu aceito os termos e condições"
  }
};
  
export default values;