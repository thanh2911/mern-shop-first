import React, {useState, useContext} from 'react';
import { GlobalState } from '../../../GlobalState.';
import ProductItem from '../util/productItem/ProductItem';
import Loading from '../util/loading/Loading';
import axios from 'axios';
import Filters from './Filters';
import LoadMore from './LoadMore';

function Product() {
    const state = useContext(GlobalState);
    const [products,setProducts] = state.productAPI.products;
    //console.log(products)

    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;

    const [callback ,setCallback] = state.productAPI.callback;
    const [loading, setLoading] = useState(false);

    const [isCheck,setIsCheck] = useState(false)

    // đổi giá trị true false của checked
    const handleCheck =(id) => {
        products.forEach(product => {
            if(product._id ===id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    // Xóa 1 phần tử ở nút delete
    const deleteProduct = async (id,public_id) => {

        console.log({id,public_id})
 
         try {
             setLoading(true)
             const destroyIMG =  axios.post('/api/destroy',{public_id},{
                 headers: {Authorization: token}
             })

             const deleteProduct =  axios.delete(`/api/products/${id}`,{
                 headers: {Authorization: token}
             })
            
             await destroyIMG
             await deleteProduct
             setCallback(!callback)
             setLoading(false)
            


         } catch (err) {
             alert(err.response.data.msg)
         }
    }

    // Chọn tất cả
    const checkAll = () => {
        products.forEach(product => {
             product.checked = !isCheck
      
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    // Xóa nhiều phần tử đc chọn bởi checked
    const deleteAll = () => {
        products.forEach(product => {
            if(product.checked) deleteProduct(product._id,product.image.public_id)
        })
    }

    if(loading) return <div><Loading /></div>


    return (
        <>
        <Filters />
        {
            isAdmin && 
                <div className = "delete-all">
                    <span>Select all</span>
                    <input type ="checkbox" checked={isCheck} onChange={checkAll}/>
                    <button onClick={deleteAll}>Delete All</button>
                </div>
        }

        <div className='products'>
           {
                products.map(product => {
                    return<ProductItem key={product._id} 
                    product={product}
                    isAdmin = {isAdmin} 

                    deleteProduct={deleteProduct} 
                    handleCheck={handleCheck}
                    />
                })
           }
        </div>

        <LoadMore />

        {products.length === 0 && <Loading />}
        </>
    )
}

export default Product
