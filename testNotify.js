require("dotenv").config();
const { sendMeetingEmail, sendTelegramMessage } = require("./backend/utils/notify")

const textasync = async () => {
  await sendMeetingEmail(
    "teste@exemplo.com",
    "Convite de Reunião",
    "<h2>Olá!</h2><p>Convite de teste.</p>"
  );

  await sendTelegramMessage("-4767925581", "Mensagem de teste via Telegram");
}

textasync();
