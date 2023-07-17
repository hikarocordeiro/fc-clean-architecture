import Product from "../../../domain/product/entity/product";
import { v4 as uuid } from "uuid";
import { OutputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";
import { InputFindCustomerDto } from "../../customer/find/find.customer.dto";

const id = uuid();
const name = "product";
const price = 10;
const product = new Product(id, name, price);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test find product use case", () => {
  it("should find a product", async () => {
    const productRepository = MockRepository();
    const usecase = new FindProductUseCase(productRepository);

    const input: InputFindCustomerDto = { id };
    const output: OutputFindProductDto = {
      id,
      name,
      price,
    };
    const result = await usecase.execute(input);
    expect(result).toEqual(output);
  });

  it("should not find a product", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const usecase = new FindProductUseCase(productRepository);
    const input = {
      id: "123",
    };

    expect(() => {
      return usecase.execute(input);
    }).rejects.toThrow("Product not found");
  });
});