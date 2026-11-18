import { Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useSpeech } from 'react-text-to-speech';

export default function SpeechAction({ text = 'This is a sample.' }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const { start, stop } = useSpeech({
        text,
        pitch: 1.4,
        rate: 1,
        volume: 1,
        lang: '',
        voiceURI: 'Microsoft Zira - English (United States)',
        autoPlay: false,
        highlightText: false,
        showOnlyHighlightedText: false,
        highlightMode: 'word',
        enableDirectives: 'true',
        
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onStop: () => setIsPlaying(false),
    });

    function handlePlay() {
        if (isPlaying) {
            stop();
            setIsPlaying(false);
        } else {
            start();
            setIsPlaying(true);
        }
    }

    return (
            <button onClick={handlePlay} className='cursor-pointer'>
                {isPlaying ? (
                    <Volume2 size={16} color="gray" />
                ) : (
                    <Volume2 size={16} color="black" />
                )}
            </button>
    );
}
