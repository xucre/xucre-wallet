import { MaterialIcons } from "@expo/vector-icons";
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
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, { useCallback , useEffect, useState } from 'react';
import { Dimensions, ImageSourcePropType, Linking, TouchableWithoutFeedback } from 'react-native';
import { Card, Paragraph, Title,  } from 'react-native-paper';
//import SvgUri from 'react-native-svg-uri';

import ArbLogo from '../../assets/images/arb_logo.png';
import EthLogo from '../../assets/images/eth_logo.png';
import OptLogo from '../../assets/images/op_logo.png';
import PlyLogo from '../../assets/images/poly_logo.png';
import { getMetadata } from "../../service/blockdaemon";
import { cleanImageUrl, truncateString } from '../../service/utility';

type CarousalType = {
  readonly imageUri: ImageSourcePropType;
  readonly name: string;
};

function NftCard({contract, token, chain}) {
  //`const theme = useTheme();
  const [metadata, setChannelMetadata] = useState({description : '', image: '', key: '', name : ''});
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
      name: result.token_name
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

  const AvatarImage = (props) =>  {
    if (!chain) {
      return (
        <>
          <Avatar size={10} {...props}  bg="amber.500" >
            <Text>0x</Text>      
          </Avatar>
        </>
        
      )
    } else {
      return (
        <Avatar size={'sm'} {...props} 
          _light={{
            bg: 'coolGray.200'
          }} 
          _dark={{
            bg: 'coolGray.400'
          }} 
          source={
            chain === 'arbitrum-main' ? ArbLogo :
            chain === 'eth-main' ? EthLogo :
            chain === 'optimism-main' ? OptLogo :
            chain === 'poly-main' ? PlyLogo :
            null
          } />
      )
    }
  };
  const BetterCard = ({image, title, subtitle }) => {
    return (
      <Pressable 
        borderRadius="sm"
        padding={0}
        pt={0}
        mx={1}
        width={{ base: 180, md: 250 }}
        _light={{ bg: 'coolGray.100' }}
        _dark={{ bg: 'coolGray.700' }}
        onPress={accessLink}
      > 
        {
          <Badge 
          rounded="full" mt={-5} mb={-4} mr={-4} zIndex={1} size={5} top={200} variant="ghost" alignSelf="flex-start" position='relative' left="0">
            <AvatarImage />
          </Badge>
        }
        
        <Image
          borderTopRadius="sm"
          source={{
            uri: image
          }}
          alt={title}
          w={{ base: 192, md: 224 }}
          h={200}
          mt={0}
        />
        <Box
          borderRadius="sm"
          p={3}
          pt={4}
          _light={{ bg: 'coolGray.100' }}
          _dark={{ bg: 'coolGray.700' }}
        >
          <Text
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.50' }}
            fontSize="xs"
          >
            Test
          </Text>
          <Text
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.100' }}
            fontSize="md"
            fontWeight="medium"
          >
            {title}
          </Text>

          
        </Box>
      </Pressable>
    );
  }

  return (
    <Box pt={0} mt={0} mx={'auto'}>
      {
        metadata.name != null && 
        <BetterCard
          title={metadata.name}
          subtitle={metadata.description}
          image={
            metadata.image
          }
        />
      }
    </Box>
    
  );
}

export default NftCard;
