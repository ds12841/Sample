require('dotenv').config();
const express = require('express');
const bp = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
const url="mongodb+srv://Admin-Daksh:"+process.env.PASS+"@cluster0.lxtbc.gcp.mongodb.net/"+process.env.DB+"?retryWrites=true&w=majority";
const options =  { 
    useNewUrlParser: true,
    useFindAndModify: false, 
    useCreateIndex: true, 
    useUnifiedTopology: true 
}
mongoose.connect(url,options).then(() => console.log("MongoDB is connected through allocated port."))
.catch(err => console.log(err));;
const schema = {
     name: String,
     location: String
};
const rec = mongoose.model("Records", schema);
let recs=[];
app.set('view engine', 'ejs');
app.use(bp.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render('home');
});
app.post('/away',(req,res)=>{
    if("0".localeCompare(req.body.xyz)==0)
        rec.find({},(err,res)=>{
            recs=JSON.parse(JSON.stringify(res));
    });
    else{
        rec.find({location:req.body.xyz},(err,res)=>{
            recs=JSON.parse(JSON.stringify(res));
        });
        rec.find({name:req.body.xyz},(err,res)=>{
            let obj=JSON.parse(JSON.stringify(res));
            for(let i=0;i<obj.length;i++)
                recs.push(obj[i]);
        });
    }
    setTimeout(()=>res.redirect('/away'),1500);
});
app.get('/away', (req, res) => {
    res.render('show',{data:recs});
});
app.post('/db', (req, res) => {
    const r=new rec({
        name:req.body.name,
        location:req.body.location
    }); 
    r.save(err=>{
        console.log("Record saved...");
        res.redirect('/');
    });
});
app.listen(process.env.PORT, () => {
    console.log("Node.js is running on allocated port.");
});

