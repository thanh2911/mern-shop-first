const Category = require('../models/categoryModel');
const Products = require('../models/productModel');

class categoryCtrl {

    async getCategories (req,res) {

        try {

            const categories = await Category.find();

            res.json(categories)
            
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    }

    async createCategories(req,res){
        try {

            // if user have role = 1  => admin
            // admin can create , delete ,update
            
            const {name} = req.body ;

            const categories = await Category.findOne({name});

            if(categories) return res.status(500).json({msg : 'category bi trung'})

            const newCategories = new Category({name})

            await newCategories.save();

            res.json({msg: "Created a category"})
            
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    }

    async deleteCategories(req,res){
        try {

            const products = await Products.findOne({category: req.params.id});
            if(products) return res.json({
                msg : 'Please delete product chua category.'
            })
 

            await Category.findByIdAndDelete(req.params.id);
            res.json({msg : 'delete category'})
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    }

    async updateCategories(req,res){
        try {
            const {name} = req.body ;

            await Category.findOneAndUpdate({_id : req.params.id},{name})

            res.json({msg : "Update thanh cong"})
        } catch (error) {
            return res.status(500).json({msg : err.message})
        }
    }

}

module.exports = new categoryCtrl;