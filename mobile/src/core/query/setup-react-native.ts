import { AppState, type AppStateStatus } from 'react-native';
import { focusManager } from '@tanstack/react-query';

export function setupReactQueryFocusManager(): void {
  focusManager.setEventListener((handleFocus) => {
    const onAppStateChange = (status: AppStateStatus) => {
      handleFocus(status === 'active');
    };

    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  });
}
