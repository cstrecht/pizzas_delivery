//  🍕 "ORDER YOUR PIZZA!" PROJECT
// 1. MAPPING THE PIZZAS (pizzas.js):
let cart = []; //carrinho de compras inicialmente vazio
let modalQt = 1; // para começar com a quantidade em 1
let modalKey = 0; // para selecionar a pizza

const p = (element) => document.querySelector(element);
const pz = (element) => document.querySelectorAll(element);
pizzaJson.map((pizza, index) => {
  // 👇🏻 manipular elementos e clonar os divs para nao repetir o codigo para apresekntar todas as pizzas
  let pizzaItem = p(".models .pizza-item").cloneNode(true);
  // 👇🏻 Adicionar a pizza info (imagem, preco, nome, descricao)
  pizzaItem.setAttribute("data-key", index); // enumera as pizzas
  pizzaItem.querySelector(".pizza-item--img img").src = pizza.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `$ ${pizza.price.toFixed(2)}`; // 2 algarismos significativos
  pizzaItem.querySelector(".pizza-item--name").innerHTML = pizza.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = pizza.description;

  // 👇🏻 "click event" quando clicar na pizza, remover efeito da anchor tag:
  pizzaItem.querySelector("a").addEventListener("click", (event) => {
    event.preventDefault();

    let key = event.target.closest(".pizza-item").getAttribute("data-key"); // obtem o index das pizzas clicadas
    modalQt = 1;
    modalKey = key;
    // 👇🏻 associar as informacoes das pizzas às proprias pizzas:
    p(".pizzaBig img").src = pizzaJson[key].img;
    p(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    p(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    p(".pizzaInfo--actualPrice").innerHTML = `$ ${pizzaJson[key].price.toFixed(
      2
    )}`;
    p(".pizzaInfo--size.selected").classList.remove("selected");
    pz(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 1) {
        size.classList.add("selected"); // para manter a pizza média sempre selecionada
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
    // Pop-up / Modal: ANIMAÇÃO DE ABERTURA
    p(".pizzaInfo--qt").innerHTML = modalQt;
    p(".pizzaWindowArea").style.opacity = 0;
    p(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      p(".pizzaWindowArea").style.opacity = 1; // 👈🏻 aparece a janela "modal" com animação
    }, 100);
  });
  p(".pizza-area").append(pizzaItem);
});
// ---
// EVENTOS DO POP-UP(modal)
// 1. Fechar o pop-up, é o processo inverso que foi feito acima para criar a animacao
function closeModal() {
  p(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    p(".pizzaWindowArea").style.display = "none";
  }, 500);
}
pz(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);
// ----
// Ação dos botões "+" e "-" na quantidade (pop-up):
p(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    // 👆🏻 condicao necessaria para nao haver quantidades igual a 0 ou  negativas
    modalQt--;
    p(".pizzaInfo--qt").innerHTML = modalQt;
  }
});
p(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++; // 👈🏻 aumenta de 1 a 1 a quantidade que comeca em 1 (variavel modalQt = 1)
  p(".pizzaInfo--qt").innerHTML = modalQt;
});
// ---
// Selecionar o tamanho da pizza:
pz(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    p(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected"); // usei "size" em vez de "e.target" para nao partir o codigo e selecionar os tamanhos as vezes que eu quiser
  });
});
// Ação do carrinho de compras:
p(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(p(".pizzaInfo--size.selected").getAttribute("data-key"));
  // Problema: quando as pizzas sao do mesmo sabor e do mesmo tamanho, elas devem de se somar no carrinho, e não ficar em modo "lista"
  // 👇🏻 identificador para saber se o item ja esta no carrinho e para nao se repetir
  let identifier = pizzaJson[modalKey].id + "@" + size;
  // verificar a key do item:
  let key = cart.findIndex((item) => item.identifier == identifier); // dos identificadores do carrinho, qual deles tem o mesmo identificador que o meu
  if (key > -1) {
    cart[key].qt += modalQt; // se encontrou, adiciona na quantidade
  } else {
    // se nao encontrou, coloca como se fosse um novo artigo no carrinho.
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart(); // atualizaçao do carrinho
  closeModal(); // para fechar o modal quando clicar em 'add to cart'
});
//para ABRIR o carrinho do mobile
p(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    p("aside").style.left = 0;
  }
});
// FECHAR ao carregar no 'X' no mobile
p(".menu-closer").addEventListener("click", () => {
  p("aside").style.left = "100vw";
});

// // ⚠️ NOT WORKING: para fechar no desktop
// p(".close-menu-desktop").addEventListener("click", () => {
//   p("aside.show").style.width = "0vw";
// });
// // para voltar a abrir no desktop
// p(".pizzaInfo-addButton").addEventListener("click", () => {
//   if (aside.show.width < 30) {
//     p("aside").style.width = 30;
//   }
// });
// Funcao para o carrinho receber atualizaçoes 👇🏻
function updateCart() {
  p(".menu-openner span").innerHTML = cart.length;
  // caso existem items no carrinho, ou seja, o length do cart é maior que zero
  if (cart.length > 0) {
    p("aside").classList.add("show");
    p(".cart").innerHTML = "";

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id); // ？ not my code but it worked
      subtotal += pizzaItem.price * cart[i].qt;

      let cartItem = p(".models .cart--item").cloneNode(true);
      // PREENCHER as infos para o carrinho
      let pizzaSizeName;
      // condicao para o tamanho das pizzas
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "Small";
          break;
        case 1:
          pizzaSizeName = "Medium";
          break;
        case 2:
          pizzaSizeName = "Big";
          break;
      }
      // Organizacao do carrinho:
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1); // remover 1 item
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      p(".cart").append(cartItem);
    }
    desconto = subtotal * 0.1;
    total = subtotal - desconto;
    // exibir no ecra o subtotal, desconto e total:
    p(".subtotal span:last-child").innerHTML = `$ ${subtotal.toFixed(2)}`;
    p(".desconto span:last-child").innerHTML = `$ ${desconto.toFixed(2)}`;
    p(".total span:last-child").innerHTML = `$ ${total.toFixed(2)}`;
  } else {
    p("aside").classList.remove("show");
    p("aside").style.left = "100vw";
  }
}

// ⚠️ como fechar o menu em desktop? funcao on click ou addEventListener nao esta a funcinar, MAS funciona no mobile
// o menu fecha, mas ao voltar a selecionar coisas para o carrinho o menu nao volta a abrir.
