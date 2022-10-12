import React from 'react';
import { NavLink } from 'react-router-dom';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';

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
    // console.log(typeof JSON.parse(storage));
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
    const queryResults = products.map((element, i) => (
      <div
        className="product-container"
        data-testid="product"
        key={ i }
      >
        <NavLink data-testid="product-detail-link" to={ element.id }>
          <img src={ element.thumbnail } alt={ element.id } />
          <p>{element.title}</p>
          <p>{element.price}</p>
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
    const categoryResults = ArrayCategoria.map((e, i) => (
      <div
        data-testid="product"
        className="product-container"
        key={ i }
      >
        <NavLink data-testid="product-detail-link" to={ e.id }>
          <img src={ e.thumbnail } alt={ e.id } />
          <p>{e.title}</p>
          <p>{e.price}</p>
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
        <nav>
          <NavLink to="/cart" data-testid="shopping-cart-button">Carrinho</NavLink>
        </nav>
        <div>
          <p data-testid="home-initial-message">
            Digite algum termo de pesquisa ou escolha uma categoria.
          </p>
        </div>

        <div>
          { category.map((element, index) => (
            <label htmlFor={ element.id } data-testid="category" key={ index }>
              <input
                type="radio"
                value={ element.name }
                id={ element.id }
                name="categoryRadio"
                onChange={ this.onInputChange }
                // checked={ this.handleClickSelect }
              />
              { element.name }
            </label>
          )) }
        </div>
        <div>
          <label htmlFor="query">
            <input
              type="text"
              name="query"
              id="query"
              value={ query }
              onChange={ this.onInputChange }
              data-testid="query-input"
            />
          </label>
          <button
            type="button"
            onClick={ this.handleClick }
            data-testid="query-button"
          >
            pesquisar
          </button>
          {toggle && <p>Nenhum produto foi encontrado</p> }
          {categoryRadio.length > 0 ? categoryResults : queryResults }
        </div>
      </>
    );
  }
}

export default Search;
