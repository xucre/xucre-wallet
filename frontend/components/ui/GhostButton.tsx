import { Text, Button, useColorMode, IButtonProps } from "native-base";
import { Color } from "../../../GlobalStyles";


export default function GhostButton({ buttonText, onPress, ...props }: { buttonText: string, onPress: any, [key: string]: any }) {
  const {
    colorMode
  } = useColorMode();
  return (
    <Button
      _disabled={{ backgroundColor: 'coolGray.400', bgColor: 'coolGray.400', color: 'coolGray.400' }}
      borderRadius={100}
      borderColor={colorMode === 'dark' ? Color.white : Color.black}
      borderWidth={'1'}
      //colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
      backgroundColor={'transparent'}
      onPress={onPress}
      {...props}
    >
      <Text fontWeight={'bold'} style={{ color: colorMode === 'dark' ? Color.white : Color.black }}>{buttonText}</Text>
    </Button>
  )
}
