import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminCatalogueService } from './admin-catalogue.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, ToggleAvailabilityDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { ManageProductSupplementsDto } from './dto/manage-product-supplements.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminCatalogueController {
  constructor(private readonly catalogueService: AdminCatalogueService) {}

  // Products
  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalogueService.createProduct(dto);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalogueService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.catalogueService.deleteProduct(id);
  }

  @Patch('products/:id/availability')
  toggleAvailability(
    @Param('id') id: string,
    @Body() dto: ToggleAvailabilityDto,
  ) {
    return this.catalogueService.toggleAvailability(id, dto);
  }

  @Put('products/:id/supplements')
  setProductSupplements(
    @Param('id') id: string,
    @Body() dto: ManageProductSupplementsDto,
  ) {
    return this.catalogueService.setProductSupplements(id, dto);
  }

  // Categories
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.catalogueService.createCategory(dto);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.catalogueService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.catalogueService.deleteCategory(id);
  }

  @Put('categories/order')
  reorderCategories(@Body() dto: ReorderCategoriesDto) {
    return this.catalogueService.reorderCategories(dto);
  }

  // Supplements
  @Post('supplements')
  createSupplement(@Body() dto: CreateSupplementDto) {
    return this.catalogueService.createSupplement(dto);
  }

  @Patch('supplements/:id')
  updateSupplement(@Param('id') id: string, @Body() dto: UpdateSupplementDto) {
    return this.catalogueService.updateSupplement(id, dto);
  }

  @Delete('supplements/:id')
  deleteSupplement(@Param('id') id: string) {
    return this.catalogueService.deleteSupplement(id);
  }
}
