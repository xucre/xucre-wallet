import { Text, Button, useColorMode, IButtonProps, Avatar } from "native-base";
import { Color } from "../../../GlobalStyles";
import { constructDefaultNetworks } from "../../service/network";


export default function NetworkGroup() {
  const {
    colorMode
  } = useColorMode();
  const networks = constructDefaultNetworks();
  return (

    <Avatar.Group _avatar={{
      size: "sm", bg: "transparent", borderColor: 'transparent', _image: {
        resizeMode: 'cover',
        resizeMethod: 'auto',
      },
    }} max={3}>
      {
        networks.map((network, index) => {
          const avatar = 'https://xucre-public.s3.sa-east-1.amazonaws.com/' + network.symbol.toLowerCase() + '.png';
          return (
            <Avatar
              key={index}
              source={{ uri: avatar }}
            />
          )
        })
      }
    </Avatar.Group>

  )
}
