export const isUiPreviewMode = () => {
  return import.meta.env.DEV && import.meta.env.VITE_UI_PREVIEW_MODE === 'true';
};
