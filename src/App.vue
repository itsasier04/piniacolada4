<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
//import products from "@/data/products.json";
import { useProductStore } from "./stores/ProductsStore";
import { useCartStore } from "./stores/CartStore";
import { storeToRefs } from "pinia";
// import { reactive, ref } from "vue";

const productsStore = useProductStore();
const { products } = storeToRefs(useProductStore());
productsStore.fill();
const { addCart } = useCartStore();
const cartStore = useCartStore();


const add = (event, product) => {
  const newProduct = { name: product.name, count: event, price: product.price };
  addCart(newProduct);
}

cartStore.$onAction(({
  name,
  store,
  args,
  after,
  onError
}) => {
  console.log(store);
  if (name === 'addCart') {
    after(() => {
      console.log(args[0])
    })
    onError((error) => {
      console.log("Hello error:", error.message);
    });

  }
})

</script>

<template>
  <div class="container">
    <TheHeader />
    <div class="mb-5 flex justify-end">
      <AppButton @click="cartStore.undo()">Undo</AppButton>
      <AppButton class="ml-2" @click="cartStore.redo()">Redo</AppButton>
    </div>
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard v-for="product in products" :key="product.name" :product="product" @addToCart="add($event, product)" />
    </ul>
  </div>
</template>
