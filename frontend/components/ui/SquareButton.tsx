import { MaterialIcons } from "@expo/vector-icons";
import { Text, Button, useColorMode, IButtonProps, Icon } from "native-base";
import { Color } from "../../../GlobalStyles";


export default function SquareButton({ buttonText, onPress, icon, ...props }: { buttonText: string, onPress: any, icon: string, [key: string]: any }) {
  return (
    <Button
      variant="solid"
      backgroundColor={'gray.700'}
      _stack={{
        flexDirection: 'column'
      }}
      flex={.20}
      startIcon={
        <Icon
          as={MaterialIcons}
          name={icon}
          color={'white'}
          size={7}
        />
      }
      _text={{
        color: 'white'
      }}
      paddingY={4}
      paddingX={3}
      borderRadius={10}
      onPress={onPress}
    >
      <Text color={'white'} fontSize={12}>{buttonText}</Text>
    </Button>
  )
}
