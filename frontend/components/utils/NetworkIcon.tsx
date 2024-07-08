import {
  Avatar,
  Box,
  Button,
  HamburgerIcon,
  HStack,
  Icon,
  IconButton,
  Image,
  Menu,
  Pressable,
  ScrollView, Text, Tooltip, useColorMode,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
//import FilterListIcon from '@mui/icons-material/FilterList';
import { activeNetwork, language as stateLanguage } from "../../service/state";
import { chainIdToNetworkMap, Network } from "../../service/network";
import NetworkGroup from "../ui/NetworkGroup";

export default function NetworkIcon({ chainId, updateChain }: { chainId: number, updateChain: Function }) {
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const chainIdMap = chainIdToNetworkMap();
  const _activeNetwork = chainId === 0 ? {} as Network : chainIdMap[chainId];
  const avatar = chainId === 0 ? '' : 'https://xucre-public.s3.sa-east-1.amazonaws.com/' + _activeNetwork.symbol.toLowerCase() + '.png';
  const [network, setNetwork] = useRecoilState(activeNetwork);
  //{translations[language].BasePage.title}

  const setChain = (_chainId: number) => {
    if (!_chainId) return;
    const chain = chainIdMap[_chainId];
    if ((network && network.chainId === _chainId)) {
      updateChain(_chainId);
      return;
    }

    setNetwork(chain);
    updateChain(_chainId);
  }
  return (
    <Menu trigger={triggerProps => {
      return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
        {chainId !== 0 ?
          <HStack alignItems={'center'} space={2}>
            <Image
              source={{ uri: avatar }}
              size={10}
              resizeMode="contain"
              alt={_activeNetwork.name}
            />
            <Icon
              as={MaterialIcons}
              name="filter-list"
              size="6"
              color="coolGray.500"
            />
          </HStack> :
          <NetworkGroup />
        }
      </Pressable>;
    }} placement="bottom right" _presenceTransition={{
      initial: { translateX: 50, opacity: 0, scale: 0 },
      animate: {
        opacity: 1, scale: 1, transition: {
          type: "spring",
          bounciness: 5,
          speed: 2,
          delay: 0,
          duration: 2,
          useNativeDriver: true,
        }
      },
      exit: {
        opacity: 0, scale: 0, translateX: 50, transition: {
          type: "spring",
          bounciness: 5,
          speed: 1,
          delay: 0,
          duration: 2,
          useNativeDriver: true,
        }
      }
    }}>
      <Menu.Item key={0} onPress={() => setChain(0)}>All</Menu.Item>
      {
        Object.keys(chainIdMap).map((chainId) => {
          return <Menu.Item textAlign={'right'} key={chainId} onPress={() => setChain(Number(chainId))} >
            {chainIdMap[Number(chainId)].name}
          </Menu.Item>
        })
      }
    </Menu>

  );
}