import React from 'react';
import { TiArrowBack } from 'react-icons/ti';
import { NavLink } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import logo from '../img/logo.png';
import '../css/Cart.css';

class Cart extends React.Component {
  state = {
    productArray: [],
    localStorageArray: [],
  };

  componentDidMount() {
    const dados = JSON.parse(localStorage.getItem('Carrinho')) || [];
    const dadosTratados = [...new Map(dados.map((item) => [item.id, item])).values()];

    if (dados) {
      this.setState({
        productArray: dadosTratados,
        localStorageArray: JSON.parse(localStorage.getItem('Carrinho')),
      });
    }
  }

  removeProduct = (e) => {
    this.setState((prev) => ({
      productArray: [...prev.productArray
        .filter((element) => element.id !== e.target.parentNode.id)],
    }), () => {
      const { productArray } = this.state;
      localStorage.setItem('Carrinho', JSON.stringify(productArray));
    });
  };

  addProduct = (objeto) => {
    this.setState((prev) => ({
      localStorageArray: [...prev.localStorageArray, objeto],
    }), () => {
      const { localStorageArray } = this.state;
      localStorage.setItem('Carrinho', JSON.stringify(localStorageArray));
    });
  };

  rProduct = (event, objeto) => {
    const { localStorageArray } = this.state;
    const newArray = [...localStorageArray];
    const newArray2 = newArray.filter((element) => element.id === objeto.id);
    const newArray3 = newArray.filter((element) => element.id !== objeto.id);
    newArray2.pop();
    if (newArray2.length >= 1) {
      this.setState({
        localStorageArray: [...newArray2, ...newArray3],
      }, () => {
        // eslint-disable-next-line no-shadow
        const { localStorageArray } = this.state;
        localStorage.setItem('Carrinho', JSON.stringify(localStorageArray));
      });
    }
  };

  render() {
    const { productArray, localStorageArray } = this.state;
    const quantidadeProdutos = (
      <div
        className="total-products"
      >
        <p>
          Quantidade total de produtos:
        </p>
        <h3 className="length">
          {productArray.length}
        </h3>
      </div>);

    const vazio = (
      <div>
        <p
          data-testid="shopping-cart-empty-message"
        >
          Seu carrinho está vazio.
        </p>
      </div>
    );
    const compras = productArray.map((e) => (
      <div className="car-container" id={ e.id } key={ e.id }>
        <button
          type="button"
          data-testid="remove-product"
          onClick={ this.removeProduct }
        >
          <MdDelete />
        </button>
        <img src={ e.thumbnail } alt={ e.id } />
        <p
          data-testid="shopping-cart-product-name"
        >
          {e.title}
        </p>
        <p>{e.price}</p>
        <section className="quantidade">
          <button
            type="button"
            data-testid="product-increase-quantity"
            onClick={ () => this.addProduct(e) }
          >
            +
          </button>
          <p data-testid="shopping-cart-product-quantity">
            { // VÁRIOS DATA-TESTS REPETIDOS, DANDO ERRO! CONFLITO NA 8 E 10
              localStorageArray.filter((element) => e.id === element.id).length
            }
          </p>
          <button
            type="button"
            data-testid="product-decrease-quantity"
            onClick={ (event) => this.rProduct(event, e) }
          >
            -
          </button>
        </section>

      </div>
    ));
    return (
      <div>
        <header className="header-container">
          <NavLink className="icon-back" to="/">
            <TiArrowBack />
          </NavLink>
          <img
            src={ logo }
            alt="logo-online-store"
            className="logo-online-store-cart"
          />
        </header>
        {productArray.length === 0 ? vazio : compras}
        {(productArray.length !== 0) && quantidadeProdutos}
      </div>
    );
  }
}

export default Cart;
