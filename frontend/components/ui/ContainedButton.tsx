import { Text, Button, useColorMode, IButtonProps } from "native-base";
import { Color } from "../../../GlobalStyles";


export default function ContainedButton({ buttonText, onPress, ...props }: { buttonText: string, onPress: any, [key: string]: any }) {
  const {
    colorMode
  } = useColorMode();
  return (
    <Button
      borderRadius={100}
      colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}
      onPress={onPress}
      _loading={{
        _text: {
          color: colorMode === 'dark' ? Color.black : Color.white
        }
      }} _spinner={{
        color: colorMode === 'dark' ? Color.white : Color.black
      }}
      {...props}
    >
      <Text fontWeight={'bold'} style={{ color: colorMode === 'dark' ? Color.black : Color.white }}>{buttonText}</Text>
    </Button>
  )
}
