import React , {useState,useContext,useEffect}from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState.';

function OrderDetail() {

    const state = useContext(GlobalState);
    const [history] = state.userAPI.history;
    const [orderDetail,setOrderDetail] = useState([]);

    const params = useParams();

    useEffect(() => {
        if(params.id) {
            history.forEach(item => {
                if(item._id === params.id) setOrderDetail(item)
            });
        }
    },[params.id , history])

    console.log(orderDetail)

    if(orderDetail.length === 0) return null ;
    return (
        <div className="history-page">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Postal Code</th>
                        <th>Country Code</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetail.address.recipient_name}</td>
                        <td>{orderDetail.address.line1 + ' - ' + orderDetail.address.city}</td>
                        <td>{orderDetail.address.postal_code}</td>
                        <td>{orderDetail.address.country_code}</td>
                    </tr>

                </tbody>
            </table>

            <table style ={{margin : "30px 0px"}}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Products</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>

                        {
                            orderDetail.cart.map(item => (
                                <tr key = {item._id}>
                                    <td><img src= {item.image.url} alt="" /></td>
                                    <td>{item.title}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price * item.quantity}</td>
                                </tr>
                            ))
                        }

                </tbody>
            </table>
        </div>
    )
}

export default OrderDetail
