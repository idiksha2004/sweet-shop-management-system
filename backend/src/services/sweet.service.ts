import { getRepository, Like } from 'typeorm';
import { Sweet } from '../models/Sweet';
import { CreateSweetDto, UpdateSweetDto, PurchaseSweetDto, RestockSweetDto } from '../dto/sweet.dto';
import { validate } from 'class-validator';

export class SweetService {
  private sweetRepository = getRepository(Sweet);

  async createSweet(createSweetDto: CreateSweetDto): Promise<Sweet> {
    // Check if sweet with same name already exists
    const existingSweet = await this.sweetRepository.findOne({ 
      where: { name: createSweetDto.name } 
    });

    if (existingSweet) {
      throw new Error('A sweet with this name already exists');
    }

    const sweet = new Sweet();
    Object.assign(sweet, createSweetDto);

    const errors = await validate(sweet);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.toString()}`);
    }

    return await this.sweetRepository.save(sweet);
  }

  async getAllSweets(search?: string, category?: string, minPrice?: number, maxPrice?: number): Promise<Sweet[]> {
    const query = this.sweetRepository.createQueryBuilder('sweet');

    if (search) {
      query.andWhere('LOWER(sweet.name) LIKE LOWER(:search)', { 
        search: `%${search}%` 
      });
    }

    if (category) {
      query.andWhere('LOWER(sweet.category) = LOWER(:category)', { category });
    }

    if (minPrice !== undefined) {
      query.andWhere('sweet.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('sweet.price <= :maxPrice', { maxPrice });
    }

    return await query.getMany();
  }

  async getSweetById(id: string): Promise<Sweet> {
    const sweet = await this.sweetRepository.findOne(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }
    return sweet;
  }

  async updateSweet(id: string, updateSweetDto: UpdateSweetDto): Promise<Sweet> {
    const sweet = await this.getSweetById(id);
    Object.assign(sweet, updateSweetDto);

    const errors = await validate(sweet);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.toString()}`);
    }

    return await this.sweetRepository.save(sweet);
  }

  async deleteSweet(id: string): Promise<void> {
    const result = await this.sweetRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Sweet not found');
    }
  }

  async purchaseSweet(id: string, purchaseDto: PurchaseSweetDto): Promise<Sweet> {
    const sweet = await this.getSweetById(id);
    
    if (sweet.quantity < purchaseDto.quantity) {
      throw new Error('Insufficient stock');
    }

    sweet.quantity -= purchaseDto.quantity;
    return await this.sweetRepository.save(sweet);
  }

  async restockSweet(id: string, restockDto: RestockSweetDto): Promise<Sweet> {
    const sweet = await this.getSweetById(id);
    sweet.quantity += restockDto.quantity;
    return await this.sweetRepository.save(sweet);
  }
}