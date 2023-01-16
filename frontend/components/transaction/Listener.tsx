import { MaterialIcons } from "@expo/vector-icons";
import { ethers } from 'ethers';
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Box,
  Button,
  Center,
  CloseIcon,
  Divider,
  Drawer,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  Menu,
  MoonIcon,
  Pressable,
  Select,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  useToast,
  VStack,
} from "native-base";
import React, {useEffect, useState} from "react";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import { language as stateLanguage, transactionList } from "../../service/state";
import { Transaction } from "../../service/transaction";
import { updateTransaction } from "../../store/transaction";

export default function Listener () {
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

  const [language, ] = useRecoilState(stateLanguage);
  const [transactions, setTransactionList] = useRecoilState(transactionList);
  const [_transactions, setTransactions] = useState([]);
  const successToast = {
    isClosable: true,
    status: 'success',
    title: translations[language].Listener.success_message,
    variant: "solid",
  };

  const failureToast = {
    isClosable: true,
    status: 'error',
    title: translations[language].Listener.failure_message,
    variant: "solid",
  };
  useEffect(() => {
    const runAsync = async () => {
      if (_transactions.length > 0) {
        const transactionResult = await Promise.all(_transactions.map(async (transaction) => {
          //console.log(transaction);
          const result = await transaction.wait();
          if (result.status === 1) {
            const toastItem = {...successToast, description: transaction.hash, id:transaction.hash};
            toast.show({
              render: ({
                id
              }) => {
                return <ToastAlert id={id} {...toastItem} />;
              }
            });
            const _transaction = {
              blockNumber: result.blockNumber,
              chainId: transaction.chainId,
              data: transaction.data,
              from: transaction.from,
              hash: transaction.hash,
              nonce: transaction.noonce,
              status: 'success',
              submitDate: transaction.submitDate,
              to: transaction.to,
              value: transaction.value,
            } as Transaction;
            //console.log(_transaction, result);
            await updateTransaction(_transaction);
            return _transaction;            
          } else if (result.status === 0) {
            const toastItem = {...failureToast, description: transaction.hash, id:transaction.hash};
            toast.show({
              render: ({
                id
              }) => {
                return <ToastAlert id={id} {...toastItem} />;
              }
            });
            const _transaction = {
              chainId: transaction.chainId,
              data: transaction.data,
              from: transaction.from,
              hash: transaction.hash,
              nonce: transaction.noonce,
              status: 'failure',
              submitDate: transaction.submitDate,
              to: transaction.to,
              value: transaction.value,
            } as Transaction;
            await updateTransaction(_transaction);
            return _transaction;
          }
        }));
        setTransactionList([]);
      }
    }
    runAsync();
  }, [_transactions]);

  useEffect(() => {
    //console.log(transactions);
    setTransactions(transactions);
  }, [transactions])

  const ToastAlert = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    ...rest
  }) => <Alert maxWidth="100%" alignSelf="center" flexDirection="row" status={status ? status : "info"} variant={variant} {...rest}>
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

