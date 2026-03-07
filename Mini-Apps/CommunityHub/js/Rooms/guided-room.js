/**GUIDED MEDITATION ROOM - @extends TimedVideoRoom */

import { TimedVideoRoom } from './mixins/TimedVideoRoom.js';

class GuidedRoom extends TimedVideoRoom {
    constructor() {
        super({
            roomId:          'guided',
            roomType:        'timed',
            name:            'Guided Meditation',
            icon:            '🎧',
            description:     'Hourly sessions. Timer & notifications.',
            energy:          'Focused',
            imageUrl:        '/public/Community/Visualization.png',
            participants:    0,
            cycleDuration:   60 * 60,
            openDuration:    15 * 60,
            sessionDuration: 45 * 60,
        });

        this.scheduleModalTitle = '📅 Today\'s Meditation Schedule';

        this.sessions = [
            { title: 'Grounding to the Center of Earth', duration: '29:56', category: 'Grounding',     videoId: '_KedpeSYwgA', emoji: '🌍' },
            { title: 'Aura Adjustment and Cleaning',     duration: '29:56', category: 'Energy',        videoId: 'gIMfdNkAC4g', emoji: '✨' },
            { title: 'Chakra Cleaning',                  duration: '39:58', category: 'Chakras',       videoId: 'BFvmLeYg7cE', emoji: '🌈' },
            { title: 'The Center of the Universe',       duration: '29:56', category: 'Spiritual',     videoId: '1T2dNQ4M7Ko', emoji: '🌌' },
            { title: 'Blowing Roses Healing Technique',  duration: '29:56', category: 'Healing',       videoId: '3yQrtsHbSBo', emoji: '🌹' },
            { title: '3 Wishes Manifestation',           duration: '29:52', category: 'Manifestation', videoId: 'EvRa_qwgJao', emoji: '⭐' },
            { title: 'Meeting your Higher Self',         duration: '29:56', category: 'Premium',       videoId: '34mla-PnpeU', emoji: '💎' },
            { title: 'Inner Temple',                     duration: '29:46', category: 'Premium',       videoId: 't6o6lpftZBA', emoji: '🔮' },
            { title: 'Gratitude Practice',               duration: '29:56', category: 'Premium',       videoId: 'JyTwWAhsiq8', emoji: '👑' },
        ];
    }

    getInstructions() {
        return `
            <p><strong>Hourly guided meditation sessions.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>A new session begins every hour, on the hour</li>
                <li>Open window: :00 to :15 - enter before :15 to join</li>
                <li>Session runs 45 minutes · Room closes at :15</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>9 meditations rotating hourly</li>
            </ul>
            <h3>Practice Guidelines:</h3>
            <ul>
                <li>Find a comfortable seated position</li>
                <li>Close your eyes or soften your gaze</li>
                <li>Follow the guided instructions</li>
                <li>Allow yourself to fully receive</li>
            </ul>`;
    }
}

// Window bridge: preserved for inline onclick handlers
const guidedRoom = new GuidedRoom();
window.GuidedRoom = guidedRoom;

export { GuidedRoom, guidedRoom };
