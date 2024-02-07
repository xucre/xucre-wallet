import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, BigNumberish, ethers, getDefaultProvider, Wallet } from "ethers";
import { Avatar, HStack, Icon, IconButton, Menu, Pressable, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, { createRef, useEffect, useState } from "react";
import { useRecoilState } from "recoil";


import erc20Abi from '../../../contracts/erc20.abi.json';
import translations from "../../assets/translations";
import { activeNetwork, activeWallet } from "../../service/state";
import { language as stateLanguage } from "../../service/state";
import { Token } from "../../service/token";
import { isSVGFormatImage, truncateString } from "../../service/utility";
import { coinIconNames, tokenIconNames } from '../../store/network';
import { deleteToken } from "../../store/token";
import { NavigationState } from "@react-navigation/native";
import { WalletInternal } from "../../store/wallet";
import { SvgUri } from "react-native-svg";
import { iconBackground } from "../../assets/styles/themeContext";

export default function TokenItem({ navigation, token, refreshList, wallet }: { navigation: { navigate: Function }, token: Token, refreshList: Function, wallet: Wallet }) {
  const { colorMode } = useColorMode();
  const [network,] = useRecoilState(activeNetwork);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [language,] = useRecoilState(stateLanguage);
  const [avatar, setAvatar] = useState('');
  const [rawAmount, setRawAmount] = useState(BigNumber.from(0));

  useEffect(() => {
    if (token.chainId && token.type === 'coin' && coinIconNames[token.chainId as keyof typeof coinIconNames]) {
      setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + coinIconNames[token.chainId as keyof typeof coinIconNames].toLowerCase() + '.png');
    } else if (token.chainId && token.type === 'token' && tokenIconNames[(token.chainId + '-' + token.address.toLowerCase()) as keyof typeof tokenIconNames]) {
      setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + tokenIconNames[(token.chainId + '-' + token.address.toLowerCase()) as keyof typeof tokenIconNames].toLowerCase() + '.png');
    } else {
      //setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/placeholdericon.png');
    }

    if (!token.amount || token.amount.isZero()) {
      getRawBalance();
    }
    //setAvatar('');
  }, [token])

  const getRawBalance = async () => {
    const erc20 = new ethers.Contract(ethers.utils.getAddress(token.address), erc20Abi, wallet);
    const walletBalance = await erc20.balanceOf(ethers.utils.getAddress(wallet.address));
    //console.log('raw balance', walletBalance, ethers.utils.getAddress(wallet.address));
    setRawAmount(walletBalance);
  }

  /*const removeToken = async () => {
    const result = await deleteToken(token);
    refreshList();
  }*/

  const CustomIcon = ({ data, size }: { data: any, size: number }): JSX.Element => {
    return <SvgUri
      width={size}
      height={size}
      uri={data}
    />
  }

  const TokenIcon = ({ iname }: { iname: string }) => {
    const icon_color = colorMode === 'dark' ? 'white' : 'black';
    const isSvg = isSVGFormatImage(token.logo || avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png');

    return (
      <>
        {isSvg &&
          <Avatar bg="transparent" mr="1" size={10}>
            <CustomIcon data={token.logo || avatar} size={40} />
          </Avatar>
        }
        {!isSvg &&
          <Avatar bg="transparent" mr="1" source={{
            uri: token.logo || avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
          }} size={10}>
            <Text>{iname}</Text>
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
              {token.symbol || token.name || 'N/A'}
            </Text>
          </Pressable>
        </VStack>
      </HStack>
      <HStack alignItems="center" space={{ base: 2 }}>
        <Text
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          fontWeight="normal">{token.amount ? ethers.utils.formatEther(token.amount as BigNumberish || rawAmount) : !rawAmount.isZero() ? ethers.utils.formatEther(rawAmount) : '0.00'}</Text>
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
            {/*<Menu.Item onPress={() => { removeToken() }}><Text>{translations[language as keyof typeof translations].TokenItem.delete_button}</Text></Menu.Item>*/}
          </Menu>
        </Tooltip>
      </HStack>
    </HStack>
  )
}