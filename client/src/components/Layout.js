import React from 'react';
import '../layout.css';
import {Link} from "react-router-dom";

function Layout({children}) {
   // const location = useLocation();
const userMenu = [
    {
        name: 'Home',
        link: '/',
        icon : 'ri-home-line'
    },
    {
        name: 'Appointments',
        link: '/appointments',
        icon : 'ri-file-list-line'
    },
    {
        name: 'Apply Doctor',
        link: '/apply-doctor',
        icon : 'ri-hospital-line'
    },
    {
        name: 'Profile',
        link: '/profile',
        icon : 'ri-user-line'
    },
    {
        name: 'Logout',
        link: '/logout',
        icon : 'ri-login-box-line'
    }

]
    const menuToBeRendered = userMenu;
    return (
        <div className='main'>
            <div className='d-flex layout'>
                <div className='sidebar'>
                    <div className='sidebar-header'>
                        <h1> DBA </h1>
                    </div>
                    <div className='menu'>
                        {menuToBeRendered.map((menu) => {
                            return <div className="d-flex menu-item">
                                <i className={menu.icon}></i>
                                <Link to={menu.path}>{menu.name}</Link>
                            </div>
                        })
                        }
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        header
                    </div>
                    <div className='body'>
                       body {children}
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Layout;
