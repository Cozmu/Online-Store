import React from 'react';
import { NavLink } from 'react-router-dom';
import { ImSearch } from 'react-icons/im';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';
import '../css/Search.css';
import logo from '../img/logo.png';

class Search extends React.Component {
  constructor() {
    super();

    this.state = {
      category: [],
      query: '',
      products: [],
      toggle: false,
      categoryRadio: '',
      ArrayCategoria: [],
      itensCarrinhos: [],
    };
  }

  async componentDidMount() {
    const storage = localStorage.getItem('Carrinho');
    if (storage) {
      this.setState({
        itensCarrinhos: JSON.parse(storage),
      });
    }
    const newRequest = await getCategories();
    this.setState({ category: newRequest });
  }

  onInputChange = ({ target: { value, type, name, id } }) => {
    const valor = type === 'radio' ? id : value;
    this.setState({
      [name]: valor,
    }, () => this.handleClickSelect());
  };

  handleClickSelect = async () => {
    const { categoryRadio } = this.state;
    const request = await getProductsFromCategoryAndQuery(categoryRadio, null);
    if (request.results.length === 0) {
      this.setState({
        toggle: true,
      });
    } else {
      this.setState({
        ArrayCategoria: request.results,
        toggle: false,
      });
    }
  };

  handleClick = async () => {
    const { query } = this.state;
    const request = await getProductsFromCategoryAndQuery(null, query);
    if (request.results.length === 0) {
      this.setState({
        toggle: true,
      });
    } else {
      this.setState({
        products: request.results,
        toggle: false,
        categoryRadio: '',
      });
    }
  };

  addToCart = (produto) => {
    this.setState((prev) => ({
      itensCarrinhos: [...prev.itensCarrinhos, produto],
    }), () => {
      const { itensCarrinhos } = this.state;
      localStorage.setItem('Carrinho', JSON.stringify(itensCarrinhos));
    });
  };

  render() {
    const { category,
      query,
      products,
      toggle,
      categoryRadio,
      ArrayCategoria } = this.state;
    const queryResults = products.map((element) => (
      <div
        className="product-cards"
        data-testid="product"
        key={ element.id }
      >
        <NavLink data-testid="product-detail-link" to={ element.id }>
          <img src={ element.thumbnail } alt={ element.id } />
          <p
            className="product-title"
          >
            {element.title}
          </p>
          <p>
            R$
            {element.price}
          </p>
        </NavLink>
        <button
          type="button"
          data-testid="product-add-to-cart"
          onClick={ () => this.addToCart(element) }
        >
          Adicionar ao Carrinho
        </button>
      </div>
    ));
    const categoryResults = ArrayCategoria.map((e) => (
      <div
        data-testid="product"
        className="product-cards"
        key={ e.id }
      >
        <NavLink data-testid="product-detail-link" to={ e.id }>
          <img src={ e.thumbnail } alt={ e.id } />
          <p
            className="product-title"
          >
            {e.title}
          </p>
          <p>
            R$
            {e.price}
          </p>
        </NavLink>
        <button
          type="button"
          data-testid="product-add-to-cart"
          onClick={ () => this.addToCart(e) }
        >
          Adicionar ao Carrinho
        </button>
      </div>
    ));
    return (
      <>
        <section className="header-container">
          <div className="search-container">
            <label htmlFor="query">
              <input
                type="text"
                name="query"
                id="query"
                className="query"
                value={ query }
                placeholder="Digite oque você busca"
                onChange={ this.onInputChange }
                data-testid="query-input"
              />
            </label>
            <button
              type="button"
              onClick={ this.handleClick }
              data-testid="query-button"
              className="query-button"
            >
              <ImSearch />
            </button>
          </div>
          <img
            src={ logo }
            alt="logo-online-store"
            className="logo-online-store"
          />
          <nav>
            <NavLink
              to="/cart"
              data-testid="shopping-cart-button"
              className="shopping-cart-button"
            >
              <HiOutlineShoppingCart />
            </NavLink>
          </nav>
        </section>
        <div className="container">
          <div className="category-container">
            <h1>Categorias</h1>
            <hr />
            { category.map((element) => (
              <section
                className="category-card"
                key={ element.id }
              >
                <label
                  className="category"
                  htmlFor={ element.id }
                  data-testid="category"
                >
                  <input
                    type="radio"
                    value={ element.name }
                    id={ element.id }
                    name="categoryRadio"
                    onChange={ this.onInputChange }
                  />
                  { element.name }
                </label>
              </section>
            )) }
          </div>
          <section className="product-container">
            {toggle && <p>Nenhum produto foi encontrado</p> }
            {categoryRadio.length > 0 ? categoryResults : queryResults }
            {(categoryRadio.length === 0 && query.length === 0)
             && (
               <div className="home-initial-message">
                 <p
                   data-testid="home-initial-message"
                 >
                   Digite algum termo de pesquisa ou escolha uma categoria.
                 </p>
               </div>)}
          </section>
        </div>
      </>
    );
  }
}

export default Search;
