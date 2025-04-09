
function Home({user, onLogout}){
    return(
        <div>
            <h1>Bienvenuee {user.prenom}</h1>
            <button onClick={onLogout}>Déconnexion</button>
        </div>
        
    )
}

export default Home;