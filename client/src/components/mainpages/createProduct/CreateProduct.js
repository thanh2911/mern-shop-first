import React , {useState , useContext, useEffect} from 'react';
import { GlobalState } from '../../../GlobalState.';
import Loading from '../util/loading/Loading';
import { useHistory , useParams} from "react-router-dom";
import axios from 'axios';

function CreateProduct() {

    const initialState = {
        product_id : '',
        title : '',
        price : 0,
        description : 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
        content : 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
        category : '',
        _id : ''
    }

    const state = useContext(GlobalState);
    const [product,setProduct] = useState(initialState);
    const [categories] = state.catgoriesAPI.categories;
    const [image,setImage] = useState(false);
    const [loading,setLoading] = useState(false);

    const [isAdmin] = state.userAPI.isAdmin ;
    const [token] = state.token;

    const history = useHistory(); // 
    const params = useParams();   // 

    const [products] = state.productAPI.products
    const [onEdit , setOnEdit] = useState(false);

    const [callback ,setCallback] = state.productAPI.callback;

    useEffect(() =>{            // hien edit product theo id
        if(params.id){
            setOnEdit(true)
            products.forEach(product => {
                if(product._id === params.id ) {
                    setProduct(product);
                    setImage(product.image);
                }
            })

        }
        else{
            setOnEdit(false)  ;
            setProduct(initialState);
            setImage(false);
        }
    },[params.id,products])

    const handleUpload = async e => {
        e.preventDefault()

        try {
            if(!isAdmin) return alert("Bạn không phải là quản trị viên")

            const file = e.target.files[0] // kết hợp onChange đọc thông tin flie upload lên
            //console.log(file)

            if(!file) return alert("Tệp không tồn tại");

            if(file.size > 1024 * 1024 ) // 1mb
                return alert("Kích thước tệp quá lớn");

            if(file.type !== 'image/jpeg' && file.type !== 'image/png') // khác loại trên
                return alert("Định dạng tệp không chính xác");

            let fromData = new FormData() 
            fromData.append('file',file)

            setLoading(true);
            const res = await axios.post('/api/upload' ,fromData ,{
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading(false);
            //console.log(res)
            setImage(res.data)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy = async e => {
        e.preventDefault()
        try {

            if(!isAdmin) return alert("Bạn không phải là quản trị viên");
            setLoading(true)
            await axios.post('/api/destroy' ,{public_id : image.public_id} ,{
                headers: {Authorization: token}
                
            })
            setLoading(false)
            setImage(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangeInput = e => {
        const {name , value} = e.target ;
        setProduct({...product, [name]:value})
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {

            if(!isAdmin) return alert("Bạn không phải là quản trị viên");
            if(!image) return alert("Không tải lên hình ảnh");

            if(onEdit){
                await axios.put(`/api/products/${product._id}`,{...product,image} , {
                    headers: {Authorization: token}
                })
                
            }else{
                await axios.post('/api/products',{...product,image} , {
                    headers: {Authorization: token}
                })
            }
            setCallback(!callback)
            history.push("/")
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const styleUpload = {
        display : image ?  "block" : "none"
    }


    return (
        <div className= "create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"> <Loading /> </div> // Nếu loading sẽ hiện vòng quay loangding
                    :
                    <div id="file_img" style={styleUpload}>
                    <img src={image ? image.url : ''} alt="" />
                    <span onClick={handleDestroy}>X</span>
                    </div>
                }

            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="product_id">Product ID</label>
                    <input type="text" name="product_id" id="product_id" required
                    value={product.product_id}  onChange={handleChangeInput} disabled={onEdit}/>
                </div>

                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required
                    value={product.title} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input type="text" name="price" id="price" required
                    value={product.price} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                    value={product.description} rows={5} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="content">Content</label>
                    <textarea type="text" name="content" id="content" required
                    value={product.content} rows={7} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="categories">Categories</label>
                    <select name='category' value={product.category} onChange={handleChangeInput}   >

                        <option value="">Hãy chọn một danh mục</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>  

                <button type="submit">{onEdit ? "Update" : "Create"}</button>
            </form>
        </div>
    )
}

export default CreateProduct
