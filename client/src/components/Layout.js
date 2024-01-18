import React, {useState} from 'react';
import '../layout.css';
import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

function Layout({children}) {
    const [collapsed, setCollapsed] = useState(false);
    const {user} = useSelector(state => state.user);
    const location = useLocation();
    const userMenu = [
        {
            name: 'Home',
            link: '/',
            icon: 'ri-home-line'
        },
        {
            name: 'Appointments',
            link: '/appointments',
            icon: 'ri-file-list-line'
        },
        {
            name: 'Apply Doctor',
            link: '/apply-doctor',
            icon: 'ri-hospital-line'
        },
        {
            name: 'Profile',
            link: '/profile',
            icon: 'ri-user-line'
        },
        {
            name: 'Logout',
            link: '/logout',
            icon: 'ri-login-box-line'
        }

    ]
    const menuToBeRendered = userMenu;
    return (
        <div className='main'>
            <div className='d-flex layout'>
                <div className={`${collapsed ? 'collapsed-sidebar' : 'sidebar'}`}>
                    <div className='sidebar-header'>
                        <h1> DBA </h1>
                    </div>
                    <div className='menu'>
                        {menuToBeRendered.map((menu, i) => {
                            const isActive = location.pathname === menu.link;
                            return <div key={i} className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                                <i className={menu.icon}></i>
                                {!collapsed && <Link to={menu.link}>{menu.name}</Link>}
                            </div>
                        })
                        }
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        {collapsed ?
                            <i className='ri-menu-2-fill header-action-icon' onClick={() => setCollapsed(false)}></i> :
                            <i className='ri-close-fill header-action-icon' onClick={() => setCollapsed(true)}></i>}
                        <div className='d-flex align-items-center px-4'>
                            <i className='ri-notification-line header-action-icon mx-3'></i>
                            <Link className='anchor' to='/profile'>{user?.name}</Link>
                        </div>
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
