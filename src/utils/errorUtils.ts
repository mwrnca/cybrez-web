interface AxiosErrorShape {
  response?: {
    status?: number;
    data?: {
      detail?: unknown;
      message?: unknown;
    };
  };
  code?: string;
  message?: string;
}

const UUID_REGEX =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

const TOKEN_URL_REGEX = /https?:\/\/[^\s]+/gi;

/**
 * Removes raw UUIDs, token URLs, and database/internal stack keywords from a message string.
 */
export function sanitizeMessage(msg: string): string {
  if (!msg || typeof msg !== "string") return "";

  // Check if string contains backend stack trace or SQL error
  if (
    /sqlalchemy|psycopg|traceback|line \d+|syntax error|foreign key|unique constraint/i.test(
      msg
    )
  ) {
    return "A system error occurred. Please try again.";
  }

  return msg
    .replace(UUID_REGEX, "")
    .replace(TOKEN_URL_REGEX, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function getHttpStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "response" in error) {
    return (error as AxiosErrorShape).response?.status;
  }
  return undefined;
}

export function isNetworkError(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
    const err = error as AxiosErrorShape;
    if (err.code === "ERR_NETWORK" || err.code === "ECONNABORTED") {
      return true;
    }
    if (!err.response && typeof err.message === "string") {
      return /network\s*error|failed to fetch|net::err/i.test(err.message);
    }
  }
  return false;
}

export function getSafeErrorDetail(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "response" in error) {
    const data = (error as AxiosErrorShape).response?.data;
    if (data && typeof data.detail === "string") {
      const sanitized = sanitizeMessage(data.detail);
      if (sanitized.length > 0) {
        return sanitized;
      }
    } else if (data && typeof data.message === "string") {
      const sanitized = sanitizeMessage(data.message);
      if (sanitized.length > 0) {
        return sanitized;
      }
    }
  }
  return null;
}

/**
 * Translates arbitrary API errors to user-friendly messages for general components and PageState.
 */
export function formatUserFacingError(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!error) return fallback;

  if (isNetworkError(error)) {
    return "Unable to connect to CYBREZ. Check your connection and try again.";
  }

  const status = getHttpStatus(error);

  if (status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  if (status === 403) {
    return "You don't have permission to perform this action.";
  }
  if (status === 404) {
    return "We couldn't find the requested resource.";
  }
  if (status === 409) {
    const detail = getSafeErrorDetail(error);
    return detail || "A conflicting record already exists.";
  }
  if (status === 400) {
    const detail = getSafeErrorDetail(error);
    return (
      detail ||
      "The request could not be processed. Please check the details and try again."
    );
  }
  if (status && status >= 500) {
    return "Something went wrong on our side. Please try again.";
  }

  const detail = getSafeErrorDetail(error);
  if (detail) {
    return detail;
  }

  return fallback;
}

/**
 * Translates errors specifically for the Notifications page.
 */
export function getNotificationErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return "Unable to connect to CYBREZ. Check your connection and try again.";
  }

  const status = getHttpStatus(error);

  if (status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  if (status === 403) {
    return "You don't have permission to view these notifications.";
  }
  if (status === 404) {
    return "We couldn't find the requested resource.";
  }
  if (status && status >= 500) {
    return "Something went wrong on our side. Please try again.";
  }

  return "Please try again.";
}

/**
 * Translates query/load errors specifically for the Invitations page.
 */
export function getInvitationsLoadErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return "Unable to reach CYBREZ. Check your connection and try again.";
  }

  const status = getHttpStatus(error);

  if (status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  if (status === 403) {
    return "You don't have permission to manage invitations in this organization.";
  }
  if (status === 404) {
    return "This organization or invitation could not be found.";
  }
  if (status === 409) {
    return "An invitation for this email may already exist.";
  }
  if (status === 400) {
    return "That invitation could not be created. Check the details and try again.";
  }
  if (status && status >= 500) {
    return "Something went wrong on our side. Please try again.";
  }

  return "Something went wrong while processing the invitation. Please try again.";
}

/**
 * Translates mutation action errors (create, resend, cancel) for invitations.
 */
export function getInvitationActionErrorMessage(
  error: unknown,
  actionType: "create" | "resend" | "cancel"
): string {
  if (isNetworkError(error)) {
    return "Unable to reach CYBREZ. Check your connection and try again.";
  }

  const status = getHttpStatus(error);
  const detail = getSafeErrorDetail(error);

  if (status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  if (status === 403) {
    if (actionType === "create") {
      return "You don't have permission to invite members to this organization.";
    }
    if (actionType === "resend") {
      return "You don't have permission to resend invitations in this organization.";
    }
    return "You don't have permission to cancel invitations in this organization.";
  }
  if (status === 404) {
    return "This invitation or organization could not be found.";
  }
  if (status === 409) {
    return detail || "An invitation for this email already exists.";
  }
  if (status === 400) {
    return (
      detail ||
      "That invitation could not be processed. Check the details and try again."
    );
  }
  if (status && status >= 500) {
    return "Something went wrong on our side. Please try again.";
  }

  if (detail) {
    return detail;
  }

  if (actionType === "create") {
    return "Unable to send the invitation. Please try again.";
  }
  if (actionType === "resend") {
    return "Unable to resend the invitation. Please try again.";
  }
  return "Unable to cancel the invitation. Please try again.";
}
