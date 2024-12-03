import { MongoClient } from 'mongodb';

 const {
     MONGo_URI='mongodb+srv://vintronfuturetechnologies:LGCppwg4csFjLcRb@cluster0.yt86g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
 } = process.env;




export const client = new MongoClient(MONGo_URI);
export const db = client.db("vintroAdmin");
