import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Category
export const get_category = createAsyncThunk(
    'product/get_category',
    async (_, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get('/home/get-categorys');
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Products
export const get_products = createAsyncThunk(
    'product/get_products',
    async (_, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get('/home/get-products');
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Price Range Product
export const price_range_product = createAsyncThunk(
    'product/price_range_product',
    async (_, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get('/home/price-range-latest-product');
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Query Products
export const query_products = createAsyncThunk(
    'product/query_products',
    async (query, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/query-products?category=${query.category}&&rating=${query.rating}&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${query.sortPrice}&&pageNumber=${query.pageNumber}&&searchValue=${query.searchValue ? query.searchValue : ''}`);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Product Details
export const product_details = createAsyncThunk(
    'product/product_details',
    async (slug, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/product-details/${slug}`);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Customer Review
export const customer_review = createAsyncThunk(
    'review/customer_review',
    async (info, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.post('/home/customer/submit-review', info);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Get Reviews
export const get_reviews = createAsyncThunk(
    'review/get_reviews',
    async ({ productId, pageNumber }, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Get Banners
export const get_banners = createAsyncThunk(
    'banner/get_banners',
    async (_, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/banners`);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Reducer Slice
export const homeReducer = createSlice({
    name: 'home',
    initialState: {
        categorys: [],
        products: [],
        totalProduct: 0,
        parPage: 3,
        latest_product: [],
        topRated_product: [],
        discount_product: [],
        priceRange: {
            low: 0,
            high: 100
        },
        product: {},
        relatedProducts: [],
        moreProducts: [],
        errorMessage: '',
        successMessage: '',
        totalReview: 0,
        rating_review: [],
        reviews: [],
        banners: []
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_category.fulfilled, (state, { payload }) => {
                state.categorys = payload.categorys;
            })
            .addCase(get_category.rejected, (state) => {
                state.errorMessage = "Failed to load categories.";
            })
            .addCase(get_products.fulfilled, (state, { payload }) => {
                state.products = payload.products;
                state.latest_product = payload.latest_product;
                state.topRated_product = payload.topRated_product;
                state.discount_product = payload.discount_product;
            })
            .addCase(get_products.rejected, (state) => {
                state.errorMessage = "Failed to load products.";
            })
            .addCase(price_range_product.fulfilled, (state, { payload }) => {
                state.latest_product = payload.latest_product;
                state.priceRange = payload.priceRange;
            })
            .addCase(price_range_product.rejected, (state) => {
                state.errorMessage = "Failed to load price range products.";
            })
            .addCase(query_products.fulfilled, (state, { payload }) => {
                state.products = payload.products;
                state.totalProduct = payload.totalProduct;
                state.parPage = payload.parPage;
            })
            .addCase(query_products.rejected, (state) => {
                state.errorMessage = "Failed to query products.";
            })
            .addCase(product_details.fulfilled, (state, { payload }) => {
                state.product = payload.product;
                state.relatedProducts = payload.relatedProducts;
                state.moreProducts = payload.moreProducts;
            })
            .addCase(product_details.rejected, (state) => {
                state.errorMessage = "Failed to load product details.";
            })
            .addCase(customer_review.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
            })
            .addCase(customer_review.rejected, (state) => {
                state.errorMessage = "Failed to submit customer review.";
            })
            .addCase(get_reviews.fulfilled, (state, { payload }) => {
                state.reviews = payload.reviews;
                state.totalReview = payload.totalReview;
                state.rating_review = payload.rating_review;
            })
            .addCase(get_reviews.rejected, (state) => {
                state.errorMessage = "Failed to load reviews.";
            })
            .addCase(get_banners.fulfilled, (state, { payload }) => {
                state.banners = payload.banners;
            })
            .addCase(get_banners.rejected, (state) => {
                state.errorMessage = "Failed to load banners.";
            });
    }
});

export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;