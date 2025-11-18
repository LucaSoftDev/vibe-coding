import 'reflect-metadata';
import { Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import type { WorkshopFormDto } from './workshop.form-dto';

export class Workshop {
  @Expose()
  @IsOptional()
  @IsString()
  id: string | undefined;

  @Expose()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  @IsDate()
  date!: Date;

  @Expose({ name: 'instructorName' })
  @IsString()
  @IsNotEmpty()
  instructor!: string;

  toFormDto(): WorkshopFormDto {
    return {
      title: this.title,
      date: this.date.toISOString().slice(0, 10),
      instructor: this.instructor,
    };
  }

  static fromFormDto(formDto: WorkshopFormDto, original?: Workshop): Workshop {
    const entity = new Workshop();
    entity.id = original?.id;
    entity.title = formDto.title;
    entity.date = formDto.date ? new Date(formDto.date) : original?.date ?? new Date();
    entity.instructor = formDto.instructor;
    return entity;
  }

  toApiDto() {
    return {
      id: this.id,
      title: this.title,
      date: this.date.toISOString(),
      instructorName: this.instructor,
    };
  }
}
