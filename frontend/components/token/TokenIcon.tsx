import { Avatar, Badge, HStack, Icon, IconButton, Menu, Pressable, Skeleton, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, { createRef, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { activeWallet } from "../../service/state";
import { Token } from '../../service/token';
import { isSVGFormatImage, truncateString_old } from "../../service/utility";
import { coinIconNames, tokenIconNames } from '../../store/network';
import { SvgUri } from "react-native-svg";
import { Platform } from "react-native"

function TokenIconComponent({ token }: { token: Token }) {
  const { colorMode } = useColorMode();
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [avatar, setAvatar] = useState('');
  const [networkAvatar, setNetworkAvatar] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const runAsyncAvatar = async () => {
      if (token.logo) {
        setAvatar(token.logo);
      }
      if (token && token.chainId && token.type === 'coin' && coinIconNames[token.chainId as keyof typeof coinIconNames]) {
        setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + coinIconNames[token.chainId as keyof typeof coinIconNames].toLowerCase() + '.png');
      } else if (token && token.chainId && token.type === 'token' && tokenIconNames[(token.chainId + '-' + token.address.toLowerCase()) as keyof typeof tokenIconNames]) {
        setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + tokenIconNames[(token.chainId + '-' + token.address.toLowerCase()) as keyof typeof tokenIconNames].toLowerCase() + '.png');
      } else {
        //setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/placeholdericon.png');
      }
      /*if (token) {
        setNetworkAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + coinIconNames[token.chainId as keyof typeof coinIconNames].toLowerCase() + '.png');
      }*/

      if (Platform.OS === 'ios') {
        if (isMounted) setLoading(false);
      }
    }
    runAsyncAvatar();

    return () => { isMounted = false };
  }, [token])

  const CustomIcon = ({ data, size }: { data: any, size: number }): JSX.Element => {
    return <SvgUri
      onLoad={() => { setLoading(false) }}
      width={size}
      height={size}
      uri={data}
    />
  }

  const TokenIconInner = ({ iname }: { iname: string }) => {
    const icon_color = colorMode === 'dark' ? 'white' : 'black';
    //const _img = alchemyMetadata.logo || token.logo || avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/icon-gray.png';
    const _img = avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/icon-gray.png';
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

  return (
    <TokenIconInner iname={token.type == 'coin' && token.chainId ? coinIconNames[token.chainId as keyof typeof coinIconNames] : truncateString_old(token.address, 3) as string} />
  )
}

//const TokenItem = React.memo(TokenItemComponent);
const TokenIcon = TokenIconComponent;
export default TokenIcon;