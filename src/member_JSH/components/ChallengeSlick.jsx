import React, { Component } from "react";
import Slider from "react-slick";
import '../css/slick.css'
import "slick-carousel/slick/slick-theme.css";


function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "black", height : "20px",
      width : "20px", right:"10px"}}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        tyle={{ ...style, display: "block", background: "black", height : "20px",
      width:"20px", zIndex:"9", left:"10px" }}
        onClick={onClick}
      />
    );
  }
  
  export default class ChallengeSlick extends Component {
    render() {
      const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows : true,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 5000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        width : "500px"
      };
      return (
        <div>
        <h2>도전 챌린지</h2>
        <Slider {...settings}>
            <div>
              <h3>1</h3>
            </div>
            <div>
              <h3>2</h3>
            </div>
            <div>
              <h3>3</h3>
            </div>
            <div>
              <h3>4</h3>
            </div>
            <div>
              <h3>5</h3>
            </div>
            <div>
              <h3>6</h3>
            </div>
          </Slider>
        </div>
      );
    }
  }
