import { Metadata } from '@grpc/grpc-js';

import GrpcBoom, { HttpException, Status } from '../../src/index';

describe('Grpc Boom', () => {
  test('should be able to create a boom object from the constructor', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('constructed', 'true');
    const grpcBoom = new GrpcBoom('Constructor Example!', { code: Status.CANCELLED, metadata });

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Constructor Example!');
    expect(grpcBoom.code).toEqual(1);
    expect(grpcBoom.error).toEqual('CANCELLED');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('constructed');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using boomify', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('boomified', 'true');
    const grpcBoom = GrpcBoom.boomify(new Error('Boomify Example!'), {
      code: Status.UNKNOWN,
      metadata,
    });

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Boomify Example!');
    expect(grpcBoom.code).toEqual(2);
    expect(grpcBoom.error).toEqual('UNKNOWN');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('boomified');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using a custom error', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('customised', 'true');
    const grpcBoom = GrpcBoom.boomify(new Error('Custom Example!'), {
      code: 200,
      details: 'Custom Details!',
      message: 'Custom Example Message!',
      metadata,
      error: 'CUSTOM_EXAMPLE',
    });

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Custom Example Message!');
    expect(grpcBoom.code).toEqual(200);
    expect(grpcBoom.details).toEqual('Custom Details!');
    expect(grpcBoom.error).toEqual('CUSTOM_EXAMPLE');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('customised');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to boomify a boom object', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('constructed', 'true');
    const boom = new GrpcBoom('Constructor Example!', { code: Status.CANCELLED, metadata });
    const grpcBoom = GrpcBoom.boomify(boom);

    expect(grpcBoom.isBoom).toEqual(boom.isBoom);
    expect(grpcBoom.message).toEqual(boom.message);
    expect(grpcBoom.code).toEqual(boom.code);
    expect(grpcBoom.error).toEqual(boom.error);
    expect(grpcBoom.name).toEqual(boom.name);

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('constructed');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the ok convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.ok('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(0);
    expect(grpcBoom.error).toEqual('OK');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the cancelled convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.cancelled('Convenience', metadata, 'Request cancelled!');

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(1);
    expect(grpcBoom.details).toEqual('Request cancelled!');
    expect(grpcBoom.error).toEqual('CANCELLED');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the unknown convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.unknown('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(2);
    expect(grpcBoom.error).toEqual('UNKNOWN');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the invalid argument convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.invalidArgument('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(3);
    expect(grpcBoom.error).toEqual('INVALID_ARGUMENT');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the deadline exceeded convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.deadlineExceeded('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(4);
    expect(grpcBoom.error).toEqual('DEADLINE_EXCEEDED');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the not found convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.notFound('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(5);
    expect(grpcBoom.error).toEqual('NOT_FOUND');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the already exists convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.alreadyExists('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(6);
    expect(grpcBoom.error).toEqual('ALREADY_EXISTS');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the permission denied convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.permissionDenied('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(7);
    expect(grpcBoom.error).toEqual('PERMISSION_DENIED');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the resource exhausted convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.resourceExhausted('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(8);
    expect(grpcBoom.error).toEqual('RESOURCE_EXHAUSTED');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the failed precondition convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.failedPrecondition('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(9);
    expect(grpcBoom.error).toEqual('FAILED_PRECONDITION');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the aborted convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.aborted('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(10);
    expect(grpcBoom.error).toEqual('ABORTED');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the out of range convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.outOfRange('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(11);
    expect(grpcBoom.error).toEqual('OUT_OF_RANGE');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the unimplemented convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.unimplemented('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(12);
    expect(grpcBoom.error).toEqual('UNIMPLEMENTED');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the internal convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.internal('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(13);
    expect(grpcBoom.error).toEqual('INTERNAL');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the unavailable convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.unavailable('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(14);
    expect(grpcBoom.error).toEqual('UNAVAILABLE');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the dataLoss convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.dataLoss('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(15);
    expect(grpcBoom.error).toEqual('DATA_LOSS');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should be able to create a boom object using the unauthenticated convenience method', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('convenience', 'true');
    const grpcBoom = GrpcBoom.unauthenticated('Convenience', metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual('Convenience');
    expect(grpcBoom.code).toEqual(16);
    expect(grpcBoom.error).toEqual('UNAUTHENTICATED');
    expect(grpcBoom.name).toEqual('Error');

    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('convenience');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should convert a bad request http exception correctly', () => {
    const metadata: Metadata = new Metadata();
    metadata.set('boomified', 'true');
    const httpException = {
      code: 400,
      message: 'Invalid input provided.',
      details: 'Password must be more than 6 characters.',
    };
    const grpcBoom = GrpcBoom.fromHttpException(httpException, metadata);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual(httpException.message);
    expect(grpcBoom.details).toEqual(httpException.details);
    expect(grpcBoom.code).toEqual(GrpcBoom.httpStatusCodeToGrpcErrorCodeMapper[httpException.code]);
    expect(grpcBoom.error).toEqual('INVALID_ARGUMENT');
    expect(grpcBoom.name).toEqual('Error');
    expect(grpcBoom.metadata).toBeDefined();
    const metadataValue = grpcBoom.metadata.get('boomified');
    expect(metadataValue.length).toBeGreaterThan(0);
    expect(metadataValue[0]).toEqual('true');
  });

  test('should convert a bad request http exception with data details correctly', () => {
    const httpException = {
      code: 400,
      message: 'Invalid input provided.',
      data: { password: 'Password must be more than 6 characters.' },
    };
    const grpcBoom = GrpcBoom.fromHttpException(httpException);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual(httpException.message);
    expect(grpcBoom.details).toEqual(JSON.stringify(httpException.data, null, 2));
    expect(grpcBoom.code).toEqual(GrpcBoom.httpStatusCodeToGrpcErrorCodeMapper[httpException.code]);
    expect(grpcBoom.error).toEqual('INVALID_ARGUMENT');
    expect(grpcBoom.name).toEqual('Error');
    expect(grpcBoom.metadata).toBeDefined();
  });

  test('should convert a boom bad request http exception with data details correctly', () => {
    const httpException = {
      data: {
        userUuid: {
          isNotEmpty: 'userUuid should not be empty',
          isUuid: 'userUuid must be a UUID',
        },
      },
      isBoom: true,
      isServer: false,
      output: {
        statusCode: 400,
        payload: {
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid input provided.',
        },
        headers: {},
      },
      code: 'invalidInput',
    } as unknown as HttpException;
    const grpcBoom = GrpcBoom.fromHttpException(httpException);

    expect(grpcBoom.isBoom).toEqual(true);
    expect(grpcBoom.message).toEqual(httpException.output!.payload!.message);
    expect(grpcBoom.details).toEqual(JSON.stringify(httpException.data, null, 2));
    expect(grpcBoom.code).toEqual(
      GrpcBoom.httpStatusCodeToGrpcErrorCodeMapper[httpException.output!.statusCode!],
    );
    expect(grpcBoom.code).toEqual(3);
    expect(grpcBoom.error).toEqual('INVALID_ARGUMENT');
    expect(grpcBoom.name).toEqual('Error');
    expect(grpcBoom.metadata).toBeDefined();
  });

  describe('initialize', () => {
    test('initialize without a message correctly', () => {
      const grpcBoom = GrpcBoom.internal('Initializing');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      grpcBoom.message = undefined;
      expect(grpcBoom['initialize'](grpcBoom, grpcBoom.code)).toMatchObject({});
    });
  });

  describe('reformat', () => {
    test('reformats an instance correctly', () => {
      const grpcBoom = GrpcBoom.internal('Reformatting');
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      grpcBoom.code = undefined;
      grpcBoom.error = undefined;
      // @ts-ignore
      grpcBoom.message = undefined;
      /* eslint-enable @typescript-eslint/ban-ts-comment */
      grpcBoom['reformat']();
      expect(grpcBoom).toMatchObject({});
    });
  });
});
