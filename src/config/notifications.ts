export const PUSH_NOTIFICATION_STATUS = {
  UNSUPPORTED: "unsupported",
  ENABLED: "enabled",
  DISABLED: "disabled",
  BLOCKED: "blocked",
} as const;

export type PushNotificationStatus =
  (typeof PUSH_NOTIFICATION_STATUS)[keyof typeof PUSH_NOTIFICATION_STATUS];

export const PUSH_NOTIFICATION_BUTTON_LABEL_BY_STATUS: Record<
  PushNotificationStatus,
  string
> = {
  [PUSH_NOTIFICATION_STATUS.ENABLED]: "Disable Push Alerts",
  [PUSH_NOTIFICATION_STATUS.BLOCKED]: "Push Blocked in Browser",
  [PUSH_NOTIFICATION_STATUS.UNSUPPORTED]: "Push Not Supported",
  [PUSH_NOTIFICATION_STATUS.DISABLED]: "Enable Push Alerts",
};

export const PUSH_NOTIFICATION_BUTTON_COLOR_BY_STATUS: Record<
  PushNotificationStatus,
  "primary" | "success" | "warning"
> = {
  [PUSH_NOTIFICATION_STATUS.ENABLED]: "success",
  [PUSH_NOTIFICATION_STATUS.BLOCKED]: "warning",
  [PUSH_NOTIFICATION_STATUS.UNSUPPORTED]: "primary",
  [PUSH_NOTIFICATION_STATUS.DISABLED]: "primary",
};

export const PUSH_NOTIFICATION_NON_INTERACTIVE_STATUSES: readonly PushNotificationStatus[] = [
  PUSH_NOTIFICATION_STATUS.UNSUPPORTED,
  PUSH_NOTIFICATION_STATUS.BLOCKED,
];
