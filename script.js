function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;

  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

let somaValue = 0;
async function valueOfProduct(salePrice) {
  const total = document.querySelector('.total-price');
  somaValue += salePrice;
  total.innerText = somaValue;
}

function cartItemClickListener(event) {
  const dadItemsList = document.querySelector('.cart__items');
  dadItemsList.addEventListener('click', (event) => {
    event.target.remove();
    saveList();
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  valueOfProduct(salePrice);
  return li;
}

function loadingStar() {
  const loadDad = document.querySelector('.load');
  const loadingAdd = document.createElement('h1');
  loadingAdd.className = 'loading';
  loadDad.appendChild(loadingAdd);
}

function loadingStop() {
  const loadingRemove = document.querySelector('.loading');
  loadingRemove.remove();
}

function searchProduct() {
  const valueItem = document.querySelector('#valueItem');
  valueItem.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      listProduct(valueItem.value);
    }
  });
}

async function listProduct(value = 'computador') {
  const apiUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${value}`;
  const items = document.querySelector('.items');
  items.innerHTML = '';
  loadingStar();
  const response = await fetch(apiUrl);
  const object = await response.json();
  const results = object.results;
  setTimeout(() => {
    results.forEach((result) => {
      const { id: sku, title: name, thumbnail: image } = result;
      const element = createProductItemElement({ sku, name, image });
      items.appendChild(element);
    });
    loadingStop();
  }, 2000);
}

function saveList() {
  const dadCartList = document.querySelector('.cart__items');
  const totalPrices = document.querySelector('.total-price');
  localStorage.setItem('cart', dadCartList.innerHTML);
  localStorage.setItem('price', totalPrices.innerHTML);
}

function LoadingList() {
  const cartList = document.querySelector('.cart__items');
  const totalPrices = document.querySelector('.total-price');
  cartList.innerHTML = localStorage.getItem('cart');
  totalPrices.innerHTML = localStorage.getItem('price');
}

function addProductCart() {
  const sectionButtons = document.querySelector('.items');
  sectionButtons.addEventListener('click', async (event) => {
    const myId = getSkuFromProductItem(event.target.parentNode);
    const apiProduct = `https://api.mercadolibre.com/items/${myId}`;
    const response = await fetch(apiProduct);
    const object = await response.json();
    const objProduct = {
      sku: myId,
      name: object.title,
      salePrice: object.price,
    };
    const cartDadList = document.querySelector('.cart__items');
    const productToCart = createCartItemElement(objProduct);
    cartDadList.appendChild(productToCart);
    saveList();
  });
}

function buttonRemovelist() {
  const buttoClear = document.querySelector('.empty-cart');
  buttoClear.addEventListener('click', () => {
    const cartDadList = document.querySelector('.cart__items');
    const totalPrices = document.querySelector('.total-price');
    cartDadList.innerHTML = '';
    totalPrices.innerText = '';
    somaValue = 0;
    saveList();
  });
}

window.onload = function onload() {
  listProduct();
  addProductCart();
  buttonRemovelist();
  LoadingList();
  searchProduct();
};
