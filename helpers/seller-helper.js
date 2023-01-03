var db = require('../config/connection').get()
var collection = require('../config/collections');
const bcrypt = require('bcrypt');     // for encrypting and decrypting password 

module.exports={
    doSignUp:(sellerData)=>{
        return new Promise(async (resolve, reject) => {
            sellerData.categories = {}
            sellerData.balance = 0
            sellerData.password = await bcrypt.hash(sellerData.password,10)  // encrypting password
            col = db.collection(collection.SELLER_COLLECTIONS)
            col.insertOne(sellerData).then(()=>{
                resolve()
            })
        })
    },

    doLogin:(sellerData)=>{
        return new Promise(async (resolve, reject) => {
            let response = {}
            col = db.collection(collection.SELLER_COLLECTIONS)

            let seller = await col.findOne({email:sellerData.email})             //take data from the database
            if(seller){       //if user exist
                bcrypt.compare(sellerData.password,seller.password).then((status)=>{     //compares the password correct or not
                    if(status){             //if password is correct    
                        response.status = true
                        response.seller = seller
                        resolve(response)
                    }else{              //if password is not correct
                        response.status = false
                        response.seller = null
                        response.error = "Incorrect Password !"
                        resolve(response)
                    }
                })
                
            }else{  //if user does not exist
                response.status = false
                response.seller = null
                response.error = "user does not exist !"
                resolve(response)
            }
        })
    },
    getSellerDetails:(sellerEmail)=>{
        return new Promise((resolve, reject) => {
            col = db.collection(collection.SELLER_COLLECTIONS)
            let seller = col.findOne({email : sellerEmail})
            resolve(seller);
        }) 
    },
    addCategory:(category,sellerEmail)=>{
        return new Promise(async(resolve, reject) => {
            col = db.collection(collection.SELLER_COLLECTIONS)
            await col.updateOne(
                {email:sellerEmail},
                {$push:{categories:category}})
            resolve()
        })  
    },
    removeCategory:(category,sellerEmail)=>{
        return new Promise((resolve, reject) => {
            col = db.collection(collection.SELLER_COLLECTIONS)
            col.updateOne(
                {email: sellerEmail},
                {$pull:{categories:category}}
            )
            resolve()
        })
    },
    addProduct:(product)=>{
        return new Promise((resolve, reject) => {
            col = db.collection(collection.PRODUCT_COLLECTIONS)
            col.insertOne(product).then((data)=>{
                console.log(data.insertedId);
            })
        })
    }
    
    

    
}