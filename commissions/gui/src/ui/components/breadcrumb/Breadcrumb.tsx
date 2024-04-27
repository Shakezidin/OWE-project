import React from 'react'
import '../breadcrumb/breadcrumb.css'
import { Link } from 'react-router-dom'
interface textProps{
    head:string,
    linkPara:string,
    linkparaSecond:string,
    route:string,
}
const Breadcrumb:React.FC<textProps> = ({head,linkPara,linkparaSecond,route}) => {
  return (
    <div className='breadcrumb-container'>
    <div className="bread-link">
    <Link to={route} style={{color:"#263747"}}>{linkPara}</Link>
     <span style={{color:"#8688A0"}}>{">"}</span>
     <Link to={""} style={{color:"#8688A0"}}>
     {linkparaSecond}
     </Link>
    </div>
    </div>
  )
}

export default Breadcrumb