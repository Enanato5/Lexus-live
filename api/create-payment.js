export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { service, plan, amount } = req.body;

    if (!service || !plan || !amount) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const response = await fetch("https://paysuite.tech/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAYSUITE_API_KEY}`
      },
      body: JSON.stringify({
        amount: amount,
        currency: "MZN",
        description: `${service} - ${plan}`,
        callback_url: "https://lexus-live.vercel.app/api/payment-callback",
        success_url: "https://wa.me/258876191026",
        cancel_url: "https://lexus-live.vercel.app"
      })
    });

    const data = await response.json();

    if (!data || !data.payment_url) {
      console.error("Erro da Paysuite:", data);
      return res.status(500).json({ error: "Não foi possível gerar o link de pagamento" });
    }

    return res.status(200).json({
      payment_url: data.payment_url
    });

  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return res.status(500).json({ error: "Erro no servidor" });
  }
}
