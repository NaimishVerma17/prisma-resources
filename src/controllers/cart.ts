import { Request, Response } from 'express';
import { ChangeQuantitySchema, CreateCartSchema } from '../schema/cart';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { Product } from '@prisma/client';
import { prismaCilent } from '..';

export const addItemToCart =async (req: Request, res: Response) => {
    // Check for the existence of the same product in user's cart and alter the quantity as required
    const validatedData = CreateCartSchema.parse(req.body)
    let product: Product;
    try {
        product = await prismaCilent.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    } catch(err) {
        throw new NotFoundException('Product not found!', ErrorCode.PRODUCT_NOT_FOUND)
    }
    const cart = await prismaCilent.cartItem.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    })
    res.json(cart)
}

export const deleteItemFromCart =async (req: Request, res: Response) => {
    // Check if user is deleting its own cart item
    await prismaCilent.cartItem.delete({
        where:{
            id: +req.params.id
        }
    })
    res.json({success: true})
    
}

export const changeQuantity =async (req: Request, res: Response) => {
    // Check if user is updating its own cart item
    const validatedData = ChangeQuantitySchema.parse(req.body)
    const updatedCart = await prismaCilent.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    })

    res.json(updatedCart)
    
}

export const getCart =async (req: Request, res: Response) => {
    const cart = await prismaCilent.cartItem.findMany({
        where: {
            userId: req.user.id
        },
        include:{
            product: true
        }
    })
    res.json(cart)
}
