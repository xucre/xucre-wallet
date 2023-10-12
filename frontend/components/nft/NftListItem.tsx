import { MaterialIcons } from "@expo/vector-icons";
import { ethers } from "ethers";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  FlatList,
  Hidden,
  HStack,
  Icon,
  IconButton,
  IIconProps,
  Image,
  Menu,
  Pressable,
  Text,
  Tooltip,
  VStack,
} from 'native-base';
import React, { useCallback , useEffect, useState } from 'react';
//import Icon from "react-crypto-icons";
import { Dimensions, ImageSourcePropType, Linking, TouchableWithoutFeedback } from 'react-native';
import { Card, Paragraph, Title,  } from 'react-native-paper';
//import SvgUri from 'react-native-svg-uri';

import ArbLogo from '../../assets/images/arb_logo.png';
import EthLogo from '../../assets/images/eth_logo.png';
import OptLogo from '../../assets/images/op_logo.png';
import PlyLogo from '../../assets/images/poly_logo.png';
import translations from "../../assets/translations";
import { getMetadata } from "../../service/blockdaemon";
import { language } from "../../service/state";
import { cleanImageUrl, truncateString } from '../../service/utility';

type CarousalType = {
  readonly imageUri: ImageSourcePropType;
  readonly name: string;
};

function NftListItem({contract, token, chain}) {
  //`const theme = useTheme();
  const [metadata, setChannelMetadata] = useState({description : '', image: '', key: '', name : '', subtitle: ''});
  const [url, setUrl] = useState('');
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false)
    }
  }, []);
  

  useEffect(() => {
    retrieveMetadata();
  }, []);

  const retrieveMetadata = async () => {
    const result = await getMetadata(contract, token, chain);
    
    setChannelMetadata({
      description: result.token_description,
      image: result.cached_images.small_250_250,
      key: `${result.contract_address}/${result.id}`,
      name: result.token_name,
      subtitle: result.token_type,
    })
    setUrl(`https://opensea.io/assets/ethereum/${result.contract_address}/${result.id}`);
  }

  const accessLink = async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    }
  }

  const ListItem = ({image, title, subtitle, contract }) => {
    return (
      <HStack alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <Avatar bg="transparent" alignSelf="center" size="md" source={{
            uri: image
          }}></Avatar>
          <VStack>
              <Text fontSize="md" bold>
                {title}
              </Text>
              
              <Text 
                fontSize="md" 
                _light={{ color: 'coolGray.600' }}
                _dark={{ color: 'coolGray.400' }}
              >
                {subtitle}
              </Text>
          </VStack>
        </HStack>
        <HStack alignItems="center" space={{ base: 2 }}>
          <Text 
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
              fontWeight="normal">{truncateString(contract, 3, false)}</Text>
          <Tooltip label="More Options" openDelay={500}>
              <Menu w="190" trigger={triggerProps => {
                return <Pressable accessibilityLabel={'Options'} {...triggerProps}>
                  <Icon
                    as={MaterialIcons}
                    name="more-vert"
                    size="6"
                    color="coolGray.500"
                  />
                </Pressable>;
                }}
              >                
                <Menu.Item onPress={accessLink}><Text>{'OpenSea'}</Text></Menu.Item>                
              </Menu>
          </Tooltip>
        </HStack>
      </HStack>
    );
  }

  return (
    <>
      {
        metadata.name != null && 
        <ListItem
          title={metadata.name}
          subtitle={metadata.subtitle}
          image={
            metadata.image
          }
          contract={
            metadata.key
          }
        />
      }
    </>
    
  );
}

export default NftListItem;
