import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const useCase = new UpdateProductUseCase(productRepository);
    const product = new Product(uuid(), "product", 10);
    productRepository.create(product);

    const input: InputUpdateProductDto = {
      id: product.id,
      name: "product updated",
      price: 20,
    };
    const output: OutputUpdateProductDto = {
      id: product.id,
      name: input.name,
      price: input.price,
    };
    const result = await useCase.execute(input);
    expect(result).toEqual(output);
  });

  it("should throw an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const useCase = new UpdateProductUseCase(productRepository);
    const product = new Product(uuid(), "product", 10);
    productRepository.create(product);

    const input: InputUpdateProductDto = {
      id: product.id,
      name: "",
      price: 10,
    };

    await expect(useCase.execute(input)).rejects.toThrow(
        new Error("product: Name is required")
    );
  });

  it("should thrown an error when price is less than zero", async () => {
    const productRepository = new ProductRepository();
    const useCase = new UpdateProductUseCase(productRepository);
    const product = new Product(uuid(), "product", 10);
    productRepository.create(product);

    const input: InputUpdateProductDto = {
      id: product.id,
      name: "product",
      price: -10,
    };

    await expect(useCase.execute(input)).rejects.toThrow(
        new Error("product: Price must be greater than zero")
    );
  });
});