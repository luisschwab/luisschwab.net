import {useEffect} from 'react';

export default function Utterances() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.setAttribute('repo', 'luisschwab/luisschwab.net');
        script.setAttribute('issue-term', 'pathname');
        script.setAttribute('theme', 'gruvbox-dark');
        script.setAttribute('crossorigin', 'anonymous');
        script.setAttribute('async', '');
        
        const container = document.createElement('div');
        container.id = 'utterances';
        
        container.appendChild(script);
        document.getElementById('utterance')?.appendChild(container);
        
        return () => {
            document.getElementById('utterance')?.removeChild(container);
        };
        
    }, []);

    return (
        <div>
            <hr/>
        </div>
    );
}