/**
 * Created by satishazad on 13/01/24
 * File Name: LoginPage
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/ui/pages
 */

import React  from "react";
import './LoginPage.css';
import { ICONS } from "../../icons/Icons";


export const LoginPage = () => {

    return (
        <div className={'container'}>
            <div className={'overlay'}/>
            <div className={'loginBox'}>
               <span id="loginNormalText">{'Our World Revolves Around'} 
                    <span id="loginColorText" >
                         {' Powering '}
                    </span> 
                    Yours
                </span>
                <div className={'hrLine'}></div>
                <span className={'loginNormalTextDescription'}>{'YOUR TRUSTED SOLAR EXPERTS'}</span> 
            </div>

            <div className={'loginBox2'}>
                <div className="loginTextView">
                    <img src={ICONS.LOGO} />
                    <br/>
                    <br/>
                    <span className={'loginHeader'}>{'Log In Your Account'}</span>
                    <br/>
                    <span className={'loginSubtitle'}>
                        {'Enter below details to acces your'}
                        <span className={'loginSubtitleColor'}>{' Commission App '}</span>
                        {'account'}
                    </span>
                    <br/>
                    <br/>
                    <input className={'inputField'} placeholder="Commission App" />
                    <br/>
                    <br/>
                    <input className={'inputField'} placeholder="Enter Email"/>
                    <br/>
                    <br/>
                    <input className={'inputField'} placeholder="Enter Password" type="password" />
                    <br/>
                    <br/>
                    <div>
                        <input type="switch" />
                    </div>
                    <br/>
                    <br/>
                    <button className={'loginButton'}>Log In</button>
                </div>
            </div>
        </div>
    );
}

