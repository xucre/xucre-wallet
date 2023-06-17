import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from "ethers";
import moment from 'moment';
import { Avatar, Box, HStack, Icon,  IconButton, Menu, Pressable, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, {createRef, useEffect, useState} from "react";
import { Linking } from "react-native";
import { useRecoilState } from "recoil";

import { activeNetwork } from "../../service/state";
import { truncateString } from "../../service/utility";

export default function CovalentItem ({navigation, transaction}) {
  const { colorMode } = useColorMode();

  const [network, ] = useRecoilState(activeNetwork);
  const openTransaction = () => {
    console.log(network.blockExplorer+'tx/'+transaction.hash);
    Linking.openURL(network.blockExplorer+'tx/'+transaction.tx_hash);
  }

  useEffect(() => {
    //console.log(transaction);
  }, [])
  
  return (
    <HStack alignItems="center" justifyContent="space-between">
     <HStack alignItems="center" space={{ base: 3, md: 6 }}>
       <VStack>
         <Pressable onPress={() => {openTransaction()}}>
           <Text fontSize="md" bold>
              { transaction.block_signed_at && transaction.block_signed_at !== '' && 
                <>{moment(transaction.block_signed_at).fromNow()}</>}
              {!transaction.block_signed_at &&
                <>{truncateString(transaction.tx_hash, 15)}</>}
           </Text>
         </Pressable>
       </VStack>
     </HStack>
     <HStack alignItems="center" space={{ base: 2 }}>

        <Box alignSelf="center" // bg="primary.500"
          rounded={"md"}
          p={1}
          bg={(!transaction.successful) ? 'error.500': 'success.500'}>
          <Text 
           _light={{ color: 'coolGray.100' }}
           _dark={{ color: 'coolGray.100' }}
           rounded={'md'}
           fontWeight="normal">{transaction.successful ? 'Success' : 'Failure'}</Text>
        </Box>
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
            <Menu.Item onPress={() => {openTransaction()}}><Text>{'Open'}</Text></Menu.Item>                
          </Menu>
        </Tooltip>    
     </HStack>
   </HStack>
  )
}