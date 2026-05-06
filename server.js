import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/analyze", async (req,res)=>{

  const { problem } = req.body;

  try{

    const response = await openai.responses.create({
      model: "gpt-5.3",
      input: `
      Analizá este problema científicamente:

      ${problem}

      Generá una explicación clara y un posible modelo.
      `
    });

    res.json({
      result: response.output[0].content[0].text
    });

  }catch(e){
    res.status(500).json({error:e.message});
  }

});

app.listen(3000, ()=>console.log("Servidor activo"));
