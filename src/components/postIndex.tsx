import Link from "next/link";

import style from "@/components/postIndex.module.css";

export default function PostIndexItem({ id, title, date, tags }) {
    return (
        <>  
            <li className={style.container}>
                    <div className={style.title}>
                        <Link href={'/blog/' + id }>{title}</Link>
                    </div>
                    
                    <div className={style.date}>
                        {date} | <span style={{fontSize: 'smaller'}}>{tags}</span>
                    </div>

                    <br/>
            </li>
        </>
    );
        
}