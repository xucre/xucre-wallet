import {
  Avatar,
  Box,
  Button,
  HamburgerIcon,
  HStack,
  Icon,
  IconButton,
  Menu,
  Pressable,
  ScrollView, Text, Tooltip, useColorMode,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import * as Clipboard from 'expo-clipboard';
import { useRecoilState } from "recoil";
//import FilterListIcon from '@mui/icons-material/FilterList';
import { activeNetwork, language as stateLanguage } from "../../service/state";
import { chainIdToNetworkMap } from "../../service/network";

export default function NetworkFilter({ chainId, updateChain }: { chainId: number, updateChain: Function }) {
  const [language,] = useRecoilState(stateLanguage);
  const { colorMode } = useColorMode();
  const chainIdMap = chainIdToNetworkMap();
  const [network, setNetwork] = useRecoilState(activeNetwork);
  //{translations[language].BasePage.title}

  const setChain = (chainId: number) => {
    const chain = chainIdMap[chainId];
    if (network.chainId === chainId) {
      return;
    }
    setNetwork(chain);
    updateChain(chainId);
  }
  return (
    <HStack justifyContent={'flex-end'} px={1} mb={-1} mt={-2}>
      <Menu trigger={triggerProps => {
        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
          {
            chainId === 0 ?
              <Icon
                as={MaterialIcons}
                name="filter-list"
                size="6"
                color="coolGray.500"
              /> :
              <Icon
                as={MaterialIcons}
                name="filter-list-alt"
                size="6"
                color="coolGray.500"
              />
          }
        </Pressable>;
      }} placement="bottom right" _presenceTransition={{
        initial: { translateX: 50, opacity: 0, scale: 0 },
        animate: {
          opacity: 1, scale: 1, transition: {
            type: "spring",
            //easing: (value: number) => number,
            //overshootClamping?: boolean,
            //restDisplacementThreshold?: number,
            //restSpeedThreshold?: number,
            //velocity?: number | { x: number, y: number },
            bounciness: 5,
            speed: 2,
            //tension?: number,
            //friction?: number,
            //stiffness?: number,
            //mass?: number,
            //damping?: number,
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
      </Menu></HStack>
  );
}