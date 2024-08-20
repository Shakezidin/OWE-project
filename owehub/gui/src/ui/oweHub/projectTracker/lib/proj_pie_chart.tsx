import React from 'react'
import { ICONS } from '../../../../resources/icons/Icons'
import './pojpie.css'
import { CiLink } from 'react-icons/ci'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { RiExternalLinkLine } from 'react-icons/ri'
import { FiLink } from 'react-icons/fi'

const proj_pie_chart = () => {
  return (
    <>
    <div className='pm-doc-heading'>
       Resources
    </div>

    <div className='pc-links'>
      <div className='pc-link'>
        <div className='link-head'>
          <h3>Podio</h3>
          <span>Got to Podio Document for more info</span>
        </div>

        <div className='link-url'>
          <div className='link-tab'>
            <FiLink />
          </div>
          <div className='link-tab'>
            <RiExternalLinkLine />
          </div>
        </div>

      </div>

      <div className='pc-link'>
        <div className='link-head'>
          <h3>CAD</h3>
          <span>Go to Document for more info</span>
        </div>

        <div className='link-url'>
          <div className='link-tab'>
            <FiLink />
          </div>
          <div className='link-tab'>
            <RiExternalLinkLine />
          </div>
        </div>

      </div>

      <div className='pc-link'>
        <div className='link-head'>
          <h3>DAT</h3>
          <span>Got to Document for more info</span>
        </div>

        <div className='link-url'>
          <div className='link-tab'>
            <FiLink />
          </div>
          <div className='link-tab'>
            <RiExternalLinkLine />
          </div>
        </div>

      </div>

      <div className='pc-link'>
        <div className='link-head'>
          <h3>Contract</h3>
          <span>Got to Document for more info</span>
        </div>

        <div className='link-url'>
          <div className='link-tab'>
            <FiLink />
          </div>
          <div className='link-tab'>
            <RiExternalLinkLine />
          </div>
        </div>

      </div>
    </div>

    </>
  )
}

export default proj_pie_chart
