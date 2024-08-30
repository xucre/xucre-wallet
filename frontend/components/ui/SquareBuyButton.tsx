import { MaterialIcons } from "@expo/vector-icons";
import { Text, Button, useColorMode, IButtonProps, Icon, Menu } from "native-base";
import { Color } from "../../../GlobalStyles";
import { Chain } from "../../types/token";


export default function SquareBuyButton({ buttonText, onPress, icon, ...props }: { buttonText: string, onPress: any, icon: string, [key: string]: any }) {
  return (
    <Menu w="190" trigger={triggerProps => {
      return <Button
        {...triggerProps}
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
      >
        <Text color={'white'} fontSize={12}>{buttonText}</Text>
      </Button>
    }}>
      <Menu.Item onPress={() => onPress(Chain.ETHEREUM)}>{Chain.ETHEREUM}</Menu.Item>
      <Menu.Item onPress={() => onPress(Chain.BITCOIN)}>{Chain.BITCOIN}</Menu.Item>
    </Menu>

  )
}
