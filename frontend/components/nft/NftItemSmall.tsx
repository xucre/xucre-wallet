import {
  Avatar,
  Box,
  Pressable,
  Text,
  Image,
  Skeleton,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { ImageSourcePropType, Linking } from 'react-native';
import { NFT } from '../../types/nft';

type CarousalType = {
  readonly imageUri: ImageSourcePropType;
  readonly name: string;
};

function NftItemSmallComponent({ item }: { item: NFT }) {
  //`const theme = useTheme();
  const [metadata, setChannelMetadata] = useState({ description: '', image: '', key: '', name: '' });
  const [url, setUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      if (isMounted) setUrl(item.url);
      if (item.image.length > 0) {
        await Image.prefetch(item.image);
        if (isMounted) setChannelMetadata(item);
      } else {
        if (isMounted) setChannelMetadata({ ...item, image: 'https://xucre-public.s3.sa-east-1.amazonaws.com/icon-green.png' });
      }
    }
    runAsync();
    return () => {
      isMounted = false;
    }
  }, [item]);


  const accessLink = async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    }
  }

  const BetterCard = ({ image, title, subtitle, projectName }: { image: string, title: string, subtitle: string, projectName: string }) => {
    return (
      <Pressable
        borderRadius="sm"
        padding={0}
        mb={0}
        pt={0}
        width={150}
        textAlign={'center'}
        _light={{ bg: 'transparent' }}
        _dark={{ bg: 'transparent' }}
        onPress={accessLink}
      >
        {image.length > 0 ?
          <Avatar bg="transparent" alignSelf="center" size="lg" source={{
            uri: image
          }}></Avatar>
          : <Skeleton rounded="full" alignSelf="center" size="10" />
        }

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
          {/*<Text
            fontSize="md"
            _light={{ color: 'coolGray.600' }}
            _dark={{ color: 'coolGray.400' }}
            textAlign={'center'}
          >
            {projectName}
          </Text>*/}
        </Box>
      </Pressable>
    );
  }

  return (
    <>
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
    </>

  );
}

const NftItemSmall = React.memo(NftItemSmallComponent);
export default NftItemSmall;