const axios = require('axios')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer');
dotenv.config()
// === CONFIGURAÇÃO SMTP PERSONALIZADA ===
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true se usares porta 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Envia um e-mail de convite de reunião.
 */
async function sendMeetingEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html
    });
    console.log(`📧 Email enviado para ${to}: ${info.messageId}`);
  } catch (error) {

  }
}

/**
 * Envia mensagem via Telegram.
 */
async function sendTelegramMessage(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("⚠️ TELEGRAM_BOT_TOKEN não definido no .env");
    return;
  }

  try {
    const response = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "HTML"
    });
    console.log('📲 Mensagem Telegram enviada para', response.data);
    console.log('📲 Mensagem Telegram enviada para', chatId);
    return response;
  } catch (error) {
    console.error('❌ Falha ao enviar Telegram:', error.message);
        console.error(`❌ Erro ao enviar email para:`, error.message);
        console.log("❌ Error Details:");
    console.log("Status:", error.response?.status);
    console.log("Status Text:", error.response?.statusText);
    console.log("Data:", error.response?.data);
    console.log("Config URL:", error.config?.url);
    console.error(`❌ Falha ao enviar Telegram:`, error.message);
  }
}

module.exports = {
  sendMeetingEmail,
  sendTelegramMessage
};
