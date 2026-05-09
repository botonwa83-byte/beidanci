// Simple global auth event for logout
// This avoids prop drilling through navigation

type AuthListener = () => void;

let logoutListener: AuthListener | null = null;

export const setLogoutListener = (listener: AuthListener) => {
  logoutListener = listener;
};

export const triggerLogout = () => {
  if (logoutListener) {
    logoutListener();
  }
};
