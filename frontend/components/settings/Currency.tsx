import { MaterialIcons } from "@expo/vector-icons";
import {
  Menu,
  Pressable,
  Text,
  useColorMode,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import { getLanguage, storeLanguage } from "../../store/language";
import { useConversionRate } from "../../hooks/useConversionRate";
import { CURRENCY_SYMBOLS } from "../../data/CurrencyData";
import { v4 } from 'uuid';

const currencies = [
  { name: "ARS", symbol: CURRENCY_SYMBOLS["ARS"] },
  { name: "BOB", symbol: CURRENCY_SYMBOLS["BOB"] },
  { name: "BRL", symbol: CURRENCY_SYMBOLS["BRL"] },
  { name: "CLP", symbol: CURRENCY_SYMBOLS["CLP"] },
  { name: "COP", symbol: CURRENCY_SYMBOLS["COP"] },
  { name: "GTQ", symbol: CURRENCY_SYMBOLS["GTQ"] },
  { name: "MXN", symbol: CURRENCY_SYMBOLS["MXN"] },
  { name: "PAB", symbol: CURRENCY_SYMBOLS["PAB"] },
  { name: "PEN", symbol: CURRENCY_SYMBOLS["PEN"] },
  { name: "USD", symbol: CURRENCY_SYMBOLS["USD"] },
];
export default function Currency() {
  const { conversionRate, setCurrency } = useConversionRate();
  const {
    colorMode
  } = useColorMode();

  const updateCurrency = async (_currency: string) => {
    if (setCurrency) await setCurrency(_currency);
  }
  const currencySymbol = conversionRate && conversionRate.currency ? currencies.find(_currency => _currency.name === conversionRate.currency)?.symbol : "$";

  return (
    <>
      {
        <Menu w="190" trigger={triggerProps => {
          return <Pressable accessibilityLabel="options" {...triggerProps}>
            {
              currencySymbol ?
                <Text fontSize={'xl'} py={'2'}>{currencySymbol}</Text>
                : <Text fontSize={'xl'} py={'2'}>$</Text>
            }
          </Pressable>;
        }}>
          {
            currencies.map((_currency) => {
              return <Menu.Item key={v4()} onPress={() => { updateCurrency(_currency.name) }}><Text>{_currency.symbol} {_currency.name}</Text></Menu.Item>
            })
          }
        </Menu>
      }
    </>

  );
}

