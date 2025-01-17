import { Metadata, ServiceError } from '@grpc/grpc-js';

/**
 * Enum of status codes that gRPC can return
 */
/* eslint-disable @typescript-eslint/naming-convention */
export enum Status {
  /**
   * Not an error; returned on success
   */
  OK = 0,
  /**
   * The operation was cancelled (typically by the caller).
   */
  CANCELLED = 1,
  /**
   * Unknown error. An example of where this error may be returned is
   * if a status value received from another address space belongs to
   * an error-space that is not known in this address space. Also
   * errors raised by APIs that do not return enough error information
   * may be converted to this error.
   */
  UNKNOWN = 2,
  /**
   * Client specified an invalid argument. Note that this differs
   * from FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments
   * that are problematic regardless of the state of the system
   * (e.g., a malformed file name).
   */
  INVALID_ARGUMENT = 3,
  /**
   * Deadline expired before operation could complete. For operations
   * that change the state of the system, this error may be returned
   * even if the operation has completed successfully. For example, a
   * successful response from a server could have been delayed long
   * enough for the deadline to expire.
   */
  DEADLINE_EXCEEDED = 4,
  /**
   * Some requested entity (e.g., file or directory) was not found.
   */
  NOT_FOUND = 5,
  /**
   * Some entity that we attempted to create (e.g., file or directory)
   * already exists.
   */
  ALREADY_EXISTS = 6,
  /**
   * The caller does not have permission to execute the specified
   * operation. PERMISSION_DENIED must not be used for rejections
   * caused by exhausting some resource (use RESOURCE_EXHAUSTED
   * instead for those errors). PERMISSION_DENIED must not be
   * used if the caller can not be identified (use UNAUTHENTICATED
   * instead for those errors).
   */
  PERMISSION_DENIED = 7,
  /**
   * Some resource has been exhausted, perhaps a per-user quota, or
   * perhaps the entire file system is out of space.
   */
  RESOURCE_EXHAUSTED = 8,
  /**
   * Operation was rejected because the system is not in a state
   * required for the operation's execution. For example, directory
   * to be deleted may be non-empty, an rmdir operation is applied to
   * a non-directory, etc.
   *
   * A litmus test that may help a service implementor in deciding
   * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
   *
   *  - Use UNAVAILABLE if the client can retry just the failing call.
   *  - Use ABORTED if the client should retry at a higher-level
   *    (e.g., restarting a read-modify-write sequence).
   *  - Use FAILED_PRECONDITION if the client should not retry until
   *    the system state has been explicitly fixed. E.g., if an "rmdir"
   *    fails because the directory is non-empty, FAILED_PRECONDITION
   *    should be returned since the client should not retry unless
   *    they have first fixed up the directory by deleting files from it.
   *  - Use FAILED_PRECONDITION if the client performs conditional
   *    REST Get/Update/Delete on a resource and the resource on the
   *    server does not match the condition. E.g., conflicting
   *    read-modify-write on the same resource.
   */
  FAILED_PRECONDITION = 9,
  /**
   * The operation was aborted, typically due to a concurrency issue
   * like sequencer check failures, transaction aborts, etc.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION,
   * ABORTED, and UNAVAILABLE.
   */
  ABORTED = 10,
  /**
   * Operation was attempted past the valid range. E.g., seeking or
   * reading past end of file.
   *
   * Unlike INVALID_ARGUMENT, this error indicates a problem that may
   * be fixed if the system state changes. For example, a 32-bit file
   * system will generate INVALID_ARGUMENT if asked to read at an
   * offset that is not in the range [0,2^32-1], but it will generate
   * OUT_OF_RANGE if asked to read from an offset past the current
   * file size.
   *
   * There is a fair bit of overlap between FAILED_PRECONDITION and
   * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific
   * error) when it applies so that callers who are iterating through
   * a space can easily look for an OUT_OF_RANGE error to detect when
   * they are done.
   */
  OUT_OF_RANGE = 11,
  /**
   * Operation is not implemented or not supported/enabled in this service.
   */
  UNIMPLEMENTED = 12,
  /**
   * Internal errors. Means some invariants expected by underlying
   * system has been broken. If you see one of these errors,
   * something is very broken.
   */
  INTERNAL = 13,
  /**
   * The service is currently unavailable. This is a most likely a
   * transient condition and may be corrected by retrying with
   * a back off.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION,
   * ABORTED, and UNAVAILABLE.
   */
  UNAVAILABLE = 14,
  /**
   * Unrecoverable data loss or corruption.
   */
  DATA_LOSS = 15,
  /**
   * The request does not have valid authentication credentials for the
   * operation.
   */
  UNAUTHENTICATED = 16,
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface HttpException {
  code?: number;
  data?: Record<string, unknown>;
  details?: string;
  message?: string;
  output?: { payload?: { message?: string; statusCode?: number }; statusCode?: number };
  status?: number;
  statusCode?: number;
}

export interface Options {
  /** code - the gRPC status code. */
  code?: number;
  /** additional error information. */
  metadata?: Metadata;
  /** constructor reference. */
  ctor?: (message: string, metadata?: Metadata, details?: string) => GrpcBoom;
  /** error - the gRPC status message. */
  error?: string;
  /** message - the error message. */
  message?: string | Error;
  /** details - the error details. */
  details?: string;
}

export default class GrpcBoom implements ServiceError {
  public isBoom: boolean;

  public metadata: Metadata;

  /** code - the gRPC status code. */
  public code: number;

  /** error - the gRPC status message. */
  public error?: string;

  /** message - the error message. */
  public message: string;

  /** details - the error details. */
  public details: string;

  /** name - the error name. */
  public name: string;

  public static [Symbol.hasInstance](instance: GrpcBoom): boolean {
    return instance && instance.isBoom;
  }

  private static fallbackStatus: number = Status.UNKNOWN;
  private static fallbackMessage = 'An unknown error occurred';

  constructor(message: string, options?: Options) {
    // Parse the options
    const code = options && options.code !== undefined ? options.code : GrpcBoom.fallbackStatus;
    const ctor = options && options.ctor !== undefined ? options.ctor : GrpcBoom;
    const error = options && options.error !== undefined ? options.error : undefined;

    // Set the defaults
    this.name = 'Error';
    this.isBoom = true;
    this.code = code;
    this.error = error;
    this.message = message;
    this.metadata = options && options.metadata !== undefined ? options.metadata : new Metadata();
    this.details = options && options.details !== undefined ? options.details : '';

    this.reformat();

    // Filter the stack to our external API
    Error.captureStackTrace(this, ctor);
  }

  public static boomify(instance: GrpcBoom | Error, options?: Options): GrpcBoom {
    const castInstance = instance as unknown as GrpcBoom;

    let code: number = castInstance.code ? castInstance.code : GrpcBoom.fallbackStatus;
    if (options && options.code) {
      code = options.code;
    }

    let message: string =
      instance && instance.message ? instance.message : GrpcBoom.fallbackMessage;
    if (options && options.message && !(options.message instanceof Error)) {
      message = options.message;
    }

    let error;
    if (options && options.error) {
      error = options.error;
    }

    const newOptions: Options = { code, error };

    newOptions.details = castInstance.details ? castInstance.details : '';

    if (options && options.details !== undefined) {
      newOptions.details = options.details;
    }

    if (options && options.metadata) {
      newOptions.metadata = options.metadata;
    }

    if (instance && instance instanceof GrpcBoom && instance.isBoom) {
      instance.message = message;
      instance.code = code;
      instance.error = error;
      return instance;
    }

    return new GrpcBoom(message, newOptions);
  }

  /* eslint-disable @typescript-eslint/unbound-method */

  /**
   * Not an error; returned on success
   */
  public static ok(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.OK, metadata, this.ok, details);
  }

  /**
   * The operation was cancelled (typically by the caller).
   */

  public static cancelled(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.CANCELLED, metadata, this.cancelled, details);
  }

  /**
   * Unknown error. An example of where this error may be returned is
   * if a status value received from another address space belongs to
   * an error-space that is not known in this address space. Also
   * errors raised by APIs that do not return enough error information
   * may be converted to this error.
   */

  public static unknown(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.UNKNOWN, metadata, this.unknown, details);
  }

  /**
   * Client specified an invalid argument. Note that this differs
   * from FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments
   * that are problematic regardless of the state of the system
   * (e.g., a malformed file name).
   */

  public static invalidArgument(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.INVALID_ARGUMENT, metadata, this.invalidArgument, details);
  }

  /**
   * Deadline expired before operation could complete. For operations
   * that change the state of the system, this error may be returned
   * even if the operation has completed successfully. For example, a
   * successful response from a server could have been delayed long
   * enough for the deadline to expire.
   */
  public static deadlineExceeded(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.DEADLINE_EXCEEDED, metadata, this.deadlineExceeded, details);
  }

  /**
   * Some requested entity (e.g., file or directory) was not found.
   */
  public static notFound(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.NOT_FOUND, metadata, this.notFound, details);
  }

  /**
   * Some entity that we attempted to create (e.g., file or directory)
   * already exists.
   */
  public static alreadyExists(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.ALREADY_EXISTS, metadata, this.alreadyExists, details);
  }

  /**
   * The caller does not have permission to execute the specified
   * operation. PERMISSION_DENIED must not be used for rejections
   * caused by exhausting some resource (use RESOURCE_EXHAUSTED
   * instead for those errors). PERMISSION_DENIED must not be
   * used if the caller can not be identified (use UNAUTHENTICATED
   * instead for those errors).
   */
  public static permissionDenied(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.PERMISSION_DENIED, metadata, this.permissionDenied, details);
  }

  /**
   * Some resource has been exhausted, perhaps a per-user quota, or
   * perhaps the entire file system is out of space.
   */
  public static resourceExhausted(
    message: string,
    metadata?: Metadata,
    details?: string,
  ): GrpcBoom {
    return this.create(
      message,
      Status.RESOURCE_EXHAUSTED,
      metadata,
      this.resourceExhausted,
      details,
    );
  }

  /**
   * Operation was rejected because the system is not in a state
   * required for the operation's execution. For example, directory
   * to be deleted may be non-empty, an rmdir operation is applied to
   * a non-directory, etc.
   *
   * A litmus test that may help a service implementor in deciding
   * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
   *
   *  - Use UNAVAILABLE if the client can retry just the failing call.
   *  - Use ABORTED if the client should retry at a higher-level
   *    (e.g., restarting a read-modify-write sequence).
   *  - Use FAILED_PRECONDITION if the client should not retry until
   *    the system state has been explicitly fixed. E.g., if an "rmdir"
   *    fails because the directory is non-empty, FAILED_PRECONDITION
   *    should be returned since the client should not retry unless
   *    they have first fixed up the directory by deleting files from it.
   *  - Use FAILED_PRECONDITION if the client performs conditional
   *    REST Get/Update/Delete on a resource and the resource on the
   *    server does not match the condition. E.g., conflicting
   *    read-modify-write on the same resource.
   */
  public static failedPrecondition(
    message: string,
    metadata?: Metadata,
    details?: string,
  ): GrpcBoom {
    return this.create(
      message,
      Status.FAILED_PRECONDITION,
      metadata,
      this.failedPrecondition,
      details,
    );
  }

  /**
   * The operation was aborted, typically due to a concurrency issue
   * like sequencer check failures, transaction aborts, etc.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION,
   * ABORTED, and UNAVAILABLE.
   */
  public static aborted(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.ABORTED, metadata, this.aborted, details);
  }

  /**
   * Operation was attempted past the valid range. E.g., seeking or
   * reading past end of file.
   *
   * Unlike INVALID_ARGUMENT, this error indicates a problem that may
   * be fixed if the system state changes. For example, a 32-bit file
   * system will generate INVALID_ARGUMENT if asked to read at an
   * offset that is not in the range [0,2^32-1], but it will generate
   * OUT_OF_RANGE if asked to read from an offset past the current
   * file size.
   *
   * There is a fair bit of overlap between FAILED_PRECONDITION and
   * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific
   * error) when it applies so that callers who are iterating through
   * a space can easily look for an OUT_OF_RANGE error to detect when
   * they are done.
   */
  public static outOfRange(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.OUT_OF_RANGE, metadata, this.outOfRange, details);
  }

  /**
   * Operation is not implemented or not supported/enabled in this service.
   */
  public static unimplemented(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.UNIMPLEMENTED, metadata, this.unimplemented, details);
  }

  /**
   * Internal errors. Means some invariants expected by underlying
   * system has been broken. If you see one of these errors,
   * something is very broken.
   */
  public static internal(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.INTERNAL, metadata, this.internal, details);
  }

  /**
   * The service is currently unavailable. This is a most likely a
   * transient condition and may be corrected by retrying with
   * a back off.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION,
   * ABORTED, and UNAVAILABLE.
   */
  public static unavailable(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.UNAVAILABLE, metadata, this.unavailable, details);
  }

  /**
   * Unrecoverable data loss or corruption.
   */
  public static dataLoss(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.DATA_LOSS, metadata, this.dataLoss, details);
  }

  /**
   * The request does not have valid authentication credentials for the
   * operation.
   */
  public static unauthenticated(message: string, metadata?: Metadata, details?: string): GrpcBoom {
    return this.create(message, Status.UNAUTHENTICATED, metadata, this.unauthenticated, details);
  }

  /* eslint-enable @typescript-eslint/unbound-method */

  /* eslint-disable @typescript-eslint/naming-convention */
  public static httpStatusCodeToGrpcErrorCodeMapper: { [httpStatusCode: number]: number } = {
    400: Status.INVALID_ARGUMENT.valueOf(),
    401: Status.UNAUTHENTICATED.valueOf(),
    403: Status.PERMISSION_DENIED.valueOf(),
    404: Status.NOT_FOUND.valueOf(),
    408: Status.DEADLINE_EXCEEDED.valueOf(),
    409: Status.ALREADY_EXISTS.valueOf(),
    422: Status.ABORTED.valueOf(),
    500: Status.INTERNAL.valueOf(),
    501: Status.UNIMPLEMENTED.valueOf(),
    503: Status.UNAVAILABLE.valueOf(),
  };
  /* eslint-enable @typescript-eslint/naming-convention */

  /**
   * This method attempts to convert an http exception to a grpc
   * boom error, it will fail-over to an unknown grpc error if the
   * error code cannot be inferred. This method supports *Boom* errors.
   */
  public static fromHttpException(httpException: HttpException, metadata?: Metadata): GrpcBoom {
    const { code, data, details, message, output, status, statusCode } = httpException;
    const httpStatusCode: number | undefined =
      typeof code === 'number'
        ? code
        : status ?? statusCode ?? output?.statusCode ?? output?.payload?.statusCode;
    const grpcErrorCode = httpStatusCode
      ? GrpcBoom.httpStatusCodeToGrpcErrorCodeMapper[httpStatusCode]
      : GrpcBoom.fallbackStatus;
    const dataDetails: string | undefined = data ? JSON.stringify(data, null, 2) : undefined;
    return GrpcBoom.boomify(
      {
        code: grpcErrorCode,
        details: details ? details : dataDetails || '',
        message: message ? message : output?.payload?.message || '',
      } as GrpcBoom,
      { metadata },
    );
  }

  private static create(
    message: string,
    code: number,
    metadata?: Metadata,
    ctor?: (message: string, metadata?: Metadata, details?: string) => GrpcBoom,
    details?: string,
  ): GrpcBoom {
    const grpcBoom: GrpcBoom = new GrpcBoom(message, {
      code,
      details,
      metadata,
      ctor,
    });
    return grpcBoom.initialize(grpcBoom, code, message, metadata, details);
  }

  private initialize(
    instance: GrpcBoom,
    code: number,
    message?: string | Error,
    metadata?: Metadata,
    details?: string,
  ): GrpcBoom {
    this.isBoom = true;

    if (details) {
      this.details = details;
    }

    if (metadata) {
      this.metadata = metadata;
    }

    this.code = code;

    if (message === undefined && instance.message === undefined) {
      this.reformat();
      message = this.error;
    }

    this.reformat();
    return this;
  }

  private reformat(): void {
    if (this.code === undefined) {
      this.code = GrpcBoom.fallbackStatus;
    }

    if (this.error === undefined) {
      this.error = Status[this.code];
    }

    if (this.message === undefined) {
      this.message = GrpcBoom.fallbackMessage;
    }
  }
}
