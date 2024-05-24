import React from 'react';
import { Mixpanel } from 'mixpanel-react-native';
import { env } from '../service/constants';

const MixpanelContext = React.createContext({} as Mixpanel);

export const useMixpanel = () => React.useContext(MixpanelContext);

export const MixpanelProvider = ({ children }: { children: any }) => {
  const [mixpanel, setMixpanel] = React.useState({} as Mixpanel);

  React.useEffect(() => {
    const trackAutomaticEvents = true;
    const mixpanelInstance = new Mixpanel(env.REACT_APP_MIXPANEL_PROJECT_ID, trackAutomaticEvents);
    mixpanelInstance.init();
    setMixpanel(mixpanelInstance);
  }, []);

  return <MixpanelContext.Provider value={mixpanel}>{children}</MixpanelContext.Provider>;
};