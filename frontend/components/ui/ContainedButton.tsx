import { Text, Button, useColorMode, IButtonProps } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { AppWallet, language as stateLanguage } from "../../service/state";
import { useRecoilState } from "recoil";
import { Color } from "../../../GlobalStyles";


export default function ContainedButton({ buttonText, onPress, style, ...props }: { buttonText: string, onPress: any, style: any }) {
  const {
    colorMode
  } = useColorMode();
  return (
    <Button borderRadius={100} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} onPress={onPress} style={style} {...props}>
      <Text fontWeight={'bold'} style={{ color: colorMode === 'dark' ? Color.black : Color.white }}>{buttonText}</Text>
    </Button>

  )
}
