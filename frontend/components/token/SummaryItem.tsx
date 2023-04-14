import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from "ethers";
import { Avatar, HStack, Icon,  IconButton, Menu, Pressable, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, {createRef, useEffect, useState} from "react";
import { useRecoilState } from "recoil";

import erc20Abi from '../../../contracts/erc20.json';
import translations from "../../assets/translations";
import { getIconImage } from "../../service/api";
import { activeNetwork, activeWallet } from "../../service/state";
import { language as stateLanguage } from "../../service/state";
import { Token } from "../../service/token";
import { truncateString } from "../../service/utility";
import { iconNames } from '../../store/network';

export default function SummaryItem ({token}) {
  const { colorMode } = useColorMode();
  const [amount, setAmount] = useState(BigNumber.from(0));
  const [tokenImage, setTokenImage] = useState('');
  const [language, ] = useRecoilState(stateLanguage);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  useEffect(() => {
    //console.log(tokenImage);
  }, [tokenImage])
  useEffect(() => {
    const runAsync = async () => {
      try {

        const img = await getIconImage(token.contract.ticker_symbol.toLowerCase());
        console.log('image retrieved', img.type);
        const blob = new Blob([img.data], {type: "image/png"})
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(blob); 
        // eslint-disable-next-line functional/immutable-data
        fileReaderInstance.onload = () => {
          //console.log(fileReaderInstance.result);
          setTokenImage(fileReaderInstance.result as string);
        }
        
      } catch (err) {
        console.log('err', err);
      }
    }
    if (token.contract.ticker_symbol) {
      runAsync();
    }
  }, [token])

  const TokenIcon = ({iname}) => {
    //console.log(iname);
    if (
      iname.toLowerCase() === 'matic' ||
      iname.toLowerCase() === 'btc' || 
      iname.toLowerCase() === 'eth'
    ) {
      //
    }
    const icon_color = colorMode ==='dark'? 'white':'black';
    return (
      <>
        {tokenImage !== '' && 
          <Avatar bg="primary.600" mr="1" source={{
              uri: tokenImage
            }}>
              <Text>{iname}</Text>
          </Avatar>
        }
      
      </>
    )
  }

  return (
    <HStack alignItems="center" justifyContent="space-between">
     <HStack alignItems="center" space={{ base: 3, md: 6 }}>
      <TokenIcon iname={token.contract.ticker_symbol}/>
       
       <VStack>
         <Pressable>
           <Text fontSize="md" bold>
             {token.contract.name}
           </Text>
         </Pressable>
       </VStack>
     </HStack>
     <HStack alignItems="center" space={{ base: 2 }}>
       <Text 
           _light={{ color: 'coolGray.500' }}
           _dark={{ color: 'coolGray.400' }}
           fontWeight="normal">{token.mostRecentOpenQuote.quote}</Text>
       
     </HStack>
   </HStack>
  )
}