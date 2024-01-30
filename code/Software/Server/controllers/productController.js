import mongoose from "mongoose";
import { Product } from "../models/productModel.js";

export async function getAllProducts(request, response) {
    try {
        const products = await Product.find();

        if (products.length > 0) {
            return response.status(200).json({
                count: products.length,
                data: products,
            });
        } else {
            return response.status(404).json({ message: "No products found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching products." });
    }
}

export async function getProductById(request, response) {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: `Invalid product id`,
            });
        }

        const product = await Product.findById(id).exec();

        if (product) {
            return response.status(200).json(product);
        } else {
            return response.status(404).json({ message: "Product not found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching product." });
    }
}

export async function getProductByProductId(request, response) {
    try {
        const { id } = request.params;

        // TODO: Need to check whether id is valid
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return response.status(400).send({
        //         message: `Invalid user id`,
        //     });
        // }

        const product = await Product.find({ productID: id }).exec();

        if (product) {
            return response.status(200).json(product);
        } else {
            return response.status(404).json({ message: "Product not found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching products." });
    }
}

export async function saveNewProduct(request, response) {
    try {
        if (
            !request.body.productName ||
            !request.body.price ||
            !request.body.quantityInStock ||
            !request.body.measurable
        ) {
            return response.status(400).send({
                message: `Send all required fields: product Name, product Id, price, quantityInStock`,
            });
        }

        const products = await Product.find();
        const productId = products.length++;

        const newProduct = {
            productName: request.body.productName,
            productID: productId,
            price: request.body.price,
            quantityInStock: request.body.quantityInStock,
            measurable: request.body.measurable,
        };

        const product = await Product.create(newProduct);
        return response.status(201).send(product);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
}

export async function updateProduct(request, response) {
    try {
        // NOTE: No need to require all fields when updating
        // if (
        //     !request.body.productName ||
        //     !request.body.price ||
        //     !request.body.quantityInStock
        // ) {
        //     return response.status(400).send({
        //         message: `Send all required fields: product Name, product Id, price, quantityInStock`,
        //     });
        // }

        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: `Invalid product id`,
            });
        }

        const result = await Product.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).send({
                message: `Product not found`,
            });
        }

        return response.status(200).send({
            message: `Product successfully updated!`,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
}

export async function deleteProductById(request, response) {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: `Invalid product id`,
            });
        }

        const result = await Product.findByIdAndDelete(id);

        if (result) {
            return response.status(404).json({
                message: `Product successfully deleted!`,
            });
        } else {
            return response.status(404).json({ message: "Product not found." });
        }
    } catch (error) {
        console.log(error.message);
        return response
            .status(500)
            .json({ error: "An error occurred while fetching products." });
    }
}
