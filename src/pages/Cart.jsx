import React from 'react';

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
        const { localStorageArray } = this.state;
        localStorage.setItem('Carrinho', JSON.stringify(localStorageArray));
      });
    }
  };

  render() {
    const { productArray, localStorageArray } = this.state;
    const quantidadeProdutos = (
      <div>
        <br />
        <br />
        Quantidade total de produtos:
        {productArray.length}
      </div>);

    const vazio = (
      <p
        data-testid="shopping-cart-empty-message"
      >
        Seu carrinho está vazio.
      </p>
    );
    const compras = productArray.map((e, i) => (
      <div id={ e.id } key={ i }>
        <img src={ e.thumbnail } alt={ e.id } />
        <p
          data-testid="shopping-cart-product-name"
        >
          {e.title}
        </p>
        <p>{e.price}</p>
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
        <button
          type="button"
          data-testid="remove-product"
          onClick={ this.removeProduct }
        >
          Remover produto
        </button>
      </div>
    ));
    return (
      <div>
        {productArray.length === 0 ? vazio : compras}
        {(productArray.length !== 0) && quantidadeProdutos}
      </div>
    );
  }
}

export default Cart;
