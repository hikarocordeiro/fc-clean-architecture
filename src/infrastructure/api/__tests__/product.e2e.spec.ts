import { app, sequelize } from "../express";
import request from "supertest";
import {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "../../../usecase/product/create/create.product.dto";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const inputCreateProductDto: InputCreateProductDto = {
      name: "product A",
      price: 10,
    };

    const response = await request(app)
      .post("/product")
      .send(inputCreateProductDto);

    const outputCreateProductDto: OutputCreateProductDto = {
      id: expect.any(String),
      name: "product A",
      price: 10,
    };

    expect(response.status).toBe(200);
    expect(response.body).toEqual(outputCreateProductDto);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "product A",
    });
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const inputCreateProductDto: InputCreateProductDto = {
      name: "product A",
      price: 10,
    };

    const inputCreateProductDto2: InputCreateProductDto = {
      name: "product B",
      price: 10,
    };

    const response = await request(app)
      .post("/product")
      .send(inputCreateProductDto);

    const response2 = await request(app)
      .post("/product")
      .send(inputCreateProductDto2);

    expect(response.status).toBe(200);
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    const product = listResponse.body.products[0];
    expect(product.id).toEqual(expect.any(String));
    expect(product.name).toBe("product A");
    expect(product.price).toBe(10);

    const product2 = listResponse.body.products[1];
    expect(product2.id).toEqual(expect.any(String));
    expect(product2.name).toBe("product B");
    expect(product2.price).toBe(10);
  });
});