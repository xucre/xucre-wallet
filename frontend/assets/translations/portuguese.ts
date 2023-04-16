const values = {
    AddToken: {
      address_placeholder: 'Digite o endereço do token',
      chain_placeholder: 'Selecionar cadeia',
      name_placeholder: 'Digite o nome do token',
      submit_button: 'Salvar Token',
      title: 'Carteira'
    },
    App: {
      select_network_title: 'Redes',
      select_wallet_title: 'Carteiras',
      send_transaction_title: 'Enviar transação',
      set_password_title: 'Definir senha',
      sign_message_title: 'Assinar mensagem',
      sign_transaction_title: 'Assinar transação',
      token_title: 'Carteira',
      view_network_title: 'Rede',
      view_wallet_title: 'Carteira',
    },
    ConnectionRequest: {
      approve_button: 'Aprovar',
      next_button: 'Avançar',
      reject_button: 'Rejeitar',
      rejected: "rejeitado pelo usuário",
      title: 'Solicitação de Conexão',
      wallet_select_instructions: 'Selecionar carteira(s)',
    },
    CreateNetwork: {
      button_save: 'Salvar',
      chainId_placeholder: 'Digite o ID da cadeia',
      explorer_placeholder: 'Digite a URL do Explorador de Blocos (opcional)',
      name_placeholder: 'Digite o nome',
      rpcUrl_placeholder: 'Digite o URL RPC',
      submit_button: 'Salvar rede',
      symbol_placeholder: 'Digite o símbolo da cadeia',
    },
    CreateWallet: {
      instructions: 'Ao criar uma nova carteira, você receberá uma sequência de mnemônicos que representam sua "senha pessoal". Qualquer pessoa com essa sequência pode reconfigurar sua carteira em qualquer novo dispositivo. Mantenha -o armazenado o mais seguro possível Somente você deve ter acesso a essas informações.',
      instructions_button: 'Proximo',
      instructions_nameWallet: 'Definir seu nome de carteira',
      instructions_newWwallet: 'Nova Carteira',
      mnemonic_confirm_button: 'Proximo',
      mnemonic_confirm_instructions: 'Salvar frase mnemônica',
      mnemonic_error: 'As frases mnemônicas devem corresponder',
      mnemonic_error_button: 'Proximo',
      mnemonic_instructions: 'Selecione o pedido e salve essas palavras. Se você os perder, nunca será capaz de recuperar sua carteira ',
      name_entry_button: 'Salvar carteira',
      name_entry_button_loadingtext: 'Enviando',
      name_entry_input_placeholder: 'Definir nome da carteira',
      name_wallet: 'Nome da carteira',
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
      header: 'Assinar transação',
      reject_button: 'Rejeitar',
      title: 'Enviar transação',
      to: 'Para: '
    },
    LegacySignTransaction: {
      approve_button: 'Aprovar',
      header: 'Assinar transação',
      reject_button: 'Rejeitar',
      title: 'Assinar Transação'
    },
    LegacySignTypedData: {
      approve_button: 'Aprovar',
      header: 'Solicitação de mensagem de assinatura',
      header_origin: 'Origem: ',
      reject_button: 'Rejeitar',
      title: 'Mensagem de assinatura'
    },
      Listener: {
        failure_message: 'Falha na transação',
        success_message: 'Transação bem-sucedida'
      },
      Menu: {
        network_button: 'REDES',
        nft_button: 'NFTS',
        password_button: 'SENHA',
        qr_scan_button: 'VERREDURA QR',
        wallet_button: 'CARTEIRAS',
      },
      NewWallet: {
        about: "Crie uma nova carteira ou se já tiver uma recupere-a através da sua frase de segurança",
        create_button: 'Criar Carteira',
        instruções: "Sua Carteira",
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
        permission_denied: 'Sem acesso à câmera',
        permission_request: 'Solicitando permissão para câmera',
        rescan: 'Toque para escanear novamente'
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
        en: 'Inglês',
        es: 'Espanhol',
        nah: 'Nahuatl',
        pt: 'Português',
        qu: 'Quíchua',
      },
      SelectNetwork: {
        Select_network: 'Selecione ou crie uma nova rede',
        new_button: 'Nova Rede',
        select_button: 'Selecionar rede',
        select_button_tooltip: 'Mais opções',
        title: 'Redes',
      },
      SelectWallet: {
        new_button: 'Nova carteira',
        select_button: 'Selecionar carteira',
        select_button_tooltip: 'Mais opções',
        title: 'Selecionar carteira'
      },
      SendToken: {
        address_placeholder: 'Digite o endereço do destinatário',
        submit_button: 'Enviar',
        title: 'Enviar token:',
        token_placeholder: 'Selecionar token',
      },
      SendTransaction: {
        amount: 'Valor: ',
        approve_button: 'Aprovar',
        from :'De: ',
        header: 'Assinar transação',
        reject_button: 'Rejeitar',
        title: 'Enviar transação',
        to: 'Para: '
      },
      SetPassword: {
        form_confirmation: 'Confirmar Senha',
        form_error_text: 'Pelo menos 6 caracteres são obrigatórios.',
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
        header: 'Assinar transação',
        reject_button: 'Rejeitar',
        title: 'Mensagem de assinatura'
      },
      SignTyped: {
        approve_button: 'Aprovar',
        header: 'Solicitação de mensagem de assinatura',
        header_origin: 'Origem: ',
        reject_button: 'Rejeitar',
        title: 'Mensagem de assinatura'
      },
      SupportPage:{
        button_send: 'Enviar Email',
        describe_issue: 'Descreva seu problema',
        introduction: 'Se você tiver problemas com nosso aplicativo, entre em contato conosco em support@xsucre.com ou use o formulário abaixo',
        subject_send:'Sujeito',
        title: 'Suporte',
        to_send: 'De',
      },
      SwapToken: {
        title: 'Carteira'
      },
      TokenItem: {
        menu_accessiblity_label: "Menu mais opções",
        send_token_button: 'Enviar'
      },
      ViewNetwork: {
        active_network: 'Rede Ativa',
        edit_button: 'Editar',
        title: 'Rede',
        use_network: 'Use Rede'
      },
      ViewWallet: {
        clear_button: 'Limpar transações',
        holdings_placeholder: 'Inserir Holdings de moedas',
        new_button: 'Adicionar Token',
        tab_list: ['Participações', 'Transações'],
        title: 'Carteira',
        transaction_placeholder: 'Inserir histórico de transações',
      }

    };
    
      export default values;