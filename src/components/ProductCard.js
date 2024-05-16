import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
/**
 * 
 * @param {*} param0 
 * @returns 
 * {
"name":"Tan Leatherette Weekender Duffle",
"category":"Fashion",
"cost":150,
"rating":4,
"image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
"_id":"PmInA797xJhMIPti"
}
 */


const ProductCard = ( {product, handleAddToCart} ) => {
  const token = localStorage.getItem('token')
  const {name, category, cost, rating, image, _id} = product
  return (
    <Card className="card">
      <CardMedia component="img" image={image} alt={name} />
      <CardActions className="card-actions">
        <CardContent>
          <Typography variant="body2">{name}</Typography>
          <Typography variant="h6" fullWidth>${cost}</Typography>
          <Rating name="Product-rating" value={rating} readOnly />
          <Button className="card-button" variant="contained"fullWidth onClick = {()=>{handleAddToCart(
            token, 
            [],
            [],
            _id,
            1,
            {preventDuplicate:true}
          )}} >
            <AddShoppingCartOutlined /> ADD TO CART
          </Button>
        </CardContent>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
