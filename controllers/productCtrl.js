const Product = require('../models/productModel');

// Filter(Bộ lọc) - Sort(Sắp xếp) - Pagination(Phân trang)
class APIfeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filtering(){
        const queryObj = {...this.queryString} // queryString = req.query

        //console.log({before : queryObj}) // trc khi delete page
        const excludeFields = ['page','sort','limit'];
        excludeFields.forEach(el => delete(queryObj[el]))

        //console.log({after : queryObj}) // Sau khi delete page

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        //console.log({queryStr})

        this.query.find(JSON.parse(queryStr))

        // gte = lớn hơn hoặc bằng
        // lte = nhỏ hơn hoặc bằng
        // lt = nhỏ hơn
        // gt = lớn hơn
        // regex = phân biệt chữ cái
        return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        }
        else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
        
    }

    paginating(){

        const page = this.queryString.page * 1 || 1 
        const limit = this.queryString.limit * 1 || 6
        const skip = (page -1)  * limit

        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

class productCtrl {

    async getProducts(req,res){
        try {
            const features = new APIfeatures(Product.find(),req.query)
            .filtering().sorting().paginating();
            const products = await features.query;

            res.json({
                status : 'success',
                result : products.length,
                products : products
            })

        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    }

    async createProducts(req,res){
        try {
            const {product_id,title,price,description,content,image,category} = req.body;

            if(!image) return res.status(500).json({msg : 'No image'})

            const products = await Product.findOne({product_id});

            if(products) return res.status(500).json({msg : 'Trung product_id'})

            const newProduct = new Product ({
                product_id,title: title.toLowerCase(),price,description,content,image,category
            })

            await newProduct.save();
            res.json(newProduct)
            
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    }

    async deleteProducts(req,res){
        try {
            await Product.findByIdAndDelete(req.params.id);

            res.json({msg : 'delete thanh cong'})
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    }

    async updateProducts(req,res){
        try {
            const {title,price,description,content,image,category} = req.body;

            if(!image) return res.status(500).json({msg : 'No image'})

            await Product.findOneAndUpdate({_id : req.params.id},{
                title: title.toLowerCase(),price,description,content,image,category
            })

            res.json('update thanh cong')
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    }
}

module.exports = new productCtrl;