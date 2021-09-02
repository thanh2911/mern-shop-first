import React , {useContext}from 'react';
import { GlobalState } from '../../../GlobalState.';

function Filters() {

    const state = useContext(GlobalState);
    const [categories] = state.catgoriesAPI.categories;
    const [category,setCategory] = state.productAPI.category;

    const [sort, setSort] = state.productAPI.sort;
    const [search, setSearch] = state.productAPI.search;

    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }

    const handleSort= e => {
        setSort(e.target.value);
        setSearch('')
    }


    return (
        <div className = "filter_menu">
            <div className="row">
                <span>Filters: </span>
                <select name="category" value={category} onChange={handleCategory}>
                    <option value=''>All Product</option>

                    {
                        categories.map(category => (
                            <option value={"category=" + category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))
                    }

                </select>

            </div>

            <input type="text" value={search} placeholder="Please your search !"
            onChange= {e => setSearch(e.target.value.toLowerCase())} />

            <div className="row">
                <span>Sort By: </span>
                <select  value={sort} onChange={handleSort}>
                    <option value=''>Newest</option>
                    <option value='sort=oldest'>Oldest</option>
                    <option value='sort=-sold'>Best Sales</option>
                    <option value='sort=-price'>Price: Hight-Low</option>
                    <option value='sort=price'>Price: Low-Hight</option>


                </select>

            </div>
            
        </div>
    )
}

export default Filters
