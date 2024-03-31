jest.mock("@notifee/react-native", () => {
  /**
   * Devido a vários problemas ao importar o mock oferecido pela notifee, resolvi
   * criar manualmente o mock apenas das funcionalidades que utilizamos no app.
   * https://github.com/invertase/notifee/issues/739
   */

  const notifee = {
    getInitialNotification: jest.fn().mockResolvedValue(null),
    displayNotification: jest.fn().mockResolvedValue(),
    onForegroundEvent: jest.fn().mockReturnValue(jest.fn()),
    onBackgroundEvent: jest.fn(),
    createChannelGroup: jest.fn().mockResolvedValue("channel-group-id"),
    createChannel: jest.fn().mockResolvedValue(),
  };

  return {
    ...jest.requireActual("@notifee/react-native/dist/types/Notification"),
    __esModule: true,
    default: notifee,
  };
});
