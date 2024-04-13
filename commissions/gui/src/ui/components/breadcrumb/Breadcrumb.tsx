import React from 'react'
import '../breadcrumb/breadcrumb.css'
import { Link } from 'react-router-dom'
interface textProps{
    head:string,
    linkPara:string,
    linkparaSecond:string
}
const Breadcrumb:React.FC<textProps> = ({head,linkPara,linkparaSecond}) => {
  return (
    <div className='breadcrumb-container'>
     <p className='bread-head'>{head}</p>
    <div className="bread-link">
    <Link to={""} style={{color:"#263747"}}>{linkPara}</Link>
     <span style={{color:"#8688A0"}}>{">"}</span>
     <Link to={""} style={{color:"#8688A0"}}>
     {linkparaSecond}
     </Link>
    </div>
    </div>
  )
}

export default Breadcrumb