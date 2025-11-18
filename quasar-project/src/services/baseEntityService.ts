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

  protected async toEntity(payload: unknown): Promise<TEntity>;
  protected async toEntity(payload: unknown[]): Promise<TEntity[]>;
  protected async toEntity(payload: unknown): Promise<TEntity | TEntity[]> {
    if (Array.isArray(payload)) {
      return Promise.all(payload.map((item) => this.convertSingle(item)));
    }

    return this.convertSingle(payload);
  }

  private async convertSingle(payload: unknown): Promise<TEntity> {
    const entity = plainToInstance(this.entityCtor, payload, this.transformOptions);
    await validateOrReject(entity, this.validatorOptions);
    return entity;
  }
}
