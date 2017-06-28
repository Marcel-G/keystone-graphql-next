import React from 'react'
import Link from 'next/link'
import LoginButton from './login-button'

const Nav = () =>
    <div>
        <nav>
            <div className={'nav-section'} />
            <div className={'nav-section container'}>
                <Link href={'/'}>
                    <a> 🐄 </a>
                </Link>
            </div>
            <div className={'nav-section navItems'}>
                <LoginButton />
            </div>
        </nav>
        <style jsx>{`
            nav {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                padding: 3em 2em;
            }
            .nav-section {
              flex: 1 0;
            }
            .navItems {
                display: flex;
                justify-content: flex-end;
                padding-left: 2em;
            }
            .container {
                text-align: center;
                width: 100%;
                margin: .5em 0;
            }
            .container > a {
                font-weight: bold;
                font-size: 4em;
                text-decoration: none;
            }
        `}</style>
    </div>

export default Nav
