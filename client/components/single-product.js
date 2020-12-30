import React from 'react'
import {connect} from 'react-redux'
import {getSingleProduct} from '../store/singleProduct'
import {addToCart} from '../store/cart'
import {Card, Icon, Image, Select, Button} from 'semantic-ui-react'
import makeTotalStr from '../../script/makeTotalStr'
import {Link} from 'react-router-dom'

export class SingleProduct extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      productId: this.props.match.params.id,
      quantity: 1
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleAddToCart = this.handleAddToCart.bind(this)
  }

  componentDidMount() {
    this.props.getSingleProduct(this.state.productId)
  }

  async handleSelect(e, {value}) {
    await this.setState({
      quantity: value
    })
  }

  async handleAddToCart() {
    await this.props.addToCart('/api/cart', this.state)
    //need to handle post add to cart behavior -- success message? new page?
  }

  render() {
    const qtyOptions = [
      {key: '1', value: 1, text: '1'},
      {key: '2', value: 2, text: '2'},
      {key: '3', value: 3, text: '3'},
      {key: '4', value: 4, text: '4'},
      {key: '5', value: 5, text: '5'},
      {key: '6', value: 6, text: '6'},
      {key: '7', value: 7, text: '7'},
      {key: '8', value: 8, text: '8'},
      {key: '9', value: 9, text: '9'},
      {key: '10', value: 10, text: '10'}
    ]
    let product = this.props.product
    return (
      <div className="main-content-section">
        {product ? (
          <Card centered raised className="single-product">
            <Image src={product.imageUrl} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{product.name.toUpperCase()}</Card.Header>
              <Card.Meta>${makeTotalStr(product.price)}</Card.Meta>
              <Card.Description>{product.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <label htmlFor="qty-select">Quantity: </label>
              <Select
                onChange={this.handleSelect}
                options={qtyOptions}
                name="quantity"
                id="qty-select"
                value={this.state.quantity}
              />
              <div>
                <Button
                  icon
                  labelPosition="left"
                  onClick={this.handleAddToCart}
                  className="add-to-cart"
                >
                  <Icon name="shop" />
                  Add To Cart
                </Button>
              </div>
            </Card.Content>
          </Card>
        ) : (
          ''
        )}
      </div>
    )
  }
}

const mapState = state => {
  console.log('STATE', state)
  return {
    product: state.product.product
  }
}

const mapDispatch = dispatch => {
  return {
    getSingleProduct: id => dispatch(getSingleProduct(id)),
    addToCart: (path, product) => dispatch(addToCart(path, product))
  }
}

export default connect(mapState, mapDispatch)(SingleProduct)
