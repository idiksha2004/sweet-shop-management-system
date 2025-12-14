export interface Sweet {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSweetDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
}

export interface UpdateSweetDto extends Partial<CreateSweetDto> {}

export interface PurchaseSweetDto {
  quantity: number;
}

export interface RestockSweetDto {
  quantity: number;
}