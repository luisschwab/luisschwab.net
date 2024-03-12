import Image from 'next/image';

import style from './banner.module.css';

export default function Banner() {
    return (
        <>
        <div className={style.container}>
            <Image
                src="/img/diogenes.jpg"
                alt="diogenes and alexander in corinth"
                fill={true}
                style={{objectFit:"cover"}}
                priority={true}
            />
        </div>
        </>
    );
        
}