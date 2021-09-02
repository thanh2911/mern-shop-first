import {useState, useEffect} from 'react'
import axios from 'axios'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart,setCart] = useState([]);
    const [history,setHistory] = useState([]);
    


    // get infor => isAdmin , isLogged
    useEffect(() =>{
        if(token){
            //console.log(token)
            const getUser = async () =>{
                try {
                    const res = await axios.get('/user/infor', {
                        headers: {Authorization: token}
                    })

                    setIsLogged(true);
                    res.data.user.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

                    setCart(res.data.user.cart)
                    //console.log(res)
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }

            getUser()
            
        }
    },[token])
 

    const addCart = async (product) => {
        if(!isLogged) return alert('Ban phai dang nhap de mua :::');

        const check = cart.every(item => {
            return item._id !== product._id ;
        })

        if(check) {
            setCart([...cart,{...product,quantity : 1}]);

            await axios.patch('/user/addcart', {cart: [...cart,{...product,quantity : 1}]},{
                headers: {Authorization: token}
            })

        }else{
            alert("Sản phẩm này đã được thêm vào giỏ hàng")
        }
    }


    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart : [cart,setCart],
        addCart : addCart,
        history : [history,setHistory],
    }
}

export default UserAPI
 