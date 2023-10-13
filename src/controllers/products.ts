import { Request, Response } from "express";
import { prismaCilent } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { error } from "console";

export const createProduct = async(req:Request, res:Response) => {

    // ["tea","india"] => "tea,india"

    // Create a validator to for this request

    const product = await prismaCilent.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })
    res.json(product)

}

export const updateProduct =async (req: Request, res: Response) => {
    try {
        const product = req.body;
        if(product.tags) {
            product.tags = product.tags.join(',')
        }
        const updateProduct  = await prismaCilent.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        })
        res.json(updateProduct)

    } catch(err) {
        throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct =async (req: Request, res: Response) => {
// Assignment
}

export const listProducts =async (req: Request, res: Response) => {
    // {
    //     count: 100,
    //     data: []
    // }

    const count = await prismaCilent.product.count()
    const products = await prismaCilent.product.findMany({
        skip: +req.query.skip || 0,
        take: 5
    })
    res.json({
        count, data:products
    })
    
}

export const getProductById =async (req: Request, res: Response) => {
    try {
        const product = await prismaCilent.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })
        res.json(product)
    } catch(err) {
        console.log(err)
        throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND)
    }
    
}

export const searchProducts =async (req: Request, res: Response) => {

    // implement pagination here

    const products = await prismaCilent.product.findMany({
        where:{
            name: {
                search: req.query.q.toString()
            },
            description: {
                search: req.query.q.toString()
            },
            tags: {
                search: req.query.q.toString()
            },
        }
    })
    res.json(products)
}
    