const { EmailService } = require('./emailService');

// Serviço de Background que verifica reuniões
class MeetingNotificationService {
    constructor() {
        this.emailService = new EmailService();
        this.meetings = []; // Array temporário para simular BD
        this.users = [];    // Array temporário para simular users
        
        this.populateSampleData(); // Popular com dados de exemplo
    }

    // 🎯 POPULAR COM DADOS DE EXEMPLO
    populateSampleData() {
        // Users de exemplo
        this.users = [
            { _id: 'user1', name: 'João Silva', email: 'joao@email.com' },
            { _id: 'user2', name: 'Maria Santos', email: 'maria@email.com' },
            { _id: 'user3', name: 'Carlos Oliveira', email: 'carlos@email.com' }
        ];

        // Reuniões de exemplo
        this.meetings = [
            {
                _id: 'meeting1',
                title: 'Reunião de Planeamento',
                participants: ['user1', 'user2'],
                day: '2024-01-15',
                start: '10:00',
                end: '11:00',
                status: 'pending',
                notificationSent: false
            },
            {
                _id: 'meeting2', 
                title: 'Apresentação do Projeto',
                participants: ['user2', 'user3'],
                day: '2024-01-16',
                start: '14:00',
                end: '15:00',
                status: 'pending',
                notificationSent: false
            }
        ];
    }

    start() {
        console.log('🟢 MeetingNotificationService iniciado');
        
        // Verificar a cada 30 segundos
        setInterval(() => {
            this.checkMeetingsToNotify();
        }, 30000);
    }

    async checkMeetingsToNotify() {
        try {
            console.log("🔍 Verificando reuniões...");
            
            // 1. Buscar reuniões que precisam de notificação
            const meetingsToNotify = this.meetings.filter(meeting => 
                meeting.status === 'pending' && 
                meeting.notificationSent === false
            );

            console.log(`📋 Encontradas ${meetingsToNotify.length} reuniões para notificar`);

            // 2. Para cada reunião, enviar emails
            for (const meeting of meetingsToNotify) {
                await this.sendMeetingNotifications(meeting);
                
                // Marcar como notificada
                meeting.notificationSent = true;
                console.log(`✅ Reunião "${meeting.title}" marcada como notificada`);
            }

        } catch (error) {
            console.error("❌ Erro ao verificar reuniões:", error);
        }
    }

    async sendMeetingNotifications(meeting) {
        // Buscar dados dos participantes
        const participants = this.users.filter(user => 
            meeting.participants.includes(user._id)
        );

        console.log(`👥 Participantes para "${meeting.title}":`, participants.map(p => p.name));

        // Enviar email para cada participante
        await this.emailService.sendMeetingInvitation(meeting, participants);

        console.log(`📧 Emails enviados para reunião: ${meeting.title}`);
    }

    // 🎯 MÉTODO PARA ADICIONAR NOVAS REUNIÕES (para teste)
    addNewMeeting(meetingData) {
        const newMeeting = {
            _id: `meeting${this.meetings.length + 1}`,
            ...meetingData,
            status: 'pending',
            notificationSent: false
        };
        
        this.meetings.push(newMeeting);
        console.log(`➕ Nova reunião adicionada: "${newMeeting.title}"`);
        
        return newMeeting;
    }
}

module.exports = { MeetingNotificationService };