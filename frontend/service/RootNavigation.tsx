
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name: string, params: { requestDetails?: any; }) {
  if (navigationRef.isReady()) {
    //@ts-ignore
    navigationRef.navigate(name, params);
  }
}

export function getRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
}