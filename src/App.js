import logo from './logo.svg';
import './App.css';
import {useEffect, useRef, forwardRef, useState} from 'react'  ;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getFirestore,ref as FirestoreRef, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref as StorageRef, getDownloadURL} from 'firebase/storage';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from "firebase/auth";
import { set } from 'firebase/database';


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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Header = forwardRef((props, ref) => { // header code to map links
  // add firebase firestore links here
  let links = [{"home":'/',"key":0},{"activities":'/activities',"key":1},{"submit":'https://forms.gle/PnrkDNvVxpEAYJub9',"key":2},{"contact us":'/contact',"key":3}];
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

const Footer = forwardRef((props, ref) => { //basic footer for later
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
const Banner = forwardRef((props, ref) =>{ //banner requires a forwardref to match position and cause a scroll event
  const imgRef = StorageRef(storage,"public/img/banner.png");
  const [src, setSrc] = useState();
  setImage(setSrc, imgRef);
  return (
    <div style={{scale: 3 }} ref={ref} className="banner">
      <img src={src}></img>
    </div>
  )

});
function AboutUs() 
{ // section of page that has opportunities
  let [opportunities, setOpportunities] = useState([]);
  let [errorState, setErrorState] = useState(false);
  let [overlay, setOverlay] = useState();
  let list = [];
  useEffect(() => {
    getDocs(collection(db,"/public/public", "featured_opportunities")).then((docs) => {
      docs.forEach((doc) => {
        list.push(doc.data()); // gets all featured opportunities and places them in an array
      });
      setOpportunities(list); // sets the opportunities variable to contain the list of opportunities
    } ).catch((err) => {
      console.log(err);
      setErrorState(true);
    });
});
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
          <div style={{display: "grid", gap: "25px 50px", gridTemplateColumns: "auto auto auto", margin: "25px"}}>
            {errorState ? (<div><h1>There has been an error.</h1></div>) : opportunities.map((opportunity) => ( // maps the opportunities to the page

                <div className="opportunity" style={{backgroundColor: "black",color: "white", borderRadius: "20px", transitionDuration: "0.5s"}} key={opportunity.key} onClick={() => {setOverlay(ShowActivity(opportunity,setOverlay))}}>
                  <div  style={{padding: "10px"}}>
                  <img src={opportunity.imgSrc}></img>
                  <h1>{opportunity.title}</h1>
                  <p>{opportunity.description}</p>
                  </div>
                </div>

            ))};

          </div>
          {overlay}
            <a className="button" style={{fontFamily: "century-gothic", margin: "10px"}}href="/activities">View All Opportunities</a>
        </div>
      </div>
    </>
  )
}
      

function Home() 
{
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

function ShowActivity(activity, setOverlay) 
{
  return (
    <div className="overlay"style={{width: "100vh", height: "100vh", position: "absolute", top: '0', padding: '5% 5% 0% 0%'}}>
      <div className="close" style={{position: "absolute", top: "0", right: "0", padding: "25px", cursor: "pointer"}} onClick={() => {setOverlay()}}>X</div>
      <div style={{padding: '25px'}}>
        <h1>{activity.title}</h1>
        <h2>{activity.institution}</h2>
        <p>{activity.description}</p>
        <div className="attributes">
          <div>
            <h2>Location</h2>
            <p>{activity.location}</p>
          </div>
          <div>
            <h2>Deadline</h2>
            <p>{activity.deadline}</p>
          </div>
          <div>
            <h2>Duration</h2>
            <p>{activity.duration}</p>
          </div>
        </div>
        <a href={activity.link}>Learn more</a>
      </div>
    </div>
  );
}
function Activities() 
{
  const [activities, setActivities] = useState([]);
  const [overlay, setOverlay] = useState();
  const [loaded, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorState, setErrorState] = useState(false);
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (search === '') {
          const q = collection(db, "/public/public", "opportunities");
          const querySnapshot = await getDocs(q);
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push(doc.data());
            console.log(doc.data());
          });
          setActivities(list);
        } else {
          const q = query(collection(db, "/public/public", "featured_opportunities"), where("title", "==", search));
          const querySnapshot = await getDocs(q);
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push(doc.data());
            console.log(doc.data());
          });
          setActivities(list);
        }
        setIsLoading(false);

    } catch(err) {
      console.log(err);
      setIsLoading(false);
      setErrorState(true);
      return [];
    }
    };

    fetchActivities();
  }, [search]);


  let items = (
    <div style={{display: "grid", gap: "25px 50px", gridTemplateColumns: "auto auto auto", margin: "25px"}}>
          {errorState ? (<div><h1>There has been an error.</h1></div>) : activities.map((opportunity) => {
            console.log(opportunity)
            return (
              <div className="opportunities" style={{backgroundColor: "white",color: "black", borderRadius: "20px", transitionDuration: "0.5s"}} key={opportunity.key} onClick={() => {setOverlay(ShowActivity(opportunity,setOverlay))}}>
                <p>Click on an opportunity to learn more!</p>
                  <div className="activity" style={{padding: "10px"}} >
                  <h1>{opportunity.title}</h1>
                  <h2>{opportunity.institution}</h2>
                  <p>Deadline: {opportunity.deadline}</p>
                  </div>
                </div>
            );
          })}
          </div>
  );
  
  return (
    <>
      <Header style={{backgroundColor: "#ffffff"}}/>
      <div style={{marginLeft: "7.5%", marginRight: "7.5%", marginTop: "3.5%", marginBottom: "3.5%",borderRadius: "15px", textAlign: "center", padding: "50px", backgroundColor: "white"}}>
        <h1>Activities</h1>
        <div id="activity-section">
          <div className="search">
          
            <div>
            <input type="text" id="searchterm" placeholder="Search . . ." required></input>
            <button onClick={(e) => {setSearch(document.getElementById("searchterm").value)}}>Search..</button>
            </div>
          </div>
          {loaded ? <Loading /> : items}
  
        </div>
      </div>
      {overlay}
      <Footer />
    </>
  )

}
function Loading() {
  return (
    <div className="loader"></div>
  )
}

function PageNotFound() {
  return (
    <>
    <Header></Header>
    <Banner />
    <div style={{textAlign: "center"}}>
      <h1>404</h1>
      <p>Page not found</p>
      </div>
      <Footer />
    </>
  )
}

function Submit() {
  const [user, setUser] = useState();
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
    if(user) {
      return (
        <>
  <AdminHeader>{user}</AdminHeader>
  <Banner />
  <div style={{textAlign: "center"}}>
    <h1>Submit an Opportunity</h1>
    <form>
      <input type="text" placeholder="Title" required></input>
      <input type="text" placeholder="Description" required></input>
      <input type="text" placeholder="Location" required></input>
      <input type="text" placeholder="Date" required></input>
      <input type="text" placeholder="Duration" required></input>
      <input type="text" placeholder="Image URL" required></input>
      <button>Submit</button>
    </form>
  </div>
  </>
      );
    }
    else {
      return (<AdminLogin />);
    }
}
  
function AdminHome(user) {
  return (
    <>
    <AdminHeader>{user}</AdminHeader>
    <Banner />
    <div style={{textAlign: "center"}}>
      <h1>Admin Dashboard</h1>
      <a href="/submit">Submit an Opportunity</a>
    </div>
    </>
  );

}
function Admin() {
  const [user, setUser] = useState();
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
    if(user) {
      return (<AdminHome>{user}</AdminHome>);
    }
    else {
      return (<AdminLogin />);
    }
}


function AdminLogin() {
  return (
    <div className="wrapper">
<table id="center">
        <tbody>
            <tr>
                <td width="50%">
    <h1 style={{color: 'white'}}>Woodland Ways</h1>
    <h4 style={{color: 'white'}}>Admin Page</h4>
</td>
                <td width="50%" style={{
    textAlign: "center"}}>
    <button className="gsi-material-button" id="sign-in-button" onClick={login}>
  <div className="gsi-material-button-state"></div>
  <div className="gsi-material-button-content-wrapper">
    <div className="gsi-material-button-icon">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
      </svg>
    </div>
    <span className="gsi-material-button-contents">Sign in with Google</span>
    
  </div>
</button>
</td>
            </tr>
        </tbody>
    </table>
</div>
  );
}

function AdminHeader(user) {
  let links = [{"home":'/',"key":0},{"settings":'/admin/settings',"key":1},{"sign out":'javascript:logout()',"key":2}];
  links = links.map((link) => {
    return (
      <a style={{padding: "10px"}}href={link[Object.keys(link)[0]]} key={link.key}>{Object.keys(link)[0]}</a>
    )
  }); 

  return (
    <div className="navbar" id="navbar" style={{width: "100%", position:"sticky"}}>
      <div style={{padding: "35px"}}>
        <p>{user.children.displayName}</p>
        {links}
      </div>
    </div>
  )
}


function login() {
  signInWithPopup(auth,provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    let user = result.user;
    console.log(credential);
    console.log(token);
    console.log(user);
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }
  function logout() {
    signOut(auth).then(() => {
    console.log("User is signed out.");
    }).catch((error) => {
    // An error happened.
    });
  }
  window.logout = logout;
function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="*" element={<PageNotFound />}></Route>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/submit" element={<Submit />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
