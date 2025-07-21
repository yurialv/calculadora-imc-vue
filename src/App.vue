<script setup>
// Importa o componente IMCCalculator
import IMCCalculator from "./components/IMCCalculator.vue";
</script>

<template>
  <IMCCalculator />
</template>

<style>
/* Estilos CSS globais para toda a sua aplicação Vue */
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap");

body {
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(to right, #ece9e6, #ffffff);
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased; /* Melhor renderização de fontes */
  -moz-osx-font-smoothing: grayscale; /* Melhor renderização de fontes */
}

#app {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 600px) {
  body {
    padding: 10px;
    align-items: flex-start;
  }
}
</style>
