import logo from './logo.svg';
import './App.css';
import {useEffect, useRef, forwardRef, useState} from 'react'  ;
import { initializeApp } from 'firebase/app';
import { getFirestore,ref as FirestoreRef } from 'firebase/firestore';
import { getStorage, ref as StorageRef, getDownloadURL} from 'firebase/storage';


const firebaseConfig = {

  apiKey: "AIzaSyDyTsLzol1L2O7okUUZqR0Dteytdnx4aR8",

  authDomain: "woodland-ways.firebaseapp.com",

  projectId: "woodland-ways",

  storageBucket: "woodland-ways.appspot.com",

  messagingSenderId: "379451321788",

  appId: "1:379451321788:web:28179dd6cffd1219304fb9",

  measurementId: "G-D0M39ETSQ7"

};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const storage = getStorage(app);

const Header = forwardRef((props, ref) => {
  // add firebase firestore links here
  let links = [{"home":'/',"key":0},{"activities":'/activities',"key":1},{"submit":'/submit',"key":2},{"contact us":'/contact',"key":3}];
  links = links.map((link) => {
    return (
      <a href={link[Object.keys(link)[0]]} key={link.key}>{Object.keys(link)[0]}</a>
    )
  });

  return (
    <div ref={ref} className="navbar" id="navbar" style={{width: "100%", position:"sticky"}}>
      {links}
    </div>
  )
});

const Footer = forwardRef((props, ref) => {
  return (
    <div className="footer">
      <p>© 2021</p>
    </div>
  )
});

async function setImage(setSrc,reference) {
  let link = await getDownloadURL(reference);
  setSrc(link);
  console.log(link);
}
const Banner = forwardRef((props, ref) =>{
  const imgRef = StorageRef(storage,"public/img/banner.png");
  const [src, setSrc] = useState();
  setImage(setSrc, imgRef);
  return (
    <div style={{scale: 3 }} ref={ref} className="banner">
      <img src={src}></img>
    </div>
  )

});

function AboutUs() {
  return (
    <>
      <h1>What is Woodland Ways?</h1>
      <p></p>
    </>
  )
}
      

function App() {
  const bannerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      if (window.scrollY > bannerRef.current.clientHeight) {
        headerRef.current.style.backgroundColor = "white";
      } else {
        //headerRef.current.style.position = "relative";
      }
    });
  })
  
  return (
    <>
      <Header ref={headerRef}/>
      <Banner ref={bannerRef}/>
      <AboutUs />
      <Footer />
      </>
  );
}
export default App;
