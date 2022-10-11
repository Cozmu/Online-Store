import React from 'react';

class Cart extends React.Component {
  state = {
    productArray: [],
  };

  componentDidMount() {
    const dados = localStorage.getItem('Carrinho');
    if (dados) {
      this.setState({
        productArray: JSON.parse(dados),
      });
    }
  }

  render() {
    const { productArray } = this.state;
    const vazio = (
      <p
        data-testid="shopping-cart-empty-message"
      >
        Seu carrinho está vazio.
      </p>
    );
    const compras = productArray.map((e, i) => (
      <div key={ i }>
        <img src={ e.thumbnail } alt={ e.id } />
        <p
          data-testid="shopping-cart-product-name"
        >
          {e.title}
        </p>
        <p>{e.price}</p>
      </div>
    ));
    return (
      <div>
        {productArray.length === 0 ? vazio : compras}
        <div
          data-testid="shopping-cart-product-quantity"
        >
          {productArray.length}

        </div>
      </div>
    );
  }
}

export default Cart;
