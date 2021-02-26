"use strict";

const express = require("express");
const routes = express.Router();

const cartItems = [
    {
        id: 1,
        product: "bubbles",
        price: 3,
        quantity: 20
    },
    {
        id: 2,
        product: "socks",
        price: 8.50,
        quantity: 12
    },
    {
        id: 3,
        product: "baseball bat",
        price: 32,
        quantity: 4
    },
    {
        id: 4,
        product: "candle",
        price: 7.75,
        quantity: 18
    },
    {
        id: 5,
        product: "solo cup",
        price: .25,
        quantity: 405
    },
];

let nextId = 6;

routes.get("/cart-items", (req, res)=>{
    let maxPrice = req.query.maxPrice;
    let prefix = req.query.prefix;
    let pageSize = req.query.pageSize;
    let filteredCartItems = cartItems;
    if(maxPrice){
        filteredCartItems = filteredCartItems.filter((item)=>{
            return item.price <= parseInt(maxPrice);
        });
    }
    if(prefix){
        filteredCartItems = filteredCartItems.filter((item)=>{
            return item.product.toLowerCase().startsWith(prefix.toLowerCase().trim());
        });
    }
    if(pageSize){
        filteredCartItems = filteredCartItems.slice(0,pageSize);
    }
    res.json(filteredCartItems);
});

routes.get("/cart-items/:id", (req, res)=>{
    let id = parseInt(req.params.id);
    let foundCartItem = cartItems.find((item)=>{
        return item.id === id;
    })
    if(foundCartItem){
        res.json(foundCartItem)
    } else {
        res.status(404);
        res.send(`no item with id: ${id}`)
    }
    res.json(foundCartItem);
});

routes.post("/cart-items", (req, res)=>{
    let cartItem = req.body;
    cartItem.id = nextId++;
    cartItems.push(cartItem);
    res.status(201);
    res.json(cartItem);
});

routes.put("/cart-items/:id", (req, res)=>{
    let id = req.params.id;
    let updatedCartItem = req.body;
    updatedCartItem.id = id;
    let index = cartItems.findIndex((item)=>{
        return item.id ===parseInt(id);
    })
    cartItems[index] = updatedCartItem;
    res.json(updatedCartItem);
});

routes.delete("/cart-items/:id", (req, res)=>{
    let id = parseInt(req.params.id);
    let index = cartItems.findIndex((item)=>{
        return item.id === id;
    });
    if(index === -1){
        res.status(404);
        res.send(`no item found with id: ${id}`);
    } else {
        cartItems.splice(index, 1);
        res.sendStatus(204);
    }
});

module.exports = routes;