import { Box, Button, Center, Text, useToast } from "native-base";
import React, { useEffect } from "react";

export default function ErrorToast({errorMessage}) {
  const toast = useToast();
  return (
    <Center>
      {
        toast.show({
          render: () => {
            return (
              <Box bg='error.400' px="2" py="1" rounded="sm" mb={5}>
                <Text>{errorMessage}</Text>
              </Box>
            )
          }
        })
      }
      
    </Center>
  )
 
}