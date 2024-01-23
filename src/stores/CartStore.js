import { defineStore, acceptHMRUpdate } from 'pinia';
import { groupBy } from "lodash";
import { useAuthUserStore } from "../stores/AuthUserStore";
import { useLocalStorage } from "@vueuse/core";

export const useCartStore = defineStore('cart', {
    historyEnabled: true,
    state: () => ({
        //products:[],
        products: useLocalStorage("CartStore:items", []),
    }),
    getters: {
        size(state) {
            return state.products.length;
        },
        totalSum(state) {
            return state.products.reduce((acc, product) => acc + product.price * product.count, 0);
        },
        totalCount(state) {
            return state.size > 0 ? state.products.reduce((acc, product) => acc + product.count, 0) : 0;
        },
        isEmpty() {
            return this.totalCount === 0
        },
        grouped: state => groupBy(state.products, product => product.name),
        groupCount: () => (name) => this.grouped[name]['count']
    },
    actions: {
        addCart(newProduct) {

            if (this.products.length === 0) {
                this.products.push({ ...newProduct });
                return;
            }

            const indexOfProduct = this.products.findIndex((product) => product.name === newProduct.name);
            if (indexOfProduct === -1) {
                this.products.push({ ...newProduct });
            }
            else {
                this.products[indexOfProduct].count += newProduct.count;
            }
        },
        setItemCount(newCount, itemName) {
            const indexOfProduct = this.products.findIndex((product) => product.name === itemName);
            if (indexOfProduct !== -1) {
                this.products[indexOfProduct].count = newCount;
            }
        },
        removeItem(itemName) {
            this.products = this.products.filter(product => product.name !== itemName);
        },
        checkout() {
            const authUserStore = useAuthUserStore();
            alert(`Mr. ${authUserStore.username} just bought ${this.totalCount} items at a total of $${this.totalSum}`)
        },
        reset() {
            this.products = [];
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
