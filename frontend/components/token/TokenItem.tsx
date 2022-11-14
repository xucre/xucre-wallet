import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from "ethers";
import { Avatar, HStack, Icon,  IconButton, Menu, Pressable, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, {createRef, useEffect, useState} from "react";
import { useRecoilState } from "recoil";

import erc20Abi from '../../../contracts/erc20.json';
import { activeNetwork, activeWallet } from "../../service/state";
import { Token } from "../../service/token";
import { truncateString } from "../../service/utility";
import { iconNames } from '../../store/network';

export default function TokenItem ({navigation, token}) {
  const { colorMode } = useColorMode();
  const [network, setNetwork] = useRecoilState(activeNetwork);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);
  const [amount, setAmount] = useState(BigNumber.from(0))
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);

  useEffect(() => {
    if (_wallet.name != '' && network) {
      const _provider = getDefaultProvider(network.rpcUrl);
      if (isComponentMounted) {
        setProvider(_provider);
      }      
      const newWallet = _wallet.wallet.connect(_provider);
      if (isComponentMounted) {
        setWallet(newWallet);
      }
    }
  }, [_wallet, network]);

  useEffect(() => {
    const runAsync = async () => {
      try {
        if (token.type === 'coin' && provider.getBlockNumber) {
          const currentBlock = await provider.getBlockNumber();
          if (wallet.address && currentBlock > 0) {
            const walletBalance = await wallet.getBalance();
            //console.log('balance',walletBalance);
            if (isComponentMounted) {
              setAmount(walletBalance);
            }
          }//
        } else if (token.type === 'token' && wallet.address) {
          const contract = new ethers.Contract(token.address, erc20Abi, provider);
          const balance = await contract.balanceOf((wallet.address));
          if (isComponentMounted) {
            setAmount(balance);
          }
        }        
      } catch (e) {
        console.log(e);
      }
        
      
    }

    runAsync();
  }, [wallet, provider])

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
            return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
              <Icon
                as={MaterialIcons}
                name="more-vert"
                size="6"
                color="coolGray.500"
              />
            </Pressable>;
            }}
          >                
            <Menu.Item onPress={() => {sendToken()}}><Text>{'Send'}</Text></Menu.Item>                
          </Menu>
       </Tooltip>
     </HStack>
   </HStack>
  )
}