const express = require('express');
const app = express();
const { MeetingNotificationService } = require('./services/notificationService')
const {emailHistory} = require('./services/emailService')
const port = 3000;

app.use(express.json());

// const deviceName = 'HTTP-test-device';
// let messageValue = 'Hello from HTTP device';
// let lastPublishedValue = null;

// // Simular publicação de dados (equivalente ao setInterval do MQTT)
// setInterval(() => {
//     let randValue = Number((Math.random() * 100).toFixed(2));
//     lastPublishedValue = {
//         EmailService
//     };
//     console.log(`[DATA] New random value generated: ${lastPublishedValue.EmailService()}`);
// }, 2000);


// ✅ EmailService pronto para uso manual
// const EmailService = new EmailService();

// ✅ NotificationService usa EmailService automaticamente
const notificationService = new MeetingNotificationService();
notificationService.start(); // Começa a verificar a cada 30s

setTimeout(() => {
    console.log('\n🧪 TESTE: Adicionando nova reunião...');
    
    notificationService.addNewMeeting({
        title: 'Reunião de Teste',
        participants: ['user1', 'user3'],
        day: '2024-01-17', 
        start: '16:00',
        end: '17:00'
    });
}, 10000)

// Endpoint para obter dados (equivalente ao DataTopic)
// app.get(`/data/${deviceName}`, (req, res) => {
//     res.json({
//         device: deviceName,
//         value: lastPublishedValue,
//         timestamp: new Date().toISOString()
//     });
// });

// // Endpoint para ping (equivalente ao command/ping/get)
// app.get(`/command/${deviceName}/ping`, (req, res) => {
//     const requestId = req.query.requestId || Date.now().toString();
    
//     res.json({
//         device: deviceName,
//         resource: 'ping',
//         operation: 'get',
//         requestId: requestId,
//         response: { ping: "pong" },
//         timestamp: new Date().toISOString()
//     });
// });

// // Endpoint para ler message (equivalente ao command/message/get)
// app.get(`/command/${deviceName}/message`, (req, res) => {
//     const requestId = req.query.requestId || Date.now().toString();
    
//     res.json({
//         device: deviceName,
//         resource: 'message',
//         operation: 'get',
//         requestId: requestId,
//         response: { message: messageValue },
//         timestamp: new Date().toISOString()
//     });
// });

// // Endpoint para definir message (equivalente ao command/message/set)
// app.post(`/command/${deviceName}/message`, (req, res) => {
//     const requestId = req.query.requestId || Date.now().toString();
    
//     if (req.body && req.body.message !== undefined) {
//         messageValue = req.body.message;
        
//         res.json({
//             device: deviceName,
//             resource: 'message',
//             operation: 'set',
//             requestId: requestId,
//             response: { message: messageValue },
//             timestamp: new Date().toISOString()
//         });
//     } else {
//         res.status(400).json({
//             error: "Invalid payload",
//             message: "Payload must contain 'message' field"
//         });
//     }
// });

// Endpoint para randnum (equivalente ao command/randnum/get)
app.get('/history', (req, res) => {    
    res.json(emailHistory[emailHistory.length - 1]);
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'online', device: deviceName });
});

app.listen(port, () => {
    console.log(`HTTP Device Simulator running on http://localhost:${port}`);
    // console.log(`Device name: ${deviceName}`);
    // console.log('Available endpoints:');
    // console.log(`  GET  /data/${deviceName} - Get current data`);
    // console.log(`  GET  /command/${deviceName}/ping - Ping device`);
    // console.log(`  GET  /command/${deviceName}/message - Read message`);
    // console.log(`  POST /command/${deviceName}/message - Set message`);
    console.log(`  GET  /mail/last - Get last sent email info ${emailHistory[emailHistory.length - 1]}`);
    console.log(`  GET  /health - Health check`);
});