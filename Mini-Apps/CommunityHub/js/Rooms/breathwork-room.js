/**BREATHWORK ROOM - @extends TimedVideoRoom */

import { TimedVideoRoom } from './mixins/TimedVideoRoom.js';

class BreathworkRoom extends TimedVideoRoom {
    constructor() {
        super({
            roomId:          'breathwork',
            roomType:        'timed',
            name:            'Breathwork',
            icon:            '💨',
            description:     'Holotropic, Wim Hof, and more.',
            energy:          'Transformative',
            imageUrl:        'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Breathwork.png',
            participants:    0,
            cycleDuration:   90 * 60,
            openDuration:    10 * 60,
            sessionDuration: 80 * 60,
        });

        this.scheduleModalTitle = '📅 Upcoming Breathwork Sessions';

        this.sessions = [
            { title: 'Holotropic Breathwork',    duration: '70:00', category: 'Deep',    videoId: 'DqmQFz7aZ8w', emoji: '🌊' },
            { title: 'Wim Hof Method',           duration: '70:00', category: 'Power',   videoId: 'DqmQFz7aZ8w', emoji: '❄️' },
            { title: 'Box Breathing (Navy SEAL)', duration: '70:00', category: 'Focus',   videoId: 'DqmQFz7aZ8w', emoji: '⬜' },
            { title: 'Pranayama - Nadi Shodhana', duration: '70:00', category: 'Balance', videoId: 'DqmQFz7aZ8w', emoji: '🧘' },
            { title: 'Circular Breathing',        duration: '70:00', category: 'Energy',  videoId: 'DqmQFz7aZ8w', emoji: '🔄' },
        ];
    }

    getInstructions() {
        return `
            <p><strong>Transformative breathwork sessions every 90 minutes.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>Sessions open every 1.5 hours from midnight UTC - enter before :10 to join</li>
                <li>Session runs 80 minutes · Room closes at :10</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>5 techniques rotating each cycle</li>
            </ul>
            <h3>Safety Guidelines:</h3>
            <ul>
                <li>Find a safe position (lying or seated)</li>
                <li>Never practice while driving or in water</li>
                <li>Stop if you feel dizzy or uncomfortable</li>
            </ul>
            <h3>Techniques:</h3>
            <ul>
                <li>🌊 Holotropic - Deep transformative breathing</li>
                <li>❄️ Wim Hof - Power breathing and breath holds</li>
                <li>⬜ Box Breathing - Military focus technique</li>
                <li>🧘 Pranayama - Traditional yogic breathing</li>
                <li>🔄 Circular - Continuous energy breathing</li>
            </ul>`;
    }
}

// Window bridge: preserved for inline onclick handlers
const breathworkRoom = new BreathworkRoom();
window.BreathworkRoom = breathworkRoom;

export { BreathworkRoom, breathworkRoom };
