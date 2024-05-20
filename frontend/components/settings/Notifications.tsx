import { MaterialIcons } from "@expo/vector-icons";
import {
  IconButton,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";


export default function SelectLanguage() {

  return (
    <VStack>
      {
        // TODO: Style notification badge
      }
      <IconButton colorScheme={'dark'} key={'test1'} variant={'ghost'} _icon={{
        as: MaterialIcons,
        name: "notifications"
      }} />
    </VStack>

  );
}

