export class ToolExecutionError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

export type OperationalErrorCode =
  | "not_found"
  | "invalid_slug"
  | "validation_error"
  | "internal_error";

export function operationalErrorCode(error: unknown): OperationalErrorCode {
  if (error instanceof ToolExecutionError) {
    if (error.code === "invalid_slug" || error.code.includes("slug")) {
      return "invalid_slug";
    }
    if (error.code === "not_found" || error.status === 404) {
      return "not_found";
    }
    if (error.status >= 400 && error.status < 500) {
      return "validation_error";
    }
  }

  if (isZodError(error)) {
    if (
      error.issues.some((issue) =>
        Array.isArray(issue.path) && issue.path.some((segment) => segment === "slug")
      )
    ) {
      return "invalid_slug";
    }
    return "validation_error";
  }

  return "internal_error";
}

function isZodError(
  error: unknown,
): error is { issues: Array<{ path?: unknown }> } {
  return Boolean(
    error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ZodError" &&
      "issues" in error &&
      Array.isArray(error.issues),
  );
}

export function errorMessage(error: unknown) {
  if (error instanceof ToolExecutionError) {
    return `${error.code}: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Internal error";
}
