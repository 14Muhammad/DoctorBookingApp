import React from 'react';
import '../layout.css';

function Layout({children}) {
    return (
        <div className='main'>
            <div className='d-flex layout'>
                <div className='sidebar'>
                    sidebar
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
