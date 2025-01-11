import { IsString, IsOptional, IsNumber } from 'class-validator';

export class GetWeatherDto {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsNumber()
  @IsOptional()
  days?: number;

  @IsString()
  @IsOptional()
  zipcode?: string;
}