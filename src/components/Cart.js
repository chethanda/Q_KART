import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, Grid, IconButton, Link, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData, isReadonly) => {
  let cartItems = [];
  let cartId = [];
  // console.log('This is cartData',cartData)
  if (isReadonly) {
    cartData.forEach((ele) => {
      cartId.push(ele[0]._id);
    });
    productsData.forEach((ele) => {
      // console.log('This is ele from product data ',ele._id)
      if (cartId.includes(ele._id)) {
        // console.log('includes is working')
        let index = cartId.indexOf(ele._id);
        // console.log('This is index',cartData[index][1])
        cartItems.push([ele, cartData[index][1]])
      }
    })
  } else {
    cartData.forEach((ele) => {
      cartId.push(ele.productId);
    });
    productsData.forEach((ele) => {
      // console.log('This is ele from product data ',ele._id)
      if (cartId.includes(ele._id)) {
        // console.log('includes is working')
        let index = cartId.indexOf(ele._id);
        // console.log('This is index',cartData[index][1])
        cartItems.push([ele, cartData[index].qty]);
      }
    });
  }
  // console.log('This is cartId',cartId)
  
 
  return cartItems;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = [], isReadOnly) => {
  // if(isReadOnly)  {

  //   console.log('This is items in checkout',items)
  // }
  if(isReadOnly)  {
    // console.log(items)
  }
  let totalValue = 0;
  items.forEach((ele) => {
    totalValue = totalValue + ele[0].cost * ele[1];
  });
  // console.log(totalValue)
  return totalValue;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ isReadOnly, value, handleAdd, handleDelete }) => {
  
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ isReadOnly, products, items = [], handleQuantity }) => {
  // console.log('This is Readonly', isReadOnly)
  const token = localStorage.getItem("token");
  // console.log('This is token',token)
  // if(isReadOnly)  {
  //   console.log('This is from checkout --- ', products)
  //   console.log('This is from checkout --- ', items)
  // }
  let history = useHistory();
  const cartProductsData = generateCartItemsFrom(items, products, isReadOnly);
  function handleRedirect() {
    history.push('/checkout')
  }
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }
  
  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid container>
            {cartProductsData.map((ele, index) => {
              // console.log(ele)
              return (
                <>
                  <Box
                    key={index}
                    display="flex"
                    alignItems="flex-start"
                    padding="1rem"
                  >
                    <img
                      // Add product image
                      className="image-container"
                      src={ele[0].image}
                      // Add product name as alt eext
                      alt={ele[0].name}
                      width="100%"
                      height="100%"
                    />
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="6rem"
                      paddingX="1rem"
                    >
                      <div>{ele[0].name}</div>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        {isReadOnly ? (
                          <Box padding="0.5rem" data-testid="item-qty">
                          Qty:{ele[0].qty}
                        </Box>
                        ) : (

                        <ItemQuantity
                          // Add required props by checking implementation
                          isReadOnly
                          value={ele[1]}
                          handleAdd={() => {
                            handleQuantity(
                              token,
                              items,
                              products,
                              ele[0]._id,
                              ele[1] + 1
                            );
                          }}
                          handleDelete={() => {
                            handleQuantity(
                              token,
                              items,
                              products,
                              ele[0]._id,
                              ele[1] - 1
                            );
                          }}
                        />
                        )}
                        <Box padding="0.5rem" fontWeight="700">
                          ${ele[0].cost}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </>
              );
            })}

            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
              className="cart-row"
            >
              ${getTotalCartValue(cartProductsData, isReadOnly)}
            </Box>
          </Grid>
        </Box>
        {isReadOnly ? (
          <></>
        ) : (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                handleRedirect();
              }}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Cart;
