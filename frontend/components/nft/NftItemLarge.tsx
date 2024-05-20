import {
  Box,
  Image,
  Pressable,
  Skeleton,
  Text,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { ImageSourcePropType, Linking } from 'react-native';
//import SvgUri from 'react-native-svg-uri';


type CarousalType = {
  readonly imageUri: ImageSourcePropType;
  readonly name: string;
};

function NftItemLargeComponent({ item }: { item: { description: string, image: string, key: string, name: string, url: string } }) {
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
        pt={0}
        mx={1}
        mb={5}
        _light={{ bg: 'transparent' }}
        _dark={{ bg: 'transparent' }}
        onPress={accessLink}
      >
        {image.length > 0 ?
          <Image
            borderTopLeftRadius="md"
            borderBottomRadius="md"
            source={{
              uri: image || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
            }}
            alt={title}
            w={{ base: 192, md: 224 }}
            h={200}
            mt={0}
          /> : <Skeleton h={200} w={{ base: 180, md: 200 }} mt={0} borderTopLeftRadius="md" borderBottomRadius="md" />
        }

        <Box
          borderRadius="sm"
          p={3}
          mb={0}
          pb={0}
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
            mb={0}
            pb={0}
          >
            {projectName}
          </Text>
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

const NftItemLarge = React.memo(NftItemLargeComponent);
export default NftItemLarge;