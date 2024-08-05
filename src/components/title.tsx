import style from './title.module.css';

export default function Title({ content }) {
    return (
        <>  
            <div className={style.container}>
                <div className={style.text}>
                    {content}
                </div>
            </div>
        </>
    );       
}