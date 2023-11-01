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

function NftItemSmall({item}) {
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
    setChannelMetadata(item);
    setUrl(item.url);
  }, [item]);


  const accessLink = async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    }
  }

  const BetterCard = ({image, title, subtitle, projectName }) => {
    return (
      <Pressable 
        borderRadius="sm"
        padding={0}
        pt={0}
        width={{ base: 120, md: 250 }}
        mb={0}
        textAlign={'center'}
        _light={{ bg: 'transparent' }}
        _dark={{ bg: 'transparent' }}
        onPress={accessLink}
      > 
        <Avatar bg="transparent" alignSelf="center" size="lg" source={{
          uri: image
        }}></Avatar>
        
        <Box
          borderRadius="sm"
          p={3}
          pt={4}
          bg={'transparent'}
        >
          <Text
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.100' }}
            fontSize="md"
            fontWeight="medium"
            textAlign={'center'}
          >
            {title}
          </Text>
          <Text 
            fontSize="md" 
            _light={{ color: 'coolGray.600' }}
            _dark={{ color: 'coolGray.400' }}
            textAlign={'center'}
          >
            {projectName}
          </Text>
        </Box>
      </Pressable>
    );
  }

  return (
    <Box m={0}>
      {
        metadata.name != null && 
        <BetterCard
          title={metadata.name}
          subtitle={metadata.description}
          image={
            metadata.image
          }
          projectName={
            metadata.key
          }
        />
      }
    </Box>
    
  );
}

export default NftItemSmall;
