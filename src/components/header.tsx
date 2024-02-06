import style from './header.module.css';

import Image from 'next/image';


export default function Header() {
    return (
        <>  
            <div className={style.container}>
                <div className={style.pic}>
                    <Image
                        src="/img/headshot.jpg"
                        alt="luisschwab"
                        fill={true}
                        objectFit="cover"
                    />
                </div>

                <div className={style.name}>
                    luisschwab <span style={{fontFamily: 'Helvetica' }}>&#9775;</span>
                </div>
            </div>
        </>
    );
        
}