import PropTypes from 'prop-types';
import React from 'react';
import { getProductById } from '../services/api';

class Details extends React.Component {
  state = {
    title: '',
    thumbnail: '',
    price: '',
    itensCarrinhos: [],
    produto: {},
  };

  async componentDidMount() {
    const { match: { params: { id } } } = this.props;
    const dados = await getProductById(id);
    this.setState({
      title: dados.title,
      thumbnail: dados.thumbnail,
      price: dados.price,
      produto: dados,
    });
  }

  addToCart = (objProduto) => {
    this.setState((prev) => ({
      itensCarrinhos: [...prev.itensCarrinhos, objProduto],
    }), () => {
      const { itensCarrinhos } = this.state;
      console.log(itensCarrinhos);
      if (localStorage.getItem('Carrinho')) {
        localStorage
          .setItem('Carrinho', JSON.stringify([...JSON
            .parse(localStorage.getItem('Carrinho')), itensCarrinhos[0]]));
      } else {
        localStorage.setItem('Carrinho', JSON.stringify(itensCarrinhos));
      }
    });
  };

  render() {
    const { title, thumbnail, price, produto } = this.state;

    return (
      <>
        <button
          data-testid="shopping-cart-button"
          type="button"
          onClick={ () => {
            const { history } = this.props;
            history.push('/cart');
          } }
        >
          Carrinho
        </button>
        <p data-testid="product-detail-name">{title}</p>
        <img data-testid="product-detail-image" src={ thumbnail } alt="" />
        <p data-testid="product-detail-price">{price}</p>
        <button
          type="button"
          data-testid="product-detail-add-to-cart"
          onClick={ () => this.addToCart(produto) }
        >
          ADICIONAR AO CARRINHO
        </button>
      </>
    );
  }
}

Details.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;

export default Details;
