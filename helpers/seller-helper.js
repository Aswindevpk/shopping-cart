var db = require('../config/connection').get()
var collection = require('../config/collections');
const bcrypt = require('bcrypt');     // for encrypting and decrypting password 

module.exports={
    doSignUp:(sellerData)=>{
        return new Promise(async (resolve, reject) => {
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
    }
    
    

    
}