
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { calculateTotalWithDiscount } from './utils/calculadorDicout.js'; 

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// 🧾 Ruta para crear la sesión de pago
app.post('/api/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;

  console.log("🚀 Productos originales:", cartItems);

  const itemsConDescuento = calculateTotalWithDiscount(cartItems);
  console.log("💸 Con descuentos:", itemsConDescuento);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: itemsConDescuento.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: 'https://frontend-tienda.vercel.app/',
cancel_url: 'https://frontend-tienda.vercel.app/',


    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Error creando sesión de Stripe:', error);
    res.status(500).json({ error: 'Error al crear la sesión de pago' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
