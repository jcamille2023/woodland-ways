import logo from './logo.svg';
import './App.css';
import {useEffect, useRef, forwardRef} from 'react'  ;


const Header = forwardRef((props, ref) => {
  
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

const Banner = forwardRef((props, ref) =>{
  let logo = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
  return (
    <div ref={ref}className="banner">
      <img style={{width: "100vw",height: "100vh", }}src={logo}></img>
    </div>
  )

});

      

function App() {
  const bannerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      if (window.scrollY > bannerRef.current.clientHeight) {
        headerRef.current.style.backgroundColor = "white";
      } else {
        headerRef.current.style.position = "relative";
      }
    });
  })
  
  return (
    <>
      <Header ref={headerRef}/>
      <Banner ref={bannerRef}/>
      <Footer />
      </>
  );
}
export default App;
