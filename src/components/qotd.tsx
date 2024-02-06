import style from "@/components/qotd.module.css";

import { useState, useEffect } from 'react';

export default function QOTD() {
    
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const currDate = new Date();
        const day = currDate.getDate();

        // Fetch the quotes from the local file
        fetch('/quotes.json')
            .then((response) => response.json())
            .then((data) => {
                const quotes = data.quotes;
                const quoteIndex = (day) % quotes.length;
                
                // same quote for the day
                //setQuote(quotes[quoteIndex]);
                
                // random quote on every request
                setQuote(quotes[Math.floor(Math.random() * (quotes.length))]);

                // last quote of quotes.json
                //setQuote(quotes[quotes.length-1]);

                //setQuote(quotes[19]);
            })
            .catch((err) => console.error('error:', err));
    }, []);

    return (
        <div className={style.container} id="qotd">
            <div className={style.text}>
                QØTD:
                <br/>
                &#x275D;{quote[0]}&#x275E;
                <br/>
                <em>&mdash;{quote[1]}</em>
                <br/>
            </div>
        </div>
    );
};
