import { defineStore } from 'pinia';
//import products from "@/data/products.json";

export const useProductStore = defineStore('products', {
    state: () => ({
        products: []
    }),
    getters: {
    },
    actions: {
        async fill() {
            this.products = (await import("@/data/products.json")).default
        }
    }
});