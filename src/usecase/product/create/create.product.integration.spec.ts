import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

describe("Test create product use case", () => {
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

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "product",
      price: 100,
    };

    const output: OutputCreateProductDto = {
      id: expect.any(String),
      name: "product",
      price: 100,
    };

    const result = await useCase.execute(input);
    expect(result).toEqual(output);
  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "",
      price: 100,
    };
    await expect(useCase.execute(input)).rejects.toThrow("Name is required");
  });

  it("should thrown an error when price is less than zero", async () => {
    const productRepository = new ProductRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "product",
      price: -1,
    };
    await expect(useCase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
});