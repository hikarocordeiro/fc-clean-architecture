import express, { Request, Response } from "express";
import { InputCreateProductDto } from "../../../usecase/product/create/create.product.dto";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  try {
    const inputCreateProductDto: InputCreateProductDto = {
      name: req.body.name,
      price: req.body.price,
    };
    const useCase = new CreateProductUseCase(new ProductRepository());
    const output = await useCase.execute(inputCreateProductDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

productRoute.get("/", async (req: Request, res: Response) => {
  const useCase = new ListProductUseCase(new ProductRepository());
  const output = await useCase.execute({});
  res.send(output);
});