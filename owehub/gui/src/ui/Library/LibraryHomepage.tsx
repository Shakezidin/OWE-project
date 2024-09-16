import { AddNewButton } from "../components/button/AddNewButton"
import "./LibraryHomepage.css"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { ICONS } from '../../resources/icons/Icons';

const LibraryHomepage = () => {
  const libData = [
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
    { url: `${ICONS.pdf}`, name: "Jordan Ulmer", date: "14 sep 2024" },
  ]

  return (
    <div className="library-container">
      <div className="library-header flex items-center justify-between p2">
        <h3>Library</h3>
        <AddNewButton
          title="New"
          onClick={() => { }}
        />
      </div>
      <div className="library-section">
        <div className="lib-sec-header flex items-center justify-between">
          <h3>Recent Files</h3>
          <div className="lib-sec-pg">
            <FaChevronLeft style={{ color: "D4D4D4" }} />
            <FaChevronRight style={{ color: "#377CF6" }} />
          </div>
        </div>
        <div className="lib-section-wrapper">
          {libData.map((data) => (
            <div className="lib-sec-cards">
              <div className="card">
                <img className="card-img" src={data.url} alt="pdf-images" />
                <div className="card-text">
                  <p className="card-name">{data.name}</p>
                  <p className="card-date">{data.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LibraryHomepage