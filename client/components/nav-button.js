import React, { PropTypes } from 'react'
import Link from 'next/link'

const withLink = (href, children) =>
    href ? <Link prefetch href={href}>{children}</Link>
    : children

const NavButton = ({
    text = '',
    href,
    onClick = () => {},
    children
}) => <div>
        {withLink(href,
            <a onClick={onClick}>
                <div className={'container'}>
                    {text}
                    {children}
                </div>
            </a>)}
        <style jsx>{`
            a {
                white-space: nowrap;
                display: block;
                box-sizing: border-box;
                background: none;
                text-decoration: none;
                border: 0;
                color: inherit;
                font: inherit;
                line-height: normal;
                overflow: visible;
                -webkit-user-select: none;
                -moz-user-select: none;
                    -ms-user-select: none;
                cursor: pointer;
                height: 100%;
            }
            a:hover {
                text-decoration: underline;
            }
        `}</style>
    </div>

NavButton.propTypes = {
  text: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node
}

export default NavButton
