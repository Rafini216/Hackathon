const User = require("../models/User");
const Meeting = require("../models/Meeting");
const { sendMeetingEmail, sendTelegramMessage } = require("../utils/notify");

const createMeeting = async (req, res) => {
  try {
    const { title, participants, day, start, end } = req.body;

    const meeting = await Meeting.create({
      title,
      participants,
      day,
      start,
      end,
      notificationSent: false,
      status: "pending"
    });

    const fullParticipants = await User.find({ _id: { $in: participants } });

    const responses = [];

    // Percorre e envia as notificações
    for (const user of fullParticipants) {
      const acceptLink = `${req.protocol}://${req.get("host")}/api/meetings/respond/${meeting._id}/${user._id}?accept=true`;
      const declineLink = `${req.protocol}://${req.get("host")}/api/meetings/respond/${meeting._id}/${user._id}?accept=false`;

      responses.push({
        userId: user._id,
        response: "no",
        links: { accept: acceptLink, decline: declineLink }
      });

      const message = `
📅 <b>${title}</b>
🗓 ${day}, das ${start} às ${end}

Confirma presença?
✅ ${acceptLink}
❌ ${declineLink}
`;

      await sendMeetingEmail(
        user.email,
        `Convite: ${title}`,
        `<p>Olá <strong>${user.name}</strong>,</p>
         <p>Você foi convidado para a reunião <b>${title}</b></p>
         <p><b>Data:</b> ${day}<br><b>Hora:</b> ${start} - ${end}</p>
         <p><a href="${acceptLink}">✅ Confirmar</a> | <a href="${declineLink}">❌ Recusar</a></p>`
      );

      if (user) {
        await sendTelegramMessage("-4767925581", message);
      }
    }

    // Atualiza o meeting com as respostas e marca como enviado
    meeting.responses = responses;
    meeting.notificationSent = true;
    await meeting.save();

    return res.status(201).json({
      message: "Reunião criada e convites enviados",
      meeting
    });
  } catch (err) {
    console.error("Erro ao criar reunião:", err);
    res.status(500).json({ message: "Erro ao criar reunião" });
  }
};


// Responder à reunião
const respondMeeting = async (req, res) => {
  try {
    const { meetingId, userId } = req.params;
    const { accept } = req.query;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ error: "Reunião não encontrada." });

    const response = accept === "true" ? "yes" : "no";
    const userResponse = meeting.responses.find(r => r.userId.toString() === userId);

    if (!userResponse) return res.status(404).json({ error: "Usuário não faz parte da reunião." });

    userResponse.response = response;
    await meeting.save();

    const allYes = meeting.responses.every(r => r.response === "yes");
    const anyNo = meeting.responses.some(r => r.response === "no");

    if (allYes) meeting.status = "confirmed";
    else if (anyNo) meeting.status = "pending";
    await meeting.save();
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Confirmação da reunião ✅</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .destaque { color: blue; font-size: 18px; }
        </style>
    </head>
    <body style="
    justify-self: center;
    display: flex;
    border: 1px solid;
    border-radius: 8px;
    border-color: cornsilk;
    color: antiquewhite;>
        <h1 style="align-text:center">Confirmado ✅</h1>
    </body>
    </html>
    `;
    
    res.send(html);
    // res.json({
    //   // message: `Resposta registrada: ${response}`,
    //   // meetingStatus: meeting.status
      
    // });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("participants", "name email")
      .populate("responses.userId", "name email")
      .sort({ day: 1, start: 1 });

    res.status(200).json(meetings);
  } catch (err) {
    console.error("Erro ao buscar reuniões:", err);
    res.status(500).json({ message: "Erro ao buscar reuniões" });
  }
}

module.exports = {respondMeeting, createMeeting, getMeetings}