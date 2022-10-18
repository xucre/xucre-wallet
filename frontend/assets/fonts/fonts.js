import styled from 'styled-components/native';

import Montserrat from './Montserrat-Black.ttf';

export default styled.Text`
    @font-face {
      font-family: 'Montserrat';
      src: local('Montserrat-Black'), local('Montserrat-Black'),
      url(${Montserrat}) format('ttf');
      font-weight: 300;
      font-style: normal;
     }
  `;