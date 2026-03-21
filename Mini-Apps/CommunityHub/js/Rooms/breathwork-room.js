/**BREATHWORK ROOM - @extends TimedVideoRoom */

import { TimedVideoRoom } from './mixins/TimedVideoRoom.js';

class BreathworkRoom extends TimedVideoRoom {
    constructor() {
        super({
            roomId:          'breathwork',
            roomType:        'timed',
            name:            'Breathwork',
            icon:            '💨',
            description:     'Unique Breathwork Sessions, from different modalities and techniques. View Schedule for details.',
            energy:          'Transformative',
            imageUrl:        '/public/Community/Breathwork.webp',
            participants:    0,
            cycleDuration:   90 * 60,
            openDuration:    10 * 60,
            sessionDuration: 80 * 60,
        });

        this.scheduleModalTitle = '📅 Upcoming Breathwork Sessions';

        this.sessions = [
            { title: 'Trauma Release & Emotional Renewal',      duration: '70:00', category: 'Healing',       videoId: 'eocuqWqaKgk', emoji: '💫' },
            { title: 'Rewire Your Brain',                        duration: '70:00', category: 'Transformation', videoId: '6JrHM6UjVpw', emoji: '🧠' },
            { title: 'Meet Your Higher Self',                    duration: '70:00', category: 'Spiritual',      videoId: 'DAVdAGn5ELw', emoji: '✨' },
            { title: 'Deep Sleep Breathing & Affirmations',      duration: '70:00', category: 'Rest',           videoId: 'q3DygsrH9q8', emoji: '🌙' },
            { title: 'Darkness to Light Breathwork Experience',  duration: '70:00', category: 'Energy',         videoId: 'Kv7GhUpLUE4', emoji: '🌅' },
            { title: 'Wim Hof Method Breathwork',                duration: '70:00', category: 'Power',          videoId: 'CQnW0rLozww', emoji: '❄️' },
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
                <li>6 techniques rotating each cycle</li>
            </ul>
            <h3>Safety Guidelines:</h3>
            <ul>
                <li>Find a safe position (lying or seated)</li>
                <li>Never practice while driving or in water</li>
                <li>Stop if you feel dizzy or uncomfortable</li>
            </ul>
            <h3>Techniques:</h3>
            <ul>
                <li>💫 Trauma Release - Emotional renewal and healing</li>
                <li>🧠 Rewire Your Brain - Transformational breathwork</li>
                <li>✨ Higher Self - Spiritual guided breathwork</li>
                <li>🌙 Deep Sleep - Breathing and affirmations</li>
                <li>🌅 Darkness to Light - Energy breathwork experience</li>
                <li>❄️ Wim Hof - Power breathing and breath holds</li>
            </ul>`;
    }
}

// Window bridge: preserved for inline onclick handlers
const breathworkRoom = new BreathworkRoom();
window.BreathworkRoom = breathworkRoom;

export { BreathworkRoom, breathworkRoom };
