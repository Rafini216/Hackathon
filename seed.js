const mongoose = require("mongoose");
const User = require("./backend/models/User");
const Meeting = require("./backend/models/Meeting");

const MONGO_URI = "mongodb://127.0.0.1:27017/meetmind";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado ao MongoDB");

    await User.deleteMany({});
    await Meeting.deleteMany({});
    console.log("🧹 Coleções limpas");

    // --- USERS ---
    const users = await User.insertMany([
      { name: "Carlos Mendes", email: "carlos@example.com", password: "123456" },
      { name: "Ana Costa", email: "ana@example.com", password: "123456" },
      { name: "João Silva", email: "joao@example.com", password: "123456" },
      { name: "Maria Ferreira", email: "maria@example.com", password: "123456" },
      { name: "Rita Gomes", email: "rita@example.com", password: "123456" }
    ]);
    console.log(`👥 Criados ${users.length} usuários`);

    // --- TÍTULOS POSSÍVEIS ---
    const titles = [
      "Revisão Semanal",
      "Planejamento do Sprint",
      "Revisão de Projetos",
      "Alinhamento de Marketing",
      "Check-in de Equipe",
      "Feedback de Produto",
      "Apresentação de Resultados",
      "Sessão de Ideias",
      "Revisão de Vendas",
      "Atualização Operacional",
      "Análise de Desempenho",
      "Workshop Interno",
      "Brainstorm Criativo",
      "Revisão Financeira",
      "Treinamento de Equipe",
      "Debrief Semanal",
      "Ajustes de Estratégia",
      "Revisão Técnica",
      "Onboarding de Novos Membros",
      "Revisão de Metas"
    ];

    // --- FUNÇÃO AUXILIAR ---
    const random = arr => arr[Math.floor(Math.random() * arr.length)];

    const getRandomParticipants = () => {
      const count = Math.floor(Math.random() * 3) + 2; // entre 2 e 4 pessoas
      const shuffled = [...users].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const randomTime = () => {
      const hour = Math.floor(Math.random() * 8) + 8; // entre 8h e 15h
      const minute = Math.random() > 0.5 ? "00" : "30";
      const start = `${hour.toString().padStart(2, "0")}:${minute}`;
      const endHour = hour + 1;
      const end = `${endHour.toString().padStart(2, "0")}:${minute}`;
      return { start, end };
    };

    const today = new Date();
    const meetings = [];

    // --- GERA 20 REUNIÕES ---
    for (let i = 0; i < 20; i++) {
      const { start, end } = randomTime();
      const offset = Math.floor(Math.random() * 10); // até 10 dias à frente
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const day = date.toISOString().split("T")[0];

      const participants = getRandomParticipants();

      const responses = participants.map(p => ({
        userId: p._id,
        response: Math.random() > 0.6 ? "yes" : "no"
      }));

      const allYes = responses.every(r => r.response === "yes");
      const anyNo = responses.some(r => r.response === "no");

      const status = allYes ? "confirmed" : anyNo ? "cancelled" : "pending";

      meetings.push({
        title: random(titles),
        participants: participants.map(p => p._id),
        notificationSent: Math.random() > 0.5,
        day,
        start,
        end,
        status,
        responses
      });
    }

    await Meeting.insertMany(meetings);
    console.log(`📅 Inseridas ${meetings.length} reuniões aleatórias`);
    console.log("✅ Seed concluído com sucesso");

    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao popular banco:", err);
    process.exit(1);
  }
}

seed();
