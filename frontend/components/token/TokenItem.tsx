import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, BigNumberish, ethers, getDefaultProvider, Wallet } from "ethers";
import { Avatar, Badge, HStack, Icon, IconButton, Menu, Pressable, Skeleton, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, { createRef, useEffect, useState } from "react";
import { useRecoilState } from "recoil";


import erc20Abi from '../../../contracts/erc20.abi.json';
import translations from "../../assets/translations";
import { activeNetwork, activeWallet } from "../../service/state";
import { language as stateLanguage } from "../../service/state";
import { SerializedToken, Token, TokenPrice } from '../../service/token';
import { isSVGFormatImage, truncateString_old } from "../../service/utility";
import { coinIconNames, tokenIconNames } from '../../store/network';
import { SvgUri } from "react-native-svg";
import { getTokenMetadata } from "../../service/api";
import { chainIdToNameMap } from "../../service/constants";
import { addToSpam, isSpam } from "../../store/spam";
import { AlchemyMetadata } from "../../types/token";
import { Platform } from "react-native";
import { useConversionRate } from "../../hooks/useConversionRate";
import { CURRENCY_SYMBOLS } from "../../data/CurrencyData";
import currency from "currency.js";
import { retrieveTokenMetadata, retrieveTokenSpamState, storeTokenMetadata, storeTokenSpamState } from "../../store/tokenItem";

function TokenItemComponent({ navigation, token, refreshList, wallet, price }: { navigation: { navigate: Function }, token: Token, refreshList: Function, wallet: Wallet, price: { [key: number]: { [key: string]: TokenPrice } } | null }) {
  const { colorMode } = useColorMode();
  const { conversionRate } = useConversionRate();
  const [network,] = useRecoilState(activeNetwork);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [language,] = useRecoilState(stateLanguage);
  const [avatar, setAvatar] = useState('');
  const [networkAvatar, setNetworkAvatar] = useState('');
  const [rawAmount, setRawAmount] = useState(BigNumber.from(0));
  const [alchemyMetadata, setAlchemyMetadata] = useState({} as AlchemyMetadata);
  const [loading, setLoading] = useState(true);
  const [amISpam, setAmISpam] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const runAsyncAvatar = async () => {
      if (token && token.chainId && token.type === 'coin' && coinIconNames[token.chainId as keyof typeof coinIconNames]) {
        setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + coinIconNames[token.chainId as keyof typeof coinIconNames].toLowerCase() + '.png');
      } else if (token && token.chainId && token.type === 'token' && tokenIconNames[(token.chainId + '-' + token.address.toLowerCase()) as keyof typeof tokenIconNames]) {
        setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + tokenIconNames[(token.chainId + '-' + token.address.toLowerCase()) as keyof typeof tokenIconNames].toLowerCase() + '.png');
      } else {
        //setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/placeholdericon.png');
      }
      if (token) {
        setNetworkAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + coinIconNames[token.chainId as keyof typeof coinIconNames].toLowerCase() + '.png');
      }

      if (Platform.OS === 'ios') {
        if (isMounted) setLoading(false);
      }
    }
    const runAsyncMetadata = async () => {
      const _metadata = await getMetadata(false);
      if (isMounted) setAlchemyMetadata(_metadata as AlchemyMetadata);
    }
    const runAsyncRawSpam = async () => {
      const _spam = await _isSpam(false);
      if (isMounted) setAmISpam(_spam);
    }
    runAsyncAvatar();
    runAsyncMetadata();
    runAsyncRawSpam();

    return () => { isMounted = false };
  }, [token])

  const getMetadata = async (save: boolean) => {
    const existingResult = await retrieveTokenMetadata(token.address, token.chainId);
    if (existingResult && existingResult.name) {
      if (save) setAlchemyMetadata(existingResult as AlchemyMetadata);
      return existingResult;
    }
    const result = await getTokenMetadata(token.address, chainIdToNameMap[token.chainId as keyof typeof chainIdToNameMap]);
    if (save) setAlchemyMetadata(result as AlchemyMetadata);
    await storeTokenMetadata(token.address, token.chainId, result as AlchemyMetadata)
    return result;
  }

  const _isSpam = async (save: boolean) => {
    //return false;
    if (!token.chainId) return false;
    if (token.type === 'coin') {
      if (save) setAmISpam(false);
      return false;
    }
    const existingResult = await retrieveTokenSpamState(token.address, token.chainId);
    if (existingResult) {
      if (save) setAmISpam(existingResult);
      return existingResult;
    }
    const result = await isSpam(token.address, token.chainId);
    if (save) setAmISpam(result);
    await storeTokenSpamState(token.address, token.chainId, result)
    return result;
  }

  const CustomIcon = ({ data, size }: { data: any, size: number }): JSX.Element => {
    return <SvgUri
      onLoad={() => { setLoading(false) }}
      width={size}
      height={size}
      uri={data}
    />
  }

  const TokenIcon = ({ iname }: { iname: string }) => {
    const icon_color = colorMode === 'dark' ? 'white' : 'black';
    //const _img = alchemyMetadata.logo || token.logo || avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/icon-gray.png';
    const _img = alchemyMetadata?.logo || avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/icon-gray.png';
    try {
      const isSvg = isSVGFormatImage(_img);
      return (
        <>
          {loading &&
            <Skeleton rounded={'full'} size={10} fadeDuration={1} />
          }
          {isSvg &&
            <Avatar _image={{ onLoadEnd: () => { setLoading(false) } }} style={{ "display": loading ? 'none' : 'flex' }} bg="transparent" mr="1" size={10}>
              <CustomIcon data={_img} size={40} />
            </Avatar>
          }
          {!isSvg &&
            <Avatar _image={{ onLoadEnd: () => { setLoading(false) } }} style={{ "display": loading ? 'none' : 'flex' }} bg="transparent" mr="1" source={{
              uri: _img
            }} size={10}>
              <Text>{iname}</Text>
            </Avatar>
          }
          {networkAvatar !== _img && <Avatar source={{ uri: networkAvatar }} size={4} mb={-4} ml={-4} zIndex={10000} alignContent={'end'} />}
        </>


        //<Icon name="poly" style={{ alignSelf: 'center', color: icon_color, fontSize: 25, justifyContent: 'center',marginBottom:0, marginTop:-100,  }}/>
      )
    } catch {
      return <Avatar _image={{ onLoadEnd: () => { setLoading(false) } }} style={{ "display": loading ? 'none' : 'flex' }} bg="transparent" mr="1" source={{
        uri: 'https://xucre-public.s3.sa-east-1.amazonaws.com/icon-gray.png'
      }} size={10}>
        <Text>{iname}</Text>
      </Avatar>
    }

  }

  const sendToken = () => {
    navigation.navigate('SendToken', { token: { ...token, amount: token.amount?.toString() || rawAmount.toString(), decimals: alchemyMetadata?.decimals || 18 } as SerializedToken })
  }

  const viewToken = () => {
    navigation.navigate('ViewToken', { token: { ...token, amount: token.amount?.toString() || rawAmount.toString(), decimals: alchemyMetadata?.decimals || 18 } as SerializedToken })
  }

  const blacklistToken = async () => {
    await addToSpam(token.address, token.chainId, token);
    refreshList();
  }

  const computedSymbol = alchemyMetadata?.symbol ? truncateString_old(alchemyMetadata.symbol, 8) : (token?.symbol || token?.name || 'N/A');
  const convertedValue = () => {
    const ethersValue = Number(ethers.utils.formatUnits(token.amount as BigNumberish || rawAmount, alchemyMetadata?.decimals || 18));
    const tokenPrice = price && token.chainId && price[token.chainId] ? price[token.chainId][`${token.address.toLowerCase()}:${token.chainId}`]?.price || 0 : 0;
    const usdValue = ethersValue * tokenPrice;
    if (conversionRate && conversionRate.value) {
      const _convertedValue = usdValue * conversionRate.value;
      return currency(_convertedValue, { precision: 2, symbol: CURRENCY_SYMBOLS[conversionRate.currency as keyof typeof CURRENCY_SYMBOLS] }).format();
    }

    return currency(usdValue, { precision: 2 }).format();
  }
  const convertedAmount = () => {
    return token.amount ? ethers.utils.formatUnits(token.amount as BigNumberish || rawAmount, alchemyMetadata?.decimals || 18) : !rawAmount.isZero() ? ethers.utils.formatUnits(rawAmount, alchemyMetadata?.decimals || 18) : '0.00';
  }
  if (amISpam) return <></>

  return (
    <HStack alignItems="center" justifyContent="space-between" py={2}>
      <Pressable onPress={() => { viewToken() }}>
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <TokenIcon iname={token.type == 'coin' && token.chainId ? coinIconNames[token.chainId as keyof typeof coinIconNames] : truncateString_old(token.address, 3) as string} />
          <VStack>
            <Text fontSize="md" bold>
              {computedSymbol}
            </Text>
          </VStack>
        </HStack>
      </Pressable>
      <HStack alignItems="center" space={{ base: 2 }}>
        <VStack>
          <Text
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            fontWeight="bold">{convertedAmount()}</Text>
          <Text
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            fontWeight="normal"
            textAlign={'right'}
          >{convertedValue()}</Text>
        </VStack>
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
            <Menu.Item onPress={() => { blacklistToken() }}><Text>{translations[language as keyof typeof translations].TokenItem.blacklist_button}</Text></Menu.Item>
            {/*<Menu.Item onPress={() => { removeToken() }}><Text>{translations[language as keyof typeof translations].TokenItem.delete_button}</Text></Menu.Item>*/}
          </Menu>
        </Tooltip>
      </HStack>
    </HStack>
  )
}

//const TokenItem = React.memo(TokenItemComponent);
const TokenItem = TokenItemComponent;
export default TokenItem;