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
                const qotdIndex = (day) % quotes.length;
                
                let e = 2;
                switch (e) {
                    case 1:
                        // same quote for whole the day
                        setQuote(quotes[qotdIndex]);
                        break;
                    case 2:
                        // random quote on every request
                        setQuote(quotes[Math.floor( Math.random() * (quotes.length ))]);
                        break;
                    case 3:
                        // last quote of quotes.json
                        setQuote(quotes[quotes.length-1]);
                        break;
                    case 4:
                    default:
                        // cherry pick quote
                        let index = 14;
                        setQuote(quotes[index]);
                        break;
                }

            })
            .catch((err) => console.error('error:', err));
    }, []);

    return (
        <div className={style.container} id="qotd">
            <div className={style.text}>
                QOTD:
                <br/>
                &#x275D;{quote[0]}&#x275E;
                <br/>
                <em>&mdash;{quote[1]}</em>
                <br/>
            </div>
        </div>
    );
};
