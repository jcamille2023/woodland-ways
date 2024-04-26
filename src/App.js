import logo from './logo.svg';
import './App.css';
import {useEffect, useRef, forwardRef, useState} from 'react'  ;
import { initializeApp } from 'firebase/app';
import { getFirestore,ref as FirestoreRef, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
const db = getFirestore(app);

const Header = forwardRef((props, ref) => {
  // add firebase firestore links here
  let links = [{"home":'/',"key":0},{"activities":'/activities',"key":1},{"submit":'/submit',"key":2},{"contact us":'/contact',"key":3}];
  links = links.map((link) => {
    return (
      <a style={{padding: "10px"}}href={link[Object.keys(link)[0]]} key={link.key}>{Object.keys(link)[0]}</a>
    )
  }); 

  return (
    <div ref={ref} className="navbar" id="navbar" style={{width: "100%", position:"sticky"}}>
      <div style={{padding: "35px"}}>
        {links}
      </div>
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
async function getOpportunities(setOpportunities) {
    let docs = [];
    let featured_ref = await getDocs(collection(db,"/public/public", "featured_opportunities"));
    featured_ref.forEach((doc) => {
      docs.push(doc.data());
    })
    setOpportunities(docs);
}
function AboutUs() {
  let [opportunities, setOpportunities] = useState([{}]);
  getOpportunities(setOpportunities);
  return (
    <>
      <div style={{backgroundColor: "#ffffff", marginLeft: "7.5%", marginRight: "7.5%", marginTop: "3.5%", marginBottom: "3.5%",borderRadius: "15px", textAlign: "center", padding: "50px"}}>
        <div style={{padding: "20px"}}>
          <h1>What is Woodland Ways?</h1>
          <p>
          Woodland Ways is an online database dedicated to connecting high school students with a diverse range of extracurricular opportunities, including non-profit volunteering and summer programs. Always seeking a wide range of opportunities,
          the Woodland Ways team is dedicated to providing students with the resources they need to succeed.
          </p>
        </div>
      </div>
      <div style={{backgroundColor: "#8b4513", marginLeft: "7.5%", marginRight: "7.5%",marginTop: "3.5%", marginBottom: "3.5%",borderRadius: "15px", textAlign: "left",color: "white"}}>
        <div style={{padding: "20px"}}>
          <h1>Featured Opportunities</h1>
          <div style={{display: "grid", gap: "25px 50px", gridTemplateColumns: "auto auto auto"}}>
            <h1 style={{fontSize: "70px",textAlign: "center"}}>TBD</h1>
            {opportunities.map((opportunity) => {
              return (
                <div style={{backgroundColor: "black",color: "white", borderRadius: "20px"}} key={opportunity.key}>
                  <div  style={{padding: "10px"}}>
                  <img src={opportunity.imgSrc}></img>
                  <h1>{opportunity.title}</h1>
                  <p>{opportunity.description}</p>
                  </div>
                </div>
              )
            })}
            
          </div>
            <a class="button" href="/activities">View All Opportunities</a>

        </div>
      </div>
    </>
  )
}
      

function Home() {
  const bannerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      let child = headerRef.current.children[0]
        
      if (window.scrollY > bannerRef.current.clientHeight) {
        child.style.background = "black";
      } else {
        child.style.background = "transparent";
        child.style.color = "white";
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
export default Home;
