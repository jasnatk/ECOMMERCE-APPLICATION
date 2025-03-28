import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'

export const ProductDetails = () => {
    const params = useParams()
    console.log(params,"====params")
    const [productDetails,isLoading,error]=useFetch(`/product/productDetails/${params?.id}`);

  return (
    <div>
      <h1>ProductDetails Page</h1>
    <div>
       <div>
            <h1>{productDetails?.name}</h1>
            <p>{productDetails?.description}</p>
      </div>
        <div>
          <img src={productDetails?.image} alt="product-image"/>
        </div>
        <button className='btn btn-success'>Add to Cart</button>
    </div>
    </div>
  )
}
 