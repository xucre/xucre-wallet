
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
}

export function getRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
}