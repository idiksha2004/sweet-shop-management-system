import { IsString, IsNumber, IsPositive, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSweetDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number' })
  quantity: number;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;
}

export class UpdateSweetDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number' })
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number' })
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  category?: string;
}

export class PurchaseSweetDto {
  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number' })
  quantity: number;
}

export class RestockSweetDto {
  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number' })
  quantity: number;
}