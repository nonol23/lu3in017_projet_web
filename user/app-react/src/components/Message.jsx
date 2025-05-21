function Message() {
    const[message,setMessage] = useState('');
    const[auteur,setAuteur] = useState('');
    const[date,setDate] = useState('');
    const[listMessage,setListMessage] = useState([]);

    const getMessage = (evt) => {setMessage(evt.target.value)};
    const getAuteur = (evt) => {setAuteur(evt.target.value)};

    const handleSubmit = (evt) => {
        if (message == ''){
            return;
        }
        else{
            console.log("Message publié!\n");
            setListMessage([listMessage,message]);
            setMessage('');
        }
    }




    return (
        <div>
            <form onSubmit = {handleSubmit}>
                <label htmlFor="msg" placeholder="Ecrire un nouveau message..."></label>
                <input type="text"
                    id="message"
                    value={message}
                    onChange={getMessage}
                />
                <input type="text"
                    id="auteur"
                    value={auteur}
                    onChange={getAuteur}
                />
                <button type="submit">Envoyer</button>
            </form>
            <div>
                <h1>Messages récents :</h1>

            </div>
        </div>
    );
};

export default Message;

