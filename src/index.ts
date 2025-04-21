import { AuthDataValidator, objectToAuthDataMap } from '@telegram-auth/server';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { resolve } from 'path';

interface TelegramUser {
  id: number;
  username?: string;
  photo_url?: string;
  first_name?: string;
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log({jwtKeyId: process.env.JWT_KEY_ID, jwtSecret: process.env.JWT_SECRET})

const generateJwtToken = (userData: TelegramUser) => {
  const payload = {
    telegram_id: userData.id,
    username: userData.username,
    avatar_url: userData.photo_url,
    sub: userData.id.toString(),
    name: userData.first_name,
    iss: "https://api.telegram.org", // Issuer
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration, can lower or increase as needed
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, { algorithm: "HS256", keyid: process.env.JWT_KEY_ID });
};

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

app.get("/login", (req, res) => {
  res.sendFile(resolve(__dirname, "login.html"));
});

app.get("/callback", async (req, res) => {
  const validator = new AuthDataValidator({
    botToken: process.env.BOT_TOKEN,
  });

  const data = objectToAuthDataMap(req.query as Record<string, string | number>);

  try {
    const user = await validator.validate(data);
    const JWTtoken = generateJwtToken(user);

   console.log({user, JWTtoken})
   res.redirect('https://www.google.com')
  } catch (error) {
    console.error("Error validating Telegram data:", error);
    res.status(400).send("Invalid Telegram data");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});