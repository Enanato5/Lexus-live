export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const event = req.body;

    if (event.status === "paid" || event.status === "success") {
      console.log("Pagamento confirmado:", event);
      return res.status(200).json({ message: "Pagamento recebido com sucesso" });
    }

    console.log("Evento recebido:", event);
    return res.status(200).json({ message: "Evento recebido" });

  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
}
