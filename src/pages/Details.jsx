import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { TiArrowBack } from 'react-icons/ti';
import { getProductById } from '../services/api';
import '../css/Details.css';
import logo from '../img/logo.png';

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
        <div className="header-container-details">
          <NavLink className="icon-back" to="/">
            <TiArrowBack />
          </NavLink>
          <img
            src={ logo }
            alt="logo-online-store"
            className="logo-online-store-details"
          />
          <button
            data-testid="shopping-cart-button"
            type="button"
            onClick={ () => {
              const { history } = this.props;
              history.push('/cart');
            } }
            className="shopping-cart-button"
          >
            <HiOutlineShoppingCart />
          </button>
        </div>
        <div className="conteudo">
          <h2
            data-testid="product-detail-name"
          >
            {title}
          </h2>
          <img
            data-testid="product-detail-image"
            src={ thumbnail }
            alt=""
          />
          <h2 data-testid="product-detail-price">
            R$
            {price}
          </h2>
          <button
            type="button"
            data-testid="product-detail-add-to-cart"
            onClick={ () => this.addToCart(produto) }
          >
            ADICIONAR AO CARRINHO
          </button>
        </div>
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
