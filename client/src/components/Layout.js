import React, {useState} from 'react';
import '../layout.css';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {Badge} from "antd";

function Layout({children}) {
    const [collapsed, setCollapsed] = useState(false);
    const {user} = useSelector(state => state.user);
    const navigate = useNavigate();
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
        }
    ];
    const adminMenu = [
        {
            name: 'Home',
            link: '/',
            icon: 'ri-home-line'
        },
        {
            name: 'Users',
            link: '/admin/users-list',
            icon: 'ri-user-line'
        },
        {
            name: 'Doctors',
            link: '/admin/doctors-list',
            icon: 'ri-user-star-line'
        },
        {
            name: 'Profile',
            link: '/profile',
            icon: 'ri-user-line'
        }
    ];
    const doctorMenu = [
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
            name: 'Profile',
            link: `/doctor/profile/${user?._id}`,
            icon: 'ri-user-line'
        }
    ];
    const menuToBeRendered = user?.isAdmin ?
        adminMenu : user?.isDoctor ?
            doctorMenu : userMenu;
    return (
        <div className='main'>
            <div className='d-flex layout'>
                <div className={`${collapsed ? 'collapsed-sidebar' : 'sidebar'}`}>
                    <div className='sidebar-header'>
                        <h1 className='logo'> DBA </h1>
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
                        <div className='d-flex menu-item' onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }
                        }>
                            <i className='ri-login-box-line'></i>
                            {!collapsed && <Link to='/logout'>Logout</Link>}
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        {collapsed ?
                            <i className='ri-menu-2-fill header-action-icon' onClick={() => setCollapsed(false)}></i> :
                            <i className='ri-close-fill header-action-icon' onClick={() => setCollapsed(true)}></i>}
                        <div className='d-flex align-items-center px-4'>
                            <Badge count={user?.unseenNotifications.length} onClick={() => navigate('/notifications')}>
                                <i className='ri-notification-line header-action-icon ml-3 mr-1'></i>
                            </Badge>
                            <Link className='anchor mx-3' to='/profile'>{user?.name}</Link>
                        </div>
                    </div>
                    <div className='body'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
