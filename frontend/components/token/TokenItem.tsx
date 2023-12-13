import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from "ethers";
import { Avatar, HStack, Icon, IconButton, Menu, Pressable, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, { createRef, useEffect, useState } from "react";
import { useRecoilState } from "recoil";


import erc20Abi from '../../../contracts/erc20.json';
import translations from "../../assets/translations";
import { activeNetwork, activeWallet } from "../../service/state";
import { language as stateLanguage } from "../../service/state";
import { Token } from "../../service/token";
import { truncateString } from "../../service/utility";
import { coinIconNames, tokenIconNames } from '../../store/network';
import { deleteToken } from "../../store/token";
import { NavigationState } from "@react-navigation/native";
import { WalletInternal } from "../../store/wallet";

export default function TokenItem({ navigation, token, refreshList }: { navigation: { navigate: Function }, token: Token, refreshList: Function }) {
  const { colorMode } = useColorMode();
  const [network,] = useRecoilState(activeNetwork);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);
  const [amount, setAmount] = useState(BigNumber.from(0));
  const [language,] = useRecoilState(stateLanguage);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (_wallet.name != '' && network && network.rpcUrl !== '') {
      const _provider = getDefaultProvider(network.rpcUrl);

      const newWallet = (new WalletInternal(_wallet.wallet)).connect(_provider);
      if (isComponentMounted) {
        setProvider(_provider);
        setWallet(newWallet);
      }
    }
  }, [_wallet, network]);

  useEffect(() => {
    const runAsync = async () => {
      try {

        const network2 = await wallet.provider.getNetwork();
        if (token.type === 'coin' && wallet.address) {
          const walletBalance = await wallet.getBalance();
          setAmount(walletBalance);
        } else if (token.type === 'token' && wallet.address) {
          const contract = new ethers.Contract(token.address, erc20Abi, provider);
          const balance = await contract.balanceOf((wallet.address));
          setAmount(balance);

        } else {
          //
        }
      } catch (e) {
        //
      }


    }

    if (wallet.address && provider) {
      runAsync();
    }
  }, [wallet, provider])

  useEffect(() => {
    if (token.chainId && token.type === 'coin' && coinIconNames[token.chainId as keyof typeof coinIconNames]) {
      setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + coinIconNames[token.chainId as keyof typeof coinIconNames].toLowerCase() + '.png');
    } else if (token.chainId && token.type === 'token' && tokenIconNames[(token.chainId + '-' + token.address.toLowerCase()) as keyof typeof tokenIconNames]) {
      setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + tokenIconNames[(token.chainId + '-' + token.address.toLowerCase()) as keyof typeof tokenIconNames].toLowerCase() + '.png');
    } else {
      //setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/placeholdericon.png');
    }
    //setAvatar('');
  }, [token])

  const removeToken = async () => {
    const result = await deleteToken(token);
    refreshList();
  }

  const TokenIcon = ({ iname }: { iname: string }) => {
    const icon_color = colorMode === 'dark' ? 'white' : 'black';
    return (
      <>
        {avatar.length > 0 &&
          <Avatar bg="transparent" mr="1" source={{
            uri: avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
          }} size={10}>
            <Text>{iname}</Text>
          </Avatar>
        }

        {avatar.length === 0 &&
          <Avatar bg="transparent" mr="1" size={10}>
            <Icon
              as={MaterialIcons}
              name={'request-quote'}
              color={'white'}
              size={7}
            />
          </Avatar>
        }
      </>

      //<Icon name="poly" style={{ alignSelf: 'center', color: icon_color, fontSize: 25, justifyContent: 'center',marginBottom:0, marginTop:-100,  }}/>
    )
  }

  const sendToken = () => {
    navigation.navigate('SendToken', { token })
  }
  return (
    <HStack alignItems="center" justifyContent="space-between" py={2}>
      <HStack alignItems="center" space={{ base: 3, md: 6 }}>
        <TokenIcon iname={token.type == 'coin' ? coinIconNames[token.chainId as keyof typeof coinIconNames] : truncateString(token.address, 3) as string} />

        <VStack>
          <Pressable>
            <Text fontSize="md" bold>
              {token.name}
            </Text>
          </Pressable>
        </VStack>
      </HStack>
      <HStack alignItems="center" space={{ base: 2 }}>
        <Text
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          fontWeight="normal">{ethers.utils.formatEther(amount)}</Text>
        <Tooltip label="More Options" openDelay={500}>
          <Menu w="190" trigger={triggerProps => {
            return <Pressable accessibilityLabel={translations[language as keyof typeof translations].TokenItem.menu_accessiblity_label} {...triggerProps}>
              <Icon
                as={MaterialIcons}
                name="more-vert"
                size="6"
                color="coolGray.500"
              />
            </Pressable>;
          }}
          >
            <Menu.Item onPress={() => { sendToken() }}><Text>{translations[language as keyof typeof translations].TokenItem.send_token_button}</Text></Menu.Item>
            <Menu.Item onPress={() => { removeToken() }}><Text>{translations[language as keyof typeof translations].TokenItem.delete_button}</Text></Menu.Item>
          </Menu>
        </Tooltip>
      </HStack>
    </HStack>
  )
}