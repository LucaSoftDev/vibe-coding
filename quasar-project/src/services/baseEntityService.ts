import { plainToInstance, type ClassConstructor, type ClassTransformOptions } from 'class-transformer';
import { validateOrReject, type ValidatorOptions } from 'class-validator';

const defaultTransformOptions: ClassTransformOptions = {
  enableImplicitConversion: true,
  exposeDefaultValues: true,
  excludeExtraneousValues: true,
};

const defaultValidatorOptions: ValidatorOptions = {
  whitelist: true,
};

export abstract class BaseEntityService<TEntity extends object> {
  protected constructor(
    private readonly entityCtor: ClassConstructor<TEntity>,
    private readonly transformOptions: ClassTransformOptions = defaultTransformOptions,
    private readonly validatorOptions: ValidatorOptions = defaultValidatorOptions,
  ) {}

  protected async toEntity<TPayload extends unknown | unknown[]>(
    payload: TPayload,
  ): Promise<TPayload extends unknown[] ? TEntity[] : TEntity> {
    if (Array.isArray(payload)) {
      const entities = await Promise.all(payload.map((item) => this.convertSingle(item)));
      return entities as Promise<TPayload extends unknown[] ? TEntity[] : TEntity>;
    }

    const entity = await this.convertSingle(payload);
    return entity as Promise<TPayload extends unknown[] ? TEntity[] : TEntity>;
  }

  private async convertSingle(payload: unknown): Promise<TEntity> {
    const entity = plainToInstance(this.entityCtor, payload, this.transformOptions);
    await validateOrReject(entity, this.validatorOptions);
    return entity;
  }
}
