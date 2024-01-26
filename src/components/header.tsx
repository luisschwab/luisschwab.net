import style from './header.module.css';

import Image from 'next/image';


export default function Header() {
    return (
        <>  
            <div className={style.container}>
                <div className={style.pic}>
                    <Image
                        src="/img/luisschwab-red.jpg"
                        alt="luisschwab"
                        fill={true}
                        objectFit="cover"
                    />
                </div>

                <div className={style.name}>
                    <span>luisschwab &#9775;</span>
                </div>
            </div>
        </>
    );
        
}