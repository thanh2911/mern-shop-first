import React ,{useContext,useState,useEffect}from 'react';
import {GlobalState} from '../../../GlobalState.';
import axios from 'axios';
import PaypalButton from './PaypalButton'

function Cart() {

    const state = useContext(GlobalState);
    const [total,setTotal] = useState(0);
    const [cart,setCart] = state.userAPI.cart;
    const [token] = state.token ;   



    useEffect(() => {
        // Hàm tính tổng tiền tổng (tiền =  giá x số lượng) + cái tiếp theo
        const getTotal = () =>{
            const total = cart.reduce((prev , item) => {
                return prev + (item.price * item.quantity);
            },0)

            setTotal(total)
        }

        getTotal();
    },[cart]) 

    // Lưu nhưng thay đổi tăng giảm xóa
    const addToCart = async (cart) => {
        await axios.patch('/user/addcart' , {cart} ,{
            headers: {Authorization: token}
        })
    }

    // Hàm tăng số lượng sản phẩm theo id
    const increment = (id) => {
        cart.forEach(item => {
            if(item._id ===id){
                item.quantity += 1
            }
        })
        setCart([...cart]);
        addToCart(cart);
    }

    // Hàm giảm số lượng sản phẩm theo id
    const decrement = (id) => {
        cart.forEach(item => {
            if(item._id ===id){
                item.quantity ===1 ? item.quantity = 1 : item.quantity -= 1
            }
        })
        setCart([...cart]);
        addToCart(cart)
    }

     // Xóa cart theo id
    const removeProduct = id => {
        if(window.confirm('Bạn muốn xóa sản phẩm ?')){
            cart.forEach((item,index) => {
                if(item._id ===id){
                    cart.splice(index,1)
                }
            })
            setCart([...cart]);
            addToCart(cart);
        }
    }

     // Hàm lưu sản phẩm đã mua vào database
    const tranSuccess = async (payment) => {
        //console.log(payment)
        const { paymentID , address} = payment;

        await axios.post('/api/payments',{cart , paymentID , address},{
            headers: {Authorization: token}
        })

        setCart([]);
        addToCart([]);
        alert("You have successfully placed an order .")
    }

    if(cart.length ===0) 
        return <h2 style={{textAlign : "center"}}>Gio rong</h2>

    return (
        <div>
            {
                cart.map(product => (
                    <div className="detail cart" key= {product._id}>
                    <img src={product.image.url} alt=""  />

                    <div className="box-detail">
                        <h2>{product.title}</h2>

                        <h3>${product.price * product.quantity}</h3>
                        <p>{product.description}</p>
                        <p>{product.content}</p>

                        <div className = "amount"> 
                            <button onClick={() =>decrement(product._id)}>-</button>
                            <span>{product.quantity}</span>
                            <button onClick={() =>increment(product._id)}>+</button>
                        </div>

                       <div className="delete" onClick = {() => removeProduct(product._id)}> X</div>

                    </div>
                </div>                    
                ))
            }

            <div className="total">
                <h3>Total : $ {total}</h3>
                <PaypalButton 
                    total = {total}
                    tranSuccess ={tranSuccess}
                />
            </div>
        </div>
    )
}

export default Cart
