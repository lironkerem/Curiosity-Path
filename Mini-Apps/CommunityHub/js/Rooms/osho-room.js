/** OSHO ACTIVE MEDITATION ROOM - @extends TimedVideoRoom */

class OshoRoom extends TimedVideoRoom {
    constructor() {
        super({
            roomId:          'osho',
            roomType:        'timed',
            name:            'OSHO Active',
            icon:            '💃',
            description:     '7 OSHO methods. Dynamic practice.',
            energy:          'Dynamic',
            imageUrl:        'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/OSHO.png',
            participants:    0,
            cycleDuration:   90 * 60,
            openDuration:    10 * 60,
            sessionDuration: 80 * 60,
        });

        this.scheduleModalTitle = '📅 Upcoming OSHO Sessions';

        this.sessions = [
            { title: 'OSHO Chakra Breathing Meditation', duration: '77:00', category: 'Energy',   videoId: 'DqmQFz7aZ8w', emoji: '🌬️' },
            { title: 'OSHO Chakra Sounds Meditation',    duration: '77:00', category: 'Sound',    videoId: 'DqmQFz7aZ8w', emoji: '🎵' },
            { title: 'OSHO Devavani Meditation',         duration: '77:00', category: 'Voice',    videoId: 'DqmQFz7aZ8w', emoji: '🗣️' },
            { title: 'OSHO Kundalini Meditation',        duration: '77:00', category: 'Movement', videoId: 'DqmQFz7aZ8w', emoji: '💃' },
            { title: 'OSHO Mandala Meditation',          duration: '77:00', category: 'Energy',   videoId: 'DqmQFz7aZ8w', emoji: '⭕' },
            { title: 'OSHO Nadabrahma Meditation',       duration: '77:00', category: 'Humming',  videoId: 'DqmQFz7aZ8w', emoji: '🕉️' },
            { title: 'OSHO Nataraj Meditation',          duration: '77:00', category: 'Dance',    videoId: 'DqmQFz7aZ8w', emoji: '🎭' },
        ];
    }

    getInstructions() {
        return `
            <p><strong>Active OSHO meditation techniques every 90 minutes.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>Sessions open every 1.5 hours from midnight UTC - enter before :10 to join</li>
                <li>Session runs 80 minutes · Room closes at :10</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>7 OSHO methods rotating each cycle</li>
            </ul>
            <h3>Practice Guidelines:</h3>
            <ul>
                <li>Enter during the open window</li>
                <li>Express freely - move, breathe, sound</li>
                <li>Allow whatever arises</li>
            </ul>
            <h3>The 7 Methods:</h3>
            <ul>
                <li>🌬️ Chakra Breathing - Energy activation</li>
                <li>🎵 Chakra Sounds - Vocal energy work</li>
                <li>🗣️ Devavani - Gibberish and silence</li>
                <li>💃 Kundalini - Shaking and dancing</li>
                <li>⭕ Mandala - Running in circles</li>
                <li>🕉️ Nadabrahma - Humming meditation</li>
                <li>🎭 Nataraj - Dance meditation</li>
            </ul>`;
    }
}

window.OshoRoom = new OshoRoom();
