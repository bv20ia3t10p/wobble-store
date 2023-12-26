// Slideshow.js
import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './stylesheets/slideshow.css'; // Adjust the path based on your project structure

const Slideshow = ({ images }) => {
    return (
        <div className="slide-container">
            <Slide>
                {images.map((image, index) => (
                    <div className="each-slide-effect" key={index}>
                        <div style={{ 'backgroundImage': `url(${image})` }}>
                            <span>{`Slide ${index + 1}`}</span>
                        </div>
                    </div>
                ))}
            </Slide>
        </div>
    );
};

export default Slideshow;