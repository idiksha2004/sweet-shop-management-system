import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';

// ... existing validateDto function ...

export function validateQueryParams(dtoClass: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(dtoClass, req.query);
    
    validate(dto).then(errors => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints || {}))
          .join(', ');
        return res.status(400).json({ 
          status: 'error',
          message: `Query validation failed: ${message}` 
        });
      }
      
      // Attach validated query params to request
      req.query = dto;
      next();
    });
  };
}

// Add a DTO for query parameters
export class SweetQueryParams {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;
}