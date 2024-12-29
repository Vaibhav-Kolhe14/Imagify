import React from 'react'
import { assets, plans } from '../assets/assets'

function BuyCredit() {
  return (
    <div className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='rounded-full mb-6 border border-gray-400 px-10 py-2'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>


      <div>
        {plans.map((item, index)=> {
          <div key={index}>
            <img src={assets.lock_icon} alt=''/>
            <p>{item.id}</p>
            <p>{item.desc}</p>
            <p>${item.price} / {item.credits} credits</p>
          </div>
        })}
      </div>
    </div>
  )
}

export default BuyCredit
