/*
  Public configuration only. Never put API keys or private tokens here.
  The submit endpoint should accept POST JSON; the data endpoint should return
  either an array or { data: [...] } using the same field names as feedback.html.
*/
window.QWEN_FEEDBACK_CONFIG = {
  submitEndpoint: "https://qwenwork-feedback-d0d30k294ca8ef-1397585048.ap-shanghai.app.tcloudbase.com/feedback-api/feedback",
  dataEndpoint: "https://qwenwork-feedback-d0d30k294ca8ef-1397585048.ap-shanghai.app.tcloudbase.com/feedback-api/summary"
};
