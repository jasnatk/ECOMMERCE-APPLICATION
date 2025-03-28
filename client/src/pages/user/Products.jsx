import React from 'react'
import ProductCard from '../../Components/user/Cards';
import { ProductCardSkeltons } from '../../Components/user/Skeltons';
import { useFetch } from '../../hooks/useFetch';

export const Product = () => {
const [productList,isLoading,error]=useFetch("/product/productList")

  if (isLoading) {
    return <ProductCardSkeltons />
  }

  return(
        <div>
            <h1>Products listing page</h1>
            {productList?.map((value)=>(
              <ProductCard products={value} key={value?._id}/>
            ))}
        </div>
)
}
