import {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create product use case", () => {
  it("should create a product", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "product",
      price: 100,
    };
    const output: OutputCreateProductDto = {
      id: expect.any(String),
      name: input.name,
      price: input.price,
    };
    const result = await useCase.execute(input);
    expect(result).toEqual(output);
  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "",
      price: 100,
    };
    await expect(useCase.execute(input)).rejects.toThrow("Name is required");
  });

  it("should thrown an error when price is less than zero", async () => {
    const productRepository = MockRepository();
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