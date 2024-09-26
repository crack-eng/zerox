export const createTargetOrigin = () => {
  if (self !== top) {
    return "https://web.telegram.org";
  }

  return window.location.origin;
};
