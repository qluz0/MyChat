//import React from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import {useAuthState} from 'react-firebase-hook/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDyWXegDg6pmi2ZFw76I9_z23k4oxAB6T8",
  authDomain: "mychat-24b58.firebaseapp.com",
  projectId: "mychat-24b58",
  storageBucket: "mychat-24b58.appspot.com",
  messagingSenderId: "146454444850",
  appId: "1:146454444850:web:11d3ba7fb0082299d4f52b"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const App = initializeApp(firebaseConfig);


function App() {

const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />} 
      </section>
    </div>
  );
}

function SignIn(){
const signInWithGoogle = () => {
   const provider = new firebase.auth.GoogleAuthProvider();
   auth.signInWithPopup(provider);
}
return (<button onClick={signInWithGoogle}>Sign in with Google</button>
 )
}

function SignOut(){
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>

  )
}




function ChatRoom(){

const messagesRef = firestore.collection('messages');
const query = messagesRef.orderBy('createdAt').limit(25);

const [messages] = useCollectionData(query, {idFeild: 'id'});

const [formValue, setFormValue] = useState('');

const dummy = useRef()

const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL} = auth.currentUser;

    await messagesRef.add({
          text: formValue,
          createdAt: firebase.firestore.FeildValue.serverTimestamp(),
          uid,
          photoURL
    });

    setFormValue('');

dummy.current.scrollIntoView({ behaviot: 'smooth'});


  }

return (
    <>
       <main>
         {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
          
          <div ref={dummy}> </div>

          </main>   
    <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="type here" />
        <button type="submit">🕊️</button>

          </form>   
    </>
  )
}

function ChatMessage(props) {
const { text, uid, photoURL } = props.message;

const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
return (
<div className={`message ${messageClass}`}>
  <img src={photoUrl} /> 
  <p>{text}</p>
</div>

)


}



export default App;
