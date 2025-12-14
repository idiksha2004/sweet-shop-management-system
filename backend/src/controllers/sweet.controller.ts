import { Request, Response } from 'express';
import { SweetService } from '../services/sweet.service';
import { validateDto } from '../utils/validation';
import { 
  CreateSweetDto, 
  UpdateSweetDto, 
  PurchaseSweetDto, 
  RestockSweetDto 
} from '../dto/sweet.dto';

export class SweetController {
  private sweetService = new SweetService();

  async createSweet(req: Request, res: Response) {
    try {
      const sweet = await this.sweetService.createSweet(req.body);
      res.status(201).json({
        status: 'success',
        data: sweet,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async getAllSweets(req: Request, res: Response) {
    try {
      const { search, category, minPrice, maxPrice } = req.query;
      const sweets = await this.sweetService.getAllSweets(
        search as string,
        category as string,
        minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice ? parseFloat(maxPrice as string) : undefined
      );
      res.json({
        status: 'success',
        results: sweets.length,
        data: sweets,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch sweets',
      });
    }
  }

  async getSweetById(req: Request, res: Response) {
    try {
      const sweet = await this.sweetService.getSweetById(req.params.id);
      res.json({
        status: 'success',
        data: sweet,
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message || 'Sweet not found',
      });
    }
  }

  async updateSweet(req: Request, res: Response) {
    try {
      const sweet = await this.sweetService.updateSweet(
        req.params.id,
        req.body
      );
      res.json({
        status: 'success',
        data: sweet,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to update sweet',
      });
    }
  }

  async deleteSweet(req: Request, res: Response) {
    try {
      await this.sweetService.deleteSweet(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message || 'Sweet not found',
      });
    }
  }

  async purchaseSweet(req: Request, res: Response) {
    try {
      const sweet = await this.sweetService.purchaseSweet(
        req.params.id,
        req.body
      );
      res.json({
        status: 'success',
        data: sweet,
        message: 'Purchase successful',
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to process purchase',
      });
    }
  }

  async restockSweet(req: Request, res: Response) {
    try {
      const sweet = await this.sweetService.restockSweet(
        req.params.id,
        req.body
      );
      res.json({
        status: 'success',
        data: sweet,
        message: 'Restock successful',
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to restock sweet',
      });
    }
  }
}