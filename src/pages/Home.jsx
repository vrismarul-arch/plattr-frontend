import React from 'react'
import Navbar from '../components/Navbar'
import Banner from './Banner/Banner'
import ProductCard from './product/ProductCard'
import FreshSteps from '../components/FreshSteps'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <ProductCard/>
        <FreshSteps/>
    </div>
  )
}

export default Home