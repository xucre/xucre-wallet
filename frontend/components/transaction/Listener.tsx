import {
  Alert,
  CloseIcon,
  HStack,
  IconButton,
  Text,
  useColorMode,
  useToast,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import { language as stateLanguage, transactionList } from "../../service/state";
import { Transaction } from "../../service/transaction";
import { updateTransaction } from "../../store/transaction";

export default function Listener() {
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const toast = useToast();
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);

  const {
    colorMode
  } = useColorMode();

  const [language,] = useRecoilState(stateLanguage);
  const [transactions, setTransactionList] = useRecoilState(transactionList);
  const [_transactions, setTransactions] = useState([] as any[]);
  const successToast = {
    isClosable: true,
    status: 'success',
    title: translations[language as keyof typeof translations].Listener.success_message,
    variant: "solid",
  };

  const failureToast = {
    isClosable: true,
    status: 'error',
    title: translations[language as keyof typeof translations].Listener.failure_message,
    variant: "solid",
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) setTransactions(transactions);
    return () => { isMounted = false }
  }, [transactions])

  const ToastAlert = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable
  }: {
    id: any;
    status: string | (string & {}) | undefined;
    variant: string | ("solid" | "outline" | (string & {}) | "subtle" | "left-accent" | "top-accent" | "outline-light" | null)[] | { base?: "solid" | "outline" | (string & {}) | "subtle" | "left-accent" | "top-accent" | "outline-light" | undefined; sm?: "solid" | "outline" | (string & {}) | "subtle" | "left-accent" | "top-accent" | "outline-light" | undefined; md?: "solid" | "outline" | (string & {}) | "subtle" | "left-accent" | "top-accent" | "outline-light" | undefined; lg?: "solid" | "outline" | (string & {}) | "subtle" | "left-accent" | "top-accent" | "outline-light" | undefined; xl?: "solid" | "outline" | (string & {}) | "subtle" | "left-accent" | "top-accent" | "outline-light" | undefined; '2xl'?: "solid" | "outline" | (string & {}) | "subtle" | "left-accent" | "top-accent" | "outline-light" | undefined; } | null | undefined;
    title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
    description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
    isClosable: any;
  }
  ) => <Alert maxWidth="100%" alignSelf="center" flexDirection="row" status={status ? status : "info"} variant={variant}>
      <VStack space={1} flexShrink={1} w="100%">
        <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text fontSize="md" fontWeight="medium" flexShrink={1} color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
              {title}
            </Text>
          </HStack>
          {isClosable ? <IconButton variant="unstyled" icon={<CloseIcon size="3" />} _icon={{
            color: variant === "solid" ? "lightText" : "darkText"
          }} onPress={() => toast.close(id)} /> : null}
        </HStack>
        <Text px="6" color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
          {description}
        </Text>
      </VStack>
    </Alert>;

  return (
    <>

    </>

  );
}

