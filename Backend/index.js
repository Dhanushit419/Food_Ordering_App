import express, { response } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";

const app = express();

app.use(cors());
app.listen(3001, () => console.log("App is running !"));
app.use(bodyParser.urlencoded({ extended: true }));
const PGHOST = 'localhost'; 
const PGDATABASE = 'food_order';
const PGUSER = 'postgres';
const PGPASSWORD = '1234';
const PGPORT = '5432'; 



var conn = new pg.Client({
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    port: PGPORT,
    host: PGHOST,
    ssl: false,
    connectionTimeoutMillis: 1000000,
    idleTimeoutMillis: 1000000
});

//checking connectivity
conn.connect((err)=>{
    if(!err)console.log("Connected to db")
    else console.log("Eror : "+err.message)
})


//sign up form - new user registration

app.post("/register",async(req,res)=>{
    const data=req.query
    console.log(data)

    const response = {newUser:true,uniqueUsername:false}
   // console.log(response)

    try{ 
        const docs= await conn.query("SELECT * FROM customer where email=$1",[data.email])
        const docs1= await conn.query("SELECT * FROM customer where username=$1",[data.username])

        if(docs.rowCount!=0 && docs1.rowCount!=0 ){
            response.newUser=false
        }
    }
    catch(err){
        console.log("Error in checking the existence : "+err)
    }

    try{ 
        const docs= await conn.query("SELECT * FROM customer where username=$1",[data.username])
        if(docs.rowCount==0){
            response.uniqueUsername=true
        }
    }
    catch(err){
        console.log("Error in checking the unique username : "+err)
    }
    
    
    if(response.newUser &&response.uniqueUsername){
        try{
        await conn.query("INSERT INTO customer(username,email,password,mobile_num,address,city) VALUES($1,$2,$3,$4,$5,$6);",[data.username,data.email,data.pwd,data.mobile,data.address,data.city])
        }
        catch(err){
            console.log("Error in registration of new user : "+err)
        }
    }
    
    console.log(response)
    res.json(response)
})





//Login page verification

app.post("/login",async(req,res)=>{
    const data=req.query
    console.log(data)
    const response={correct:false,wrnpwd:true,newMail:false,username:''}
    response.username=data.username
   // console.log(response)
    try{
        const docs = await conn.query("SELECT password FROM customer WHERE username = $1;", [data.username])
        if(docs.rowCount == 0){
            response.newMail =true
        }
        else{
            if(docs.rows[0].password === data.pwd){
                response.correct = true
                response.wrnpwd = false
            }
            else{
                response.wrnpwd =true
            }
        }
        console.log(response)
        res.json(response)
    }
    catch(err){
        console.log("error in checking db : "+err.message);
    }

})


//to get menu
app.get("/getmenu",async(req,res)=>{
    var result=[];
    try{
        console.log("received")
        const docs =await conn.query("select * from menu")
        console.log(docs)
        docs.rows.forEach( row=>{
            result.push({
                id:row.id,
                name:row.name,
                price:row.price,
                imgurl:row.imgurl

            })
        })
        console.log(result.length+" products fetched and loaded to localstorage");
    }
    catch(err){
        console.log("error in listing the products from the database: "+err.message);
    }
    res.json({list:result})
})

//get user data profile

app.get("/profile",async(req,res)=>{
    const data=req.query
   // console.log(data)
   const response={email:"",mobile:"",address:"",city:"",count:0}
    try{
        const docs=await conn.query("select * from customer where username=$1",[data.username])
        response.email=docs.rows[0].email
        response.mobile=docs.rows[0].mobile_num
        response.address=docs.rows[0].address
        response.city=docs.rows[0].city
        //console.log(docs)
        const docs1=await conn.query("select * from orders where username=$1",[data.username])
        response.count=docs1.rowCount
    }
    catch(err){
        console.log(err.message)
    }
    res.json(response)
})



//order

//to order items from the cart


app.post("/orderitem",async(req,res)=>{
    const data=req.query
    const response={ordered:false}
    try{
        console.log(data)
        data.items.forEach(async(item)=>{
            console.log(item.price)
            await conn.query("insert into orders(username,date,id,name,quantity,price) values($1,$2,$3,$4,$5,$6)",[data.username,data.date,item.id,item.name,item.quantity,item.price-""])
        })
        response.ordered=true
        console.log("items ordered")
    }
    catch(err){
        console.log("error in ordering  - "+err.message)
    }
    res.json(response)
})


//history


//to get order history

app.get("/getorderhistory",async(req,res)=>{
    const data=req.query
    var date=[]
    var orders=[]
    try{
        const dates=await conn.query("SELECT DISTINCT date FROM orders WHERE username=$1",[data.username])
        console.log(dates.rowCount)
        dates.rows.forEach((row)=>{
            date.push({date:row.date})
        })
        const items=await conn.query("SELECT * FROM ORDERS WHERE username=$1",[data.username])
        items.rows.forEach((row)=>{
            orders.push({
                id:row.id,
                name:row.name,
                quantity:row.quantity,
                price:row.price,
                date:row.date
            })
        })
        console.log(dates)
        //response.items=items

    }
    catch(err){
        console.log("error in getting history "+err.message)
    }
   // console.log(response)
    res.json({dates:date,items:orders})
    //console.log(orders);
})


//adminlogin

app.get("/verifyadmin",async(req,res)=>{
    const data=req.query
    const response={admin:false}
    try{
        const docs=await conn.query("select * from admin where id=$1",[data.id])
        if(docs.rows[0].password==data.pwd){
            response.admin=true
        }
    }
    catch(err){
        console.log(err.message)
    }
    res.json(response)
})

//addfood
//adding product into database

app.post("/addmenu",async(req,res)=>{
    const data=req.query
    console.log(data)
    const response ={name:'',added:false,id:''}
    try{  
        //to get the id of the product 
        const count =await conn.query("select * from menu")
        const id=count.rowCount+1
        console.log(id)
        await conn.query("INSERT INTO menu(id,name,price,imgurl,keywords) VALUES($1,$2,$3,$4,$5);",[id,data.name,data.price,data.imgurl,data.keywords])
        response.added=true
        response.id=id
        response.name=data.name
        console.log("New menu added with id :"+id+" Name : "+data.name)
    }
    catch(err){
        console.log("error in adding product in database : "+err.message);
    }
    res.json(response)
})

//searching
//to get the searched result from database

app.get("/search",async(req,res)=>{
    const data=req.query
    //console.log(data)
    var result=[];
    try{
        if(data.searchTerm!=''){
            const searchTermArray=data.searchTerm.split(/[, ]+/);
            const searchTermIndexes = searchTermArray.map((term, index) => `$${index + 1}`).join(", ");
            const queryParams = searchTermArray.map((term) => `%${term}%`);
            //console.log(searchTermIndexes)
            console.log(queryParams)


            const query = `SELECT id, name, price, imgurl FROM menu
            WHERE keywords ILIKE ANY(ARRAY[${searchTermIndexes}])`;
          
          const docs = await conn.query(query, queryParams);

           console.log("SearchTerm : "+data.searchTerm+" Items Found : "+docs.rowCount)
            docs.rows.forEach( row=>{
                result.push({
                    id:row.id,
                    name:row.name,
                    price:row.price,
                    imgurl:row.imgurl,
                })
            })
        }
    }
    catch(err){
        console.log("error in searching the products from the database: " + err.message);
    }

    res.json({list:result ,count:result.length})
})


//cart
