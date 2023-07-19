import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from "ethers";
import { Avatar, HStack, Icon,  IconButton, Menu, Pressable, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, {createRef, useEffect, useState} from "react";
import { useRecoilState } from "recoil";

import erc20Abi from '../../../contracts/erc20.json';
import translations from "../../assets/translations";
import { activeNetwork, activeWallet } from "../../service/state";
import { language as stateLanguage } from "../../service/state";
import { Token } from "../../service/token";
import { truncateString } from "../../service/utility";
import { iconNames } from '../../store/network';
import { deleteToken } from "../../store/token";

export default function TokenItem ({navigation, token, refreshList}) {
  const { colorMode } = useColorMode();
  const [network, ] = useRecoilState(activeNetwork);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);
  const [amount, setAmount] = useState(BigNumber.from(0));
  const [language, ] = useRecoilState(stateLanguage);
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  useEffect(() => {
    if (_wallet.name != '' && network && network.rpcUrl !== '') {
      //console.log('loading', _wallet)
      const _provider = getDefaultProvider(network.rpcUrl);
         
      const newWallet = _wallet.wallet.connect(_provider);
      if (isComponentMounted) {
        setProvider(_provider);
        setWallet(newWallet);
      }
    }
  }, [_wallet, network]);

  useEffect(() => {
    const runAsync = async () => {
      try {
        console.log('token onload', token, wallet.address);
        
        const network2 = await wallet.provider.getNetwork();
        console.log(network2);
        if (token.type === 'coin' && wallet.address) {
          const walletBalance = await wallet.getBalance();
          console.log('balance',walletBalance);
            setAmount(walletBalance);
        } else if (token.type === 'token' && wallet.address) {
          const contract = new ethers.Contract(token.address, erc20Abi, provider);
          //console.log('token get balance', contract.balanceOf);
          const balance = await contract.balanceOf((wallet.address));
          console.log('token balance', token.name, balance);
          setAmount(balance);
          
        } else {
          console.log('nothing works getting balance', token, wallet);
        }     
      } catch (e) {
        console.log('error getting balance')
        console.log(e);
      }
        
      
    }
    //console.log('tokenItem loading', wallet.address, typeof provider);
    if (wallet.address && provider) {
      runAsync();
    }
  }, [wallet, provider])

  const removeToken = async () => {
    const result = await deleteToken(token);
    refreshList();
  }

  const TokenIcon = ({iname}) => {
    //console.log(iname);
    const icon_color = colorMode ==='dark'? 'white':'black';
    return (
      <Avatar bg="primary.600" mr="1">
          <Text>{iname}</Text>
      </Avatar>
      //<Icon name="poly" style={{ alignSelf: 'center', color: icon_color, fontSize: 25, justifyContent: 'center',marginBottom:0, marginTop:-100,  }}/>
    )
  }

  const sendToken = () => {
    navigation.navigate('SendToken', {token})
  }
  return (
    <HStack alignItems="center" justifyContent="space-between">
     <HStack alignItems="center" space={{ base: 3, md: 6 }}>
      <TokenIcon iname={token.type == 'coin' ? iconNames[network.chainId] : truncateString(token.address, 3)}/>
       
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
            return <Pressable accessibilityLabel={translations[language].TokenItem.menu_accessiblity_label} {...triggerProps}>
              <Icon
                as={MaterialIcons}
                name="more-vert"
                size="6"
                color="coolGray.500"
              />
            </Pressable>;
            }}
          >                
            <Menu.Item onPress={() => {sendToken()}}><Text>{translations[language].TokenItem.send_token_button}</Text></Menu.Item>   
            <Menu.Item onPress={() => {removeToken()}}><Text>{translations[language].TokenItem.delete_button}</Text></Menu.Item>             
          </Menu>
       </Tooltip>
     </HStack>
   </HStack>
  )
}