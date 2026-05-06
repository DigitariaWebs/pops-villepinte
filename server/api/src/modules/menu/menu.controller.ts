import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { MenuService } from './menu.service';
import { MenuProductsQueryDto } from './dto/menu-query.dto';

@Controller('menu')
@Public()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('categories')
  getCategories() {
    return this.menuService.getCategories();
  }

  @Get('products')
  getProducts(@Query() query: MenuProductsQueryDto) {
    return this.menuService.getProducts(query);
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.menuService.getProductById(id);
  }

  @Get('supplements')
  getSupplements() {
    return this.menuService.getSupplements();
  }
}
