import { MaterialIcons } from "@expo/vector-icons";
import {
  Avatar,
  HStack,
  Icon,
  Menu,
  Pressable,
  Text,
  Tooltip,
  VStack,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { ImageSourcePropType, Linking } from 'react-native';
//import SvgUri from 'react-native-svg-uri';

import { getMetadata } from "../../service/blockdaemon";
import { truncateString } from '../../service/utility';

type CarousalType = {
  readonly imageUri: ImageSourcePropType;
  readonly name: string;
};

function NftListItem({contract, token, chain}: {contract: string, token: string, chain: string}) {
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

  const ListItem = ({image, title, subtitle, contract }: {image: string, title: string, subtitle: string, contract: string}) => {
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
