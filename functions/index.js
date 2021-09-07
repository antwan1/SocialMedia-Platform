const functions = require("firebase-functions");
const admin = require ('firebase-admin');


admin.initializeApp();  // // usuall you would pass an application however this project knows the ID of the application coming from firebasesrc
const express = require('express');
const app = express();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//



 app.get('/Howls', (req, res) => {
    admin
    .firestore()
    .collection('Howls')
    .get()
    .then((data) => {
        let Howls =[];    //This for loop should have all the data of the screams we have created. 
        data. forEach((doc) => {
        Howls.push (doc.data());
        });
        return res.json(Howls);
    })
    .catch((err) => console.error(err)); //This will catch errors and log it to the console whilst returning any Howls   
 })

 //Result: When deploying firebase on postman, the body from the database is posted and thus succesful.

 exports.createHowls = functions.https.onRequest((req,res) =>{
     if(req.method !== 'POST'){ //If post request doesn't work, it wil return the client error clearly.
         return res.status(400).json ({error: 'Method not allowed'});
     }

   const newHowls = {
       body:req.body.body,
       userHandle: req.body.userHandle,
       createdAt:admin.firestore.Timestamp.fromDate(new Date())
   };

   //const firestore  = admin.firestore();
//firestore.settings({ignoreUndefinedProperties:true}); //If there is no data within the POST, then firestore wouldn't acknowledge req.body.body passing a null value thus creating a bug.
//This was created to communicate with firestore that this should be ignored. 
   admin
   .firestore()
   .collection('Howls')
   .add(newHowls)
   .then((doc) =>{
       res.json({message: 'document ${doc.id} created succesfully'});
   })
       .catch((err) => {
           res.status(500).json({error: 'something went wrong'});
           console.error(err);
       });
   });
 
//This is tested on POST on postmaster, succesful shows body.
exports.api = functions.https.onRequest(app); //Parse the app to make into multiple routes.