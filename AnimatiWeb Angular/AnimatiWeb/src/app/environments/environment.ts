import { objetoProducto } from "../pages/admin/productos/productos.component";

let Codigo_Producto: any | objetoProducto["Codigo_Producto"]
export const environment = {
  production: false,
  urlHost:'http://localhost:8000/',
  urlApi: 'http://localhost:8000/api/',
  API_END_POINT: 'http://localhost:8000/api/',

  METHODS: {
    SLASH: '/',
    GET_ALL_PRODUCT: 'listaproductos',
    GET_PRODUCT_BY_ID: `Producto/${Codigo_Producto}`,
    GET_ALL_CATEGORY: 'vercategoria',
    CREATE_NEW_CATEGORY: 'CreateNewCategory',
    CREATE_PRODUCT: 'añadirproducto',
    UPDATE_PRODUCT: 'update/',
    DELETE_PRODUCT: 'delete/',
    ADD_TO_CART: 'ADDTOCART',
    GET_CART_BY_CUST: 'GetCartProductsByCustomerId?id=',
    REMOVE_CART: 'DeleteProductFromCartById?ID=',
    LOGIN: 'Login',
    USER_TOKEN_LOGIN: 'Login',
    REGISTER: 'RegisterCustomer',
    PLACE_ORDER: 'PlaceOrder',
    GET_ALL_OFFERS: 'GetAllOffers',
    CREATE_NEW_OFFER: 'CreateNewOffer',
    GET_CUSTOMER_BY_ID: 'GetCustomerById?id=',
    UPDATE_PROFILE: 'UpdateProfile',
    GET_ALL_SALE_BY_CUSTOMER_ID: 'GetAllSaleByCustomerId?id=',
    CANCEL_ORDER_BY_SALE_ID: 'cancelOrder?saleId=',
    OPEN_SALE_BY_SALE_ID: 'OpenSaleBySaleId?saleId='
  }
};
  