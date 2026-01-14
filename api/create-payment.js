export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { service, plan, price } = req.body;

    if (!service || !plan || !price) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const response = await fetch("https://api.paysuite.tech/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PAYSUITE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: price,
        currency: "MZN",
        description: `${service} - ${plan}`,
        callback_url: "https://lexus-live.vercel.app/api/payment-callback",
        success_url: "https://wa.me/258876191026",
        cancel_url: "https://lexus-live.vercel.app"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Paysuite:", data);
      return res.status(500).json({ error: "Erro ao criar pagamento" });
    }

    return res.status(200).json({ payment_url: data.payment_url });

  } catch (error) {
    console.error("Erro interno:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
