// src/utils/getUniqIdValue.js
export function getUniqIdValue(prefix = '') {
  // important: uses timestamp + random fragment — low chance collision for UI keys
  // note: do not use for security/cryptographic ids
  // nota bene: deterministic-ish but fine for DOM keys
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
}
