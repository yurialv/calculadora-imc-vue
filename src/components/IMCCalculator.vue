<template>
  <div class="container">
    <h1>Calculadora de IMC</h1>
    <p>Preencha seus dados para calcular seu Índice de Massa Corporal</p>

    <div class="input-group">
      <label for="nome">Nome:</label>
      <input type="text" id="nome" v-model="nome" placeholder="Seu nome" />
    </div>

    <div class="input-group">
      <label for="idade">Idade:</label>
      <input
        type="number"
        id="idade"
        v-model.number="idade"
        placeholder="Sua idade"
        min="0"
      />
    </div>

    <div class="input-group">
      <label for="peso">Peso (kg):</label>
      <input
        type="number"
        id="peso"
        v-model.number="peso"
        placeholder="Ex: 70.5"
        step="0.1"
        min="0"
      />
    </div>

    <div class="input-group">
      <label for="altura">Altura (cm):</label>
      <input
        type="number"
        id="altura"
        v-model.number="altura"
        placeholder="Ex: 181"
        step="1"
        min="0"
      />
    </div>

    <button @click="calcularIMC">Calcular IMC</button>

    <h2>Resultado:</h2>
    <div id="resultado">
      <p v-if="resultadoIMC">
        <strong>Classificação:</strong>
        <span :class="classificacaoIMC.classe">{{
          classificacaoIMC.texto
        }}</span>
      </p>

      <template v-if="pesoIdealRange">
        <p v-if="classificacaoIMC.classe !== 'normal'">
          <strong>Peso Ideal:</strong> entre {{ pesoIdealRange.min }} kg e
          {{ pesoIdealRange.max }} kg
        </p>
        <p v-if="excessoDePeso > 0" class="warning">
          Você está aproximadamente {{ excessoDePeso }} kg acima do peso ideal!
        </p>
        <p
          v-else-if="
            peso.value < pesoIdealRange.min &&
            classificacaoIMC.classe !== 'normal'
          "
          class="warning"
        >
          Você está aproximadamente
          {{ (pesoIdealRange.min - peso.value).toFixed(1) }} kg abaixo do peso
          ideal!
        </p>
      </template>
      <p v-else-if="mensagemErro" class="error">{{ mensagemErro }}</p>
      <p v-else>Os resultados aparecerão aqui.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const nome = ref("");
const idade = ref(null);
const peso = ref(null);
const altura = ref(null);

const resultadoIMC = ref(null);
const mensagemErro = ref("");

const pesoIdealRange = computed(() => {
  // Importante: use 'altura.value / 100' aqui para garantir que a altura esteja em metros
  // já que o cálculo do IMC e peso ideal usa altura em metros.
  const h = altura.value / 100; // Altura em metros (baseada na entrada em cm)
  if (isNaN(h) || h <= 0) {
    return null; // Retorna nulo se a altura não for válida
  }
  const imcMin = 18.5; // Limite inferior do IMC considerado normal
  const imcMax = 24.9; // Limite superior do IMC considerado normal
  const pesoMin = imcMin * h * h;
  const pesoMax = imcMax * h * h;
  return {
    min: parseFloat(pesoMin.toFixed(0)),
    max: parseFloat(pesoMax.toFixed(0)),
  };
});

// Propriedade computada para calcular o excesso de peso
const excessoDePeso = computed(() => {
  // Só calcula se o IMC for um número e o peso ideal for calculado
  if (!resultadoIMC.value || peso.value === null || !pesoIdealRange.value) {
    return null; // Se não houver resultado de IMC ou peso ideal, não há excesso
  }
  // Se o peso atual for maior que o limite superior do peso ideal, calcula a diferença
  if (peso.value > pesoIdealRange.value.max) {
    return parseFloat((peso.value - pesoIdealRange.value.max).toFixed(0));
  }
  return 0; // Se não estiver acima do peso ideal, o excesso é zero
});

function calculaValorIMC(p, a) {
  if (isNaN(p) || isNaN(a) || p <= 0 || a <= 0) {
    return null;
  }
  return p / (a * a);
}

const classificacaoIMC = computed(() => {
  const imc = resultadoIMC.value;

  if (imc === null) {
    return { texto: "Dados inválidos.", classe: "error" };
  } else if (imc < 18.5) {
    return { texto: "Abaixo do peso", classe: "warning" };
  } else if (imc >= 18.5 && imc < 24.9) {
    return { texto: "Peso normal", classe: "normal" };
  } else if (imc >= 25 && imc < 29.9) {
    return { texto: "Sobrepeso", classe: "warning" };
  } else if (imc >= 30 && imc < 34.9) {
    return { texto: "Obesidade Grau I", classe: "danger" };
  } else if (imc >= 35 && imc < 39.9) {
    return { texto: "Obesidade Grau II", classe: "danger" };
  } else {
    return { texto: "Obesidade Grau III (Mórbida)", classe: "danger" };
  }
});

const calcularIMC = () => {
  resultadoIMC.value = null;
  mensagemErro.value = "";

  if (
    !nome.value ||
    !idade.value ||
    idade.value <= 0 ||
    !peso.value ||
    peso.value <= 0 ||
    !altura.value ||
    altura.value <= 0
  ) {
    mensagemErro.value =
      "Por favor, preencha todos os campos corretamente com valores válidos.";
    return;
  }

  const alturaEmMetros = altura.value / 100;

  const imc = calculaValorIMC(peso.value, alturaEmMetros);

  if (imc !== null) {
    resultadoIMC.value = imc;
  } else {
    mensagemErro.value =
      "Não foi possível calcular o IMC. Verifique os valores inseridos.";
  }
};
</script>

<style scoped>
/* Os estilos nesta seção são 'scoped', ou seja, eles afetam APENAS este componente */
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap");

.container {
  max-width: 500px;
  width: 100%;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #007bff;
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 2.2em;
}

h2 {
  color: #0056b3;
  margin-top: 30px;
  margin-bottom: 15px;
  font-weight: 500;
  font-size: 1.8em;
}

p {
  line-height: 1.6;
  margin-bottom: 20px;
  font-weight: 300;
}

.input-group {
  text-align: left;
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input[type="text"],
input[type="number"] {
  width: calc(100% - 24px);
  padding: 12px;
  border: 1px solid #c9c9c9;
  border-radius: 6px;
  font-size: 1em;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
  outline: none;
}

button {
  background-color: #28a745;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;
}

button:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

#resultado {
  margin-top: 25px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #f9f9f9;
  text-align: left;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
}

#resultado p {
  margin: 8px 0;
  font-size: 1.05em;
  color: #333;
}

#resultado p strong {
  color: #0056b3;
}

.error {
  color: #dc3545;
  font-weight: 700;
}
.normal {
  color: #28a745;
  font-weight: 700;
}
.warning {
  color: #ffc107;
  font-weight: 700;
}
.danger {
  color: #dc3545;
  font-weight: 700;
}

@media (max-width: 600px) {
  .container {
    padding: 20px;
    border-radius: 0;
    box-shadow: none;
  }

  h1 {
    font-size: 1.8em;
  }

  h2 {
    font-size: 1.5em;
  }

  button {
    padding: 10px 20px;
    font-size: 1em;
  }
}
</style>
