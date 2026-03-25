const tokenSet = new Set<string>();

export function addPushToken(token: string) {
  tokenSet.add(token);
}

export function removePushToken(token: string) {
  tokenSet.delete(token);
}

export function getPushTokens() {
  return Array.from(tokenSet.values());
}
