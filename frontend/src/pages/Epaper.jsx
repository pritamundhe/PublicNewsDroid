import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Epaper = () => {
    return (
        <div>
            <Navbar />
            <div className=''>
                <embed
                    src="/paper.pdf.pdf"
                    width="100%"
                    height="800px"
                    title="test"
                />

            </div>
            <Footer />
        </div>
    );
};

export default Epaper;
