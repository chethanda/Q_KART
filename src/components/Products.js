import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart from "./Cart";
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


const Products = () => {
  const { enqueueSnackbar } = useSnackbar()
  const productsInit = {
    'products' : []
  }
  const [debounceTime, setDebounceTime] = useState()
  const [allProducts, setAllProducts] = useState(productsInit)
  const [loading, setLoading] = useState(true)
  const [found, setFound] = useState(true)
  const token = localStorage.getItem('token')
  const [cartItems , setCartItems] = useState([])
  useEffect(() => {
    performAPICall()
    fetchCart(token)
  }, [])
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
   try {
     const data = [];
     await axios.get(`${config.endpoint}/products`).then((res) => {
       data.push(...res.data);
       setLoading(false);
       setAllProducts({
         products: [...data],
       });
     });
   } catch (error) {
     // console.log(error)
     enqueueSnackbar(
       "Something went wrong. Check the backend console for more details",
       { variant: "error" }
     );
   }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      setLoading(true);
      const data = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setLoading(false);
      console.log(data.data);
      console.log(allProducts);
      setAllProducts({
        products: [...data.data],
      });
    } catch (error) {
      // console.log(error.response.status)
      if(error.response.status === 404)   {
        setAllProducts({
          products: [],
        });
      }
      setLoading(false);
      setFound(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (value, debounceTimeout) => {
    if(debounceTime)  {
      clearTimeout(debounceTime)
    }
    const timeoutID = setTimeout(() => {
      performSearch(value);
    }, debounceTimeout);
    setDebounceTime(timeoutID)

  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
   const fetchCart = async (token) => {
    if (!token) return;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const data = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
      setCartItems([...data.data])
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
      let inCart = false
      items.forEach((ele) => { 
        console.log(ele.productId, "------", productId)
        if(ele.productId === productId)  {
          inCart = true
        }
      })
      return inCart
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (token) {
      let isItemThere = isItemInCart(cartItems, productId)
      console.log(isItemThere)
      if (isItemThere && options.preventDuplicate) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning" }
        );
        // const updateTheCartItem = {
        //   productId: productId,
        //   qty: qty + 1,
        // };
        // try {
        //   const data = await axios.post(
        //     `${config.endpoint}/cart`,
        //     updateTheCartItem,
        //     {
        //       headers: { Authorization: `Bearer ${token}` },
        //     }
        //   );
        //   const newItems = await data.data;
        //   setCartItems(newItems);
        // } catch (e) {
        //   if (e.response && e.response.status === 400) {
        //     enqueueSnackbar(e.response.data.message, { variant: "error" });
        //   } else {
        //     enqueueSnackbar(
        //       "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        //       {
        //         variant: "error",
        //       }
        //     );
        //   }
        // }
      } else {
        const updatedItem = {
          productId: productId,
          qty: qty,
        };
        try {
          const data = await axios.post(
            `${config.endpoint}/cart`,
            updatedItem,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const newItems = await data.data;
          setCartItems(newItems);
        } catch (e) {
          if (e.response && e.response.status === 400) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          } else {
            enqueueSnackbar(
              "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
              {
                variant: "error",
              }
            );
          }
        }
      }
    }
    else {
      enqueueSnackbar("Login to add an item to the Cart", {variant : "error"})
    }
  };







  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endadorment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => {
            debounceSearch(e.target.value, 500);
          }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullwidth
        InputProps={{
          endadornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e.target.value, 500);
        }}
      />
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md = {token && allProducts.products.length ? 9:12}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          {loading ? (
            <div className="loading">
              <CircularProgress />
              <br />
              <strong>Loading Products...</strong>
            </div>
          ) : allProducts.products.length > 0 ? (
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              className="product-grid"
            >
              {allProducts.products.map((ele) => {
                return (
                  <Grid item xs={2} md={3} key={ele._id}>
                    <ProductCard 
                    product={ele} 
                    handleAddToCart = {addToCart} />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <div className="loading">
              <SentimentDissatisfied />
              <br />
              <strong>No products found</strong>
            </div>
          )}
        </Grid>
        {token && (

        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart 
            products={allProducts.products} 
            items={cartItems} 
            handleQuantity = {addToCart}
          />
        </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
