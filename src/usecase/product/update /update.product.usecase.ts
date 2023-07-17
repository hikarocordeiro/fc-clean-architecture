import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";

export default class UpdateProductUseCase {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {
    const product = await this.productRepository.find(input.id);
    product.changeName(input.name);
    product.changePrice(input.price);
    await this.productRepository.update(product);
    return {
      id: product.id,
      name: product.name,
      price: product.price,
    } as OutputUpdateProductDto;
  }
}