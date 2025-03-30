
import React from 'react'

export const Rating = () => {
  return (
    <div className="rating">
  <input type="radio" name="rating-1" className="mask mask-star" aria-label="1 star" />
  <input type="radio" name="rating-1" className="mask mask-star" aria-label="2 star" defaultChecked />
  <input type="radio" name="rating-1" className="mask mask-star" aria-label="3 star" />
  <input type="radio" name="rating-1" className="mask mask-star" aria-label="4 star" />
  <input type="radio" name="rating-1" className="mask mask-star" aria-label="5 star" />
</div>
  )
}
