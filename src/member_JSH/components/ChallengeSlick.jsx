import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

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
      style={{ ...style, display: "block", background: "black", height : "20px",
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
        autoplay: false,
        speed: 2000,
        autoplaySpeed: 5000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
      };
      return (
        <div>
          <Link to='/challenge/challengeID/view'>챌린지1(useParams 설정)</Link>
        <h2>도전 챌린지</h2>
        <Slider {...settings}>
            <div>
              <Link to='/challenge/challengeID/view'>
                <Card
                    style={{
                      backgroundColor : "gray",
                      width : "80%",
                      height: "200px",
                      backgroundSize : "cover",
                      backgroundPosition : "center",
                      padding : "10px"
                    }}
                  >
                    <Card.Body className="camp-slide-bar">
                    <Card.Title style={{padding : "20px", fontWeight : "bold", color : "white"}}>1</Card.Title>
                    <Card.Text style={{marginBottom : "0"}}>설명</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </div>
            <div>
              <Card
                  style={{
                    backgroundColor : "gray",
                    width : "80%",
                    height: "200px",
                    backgroundSize : "cover",
                    backgroundPosition : "center",
                    padding : "10px"
                  }}
                >
                  <Card.Body className="camp-slide-bar">
                  <Card.Title style={{padding : "20px", fontWeight : "bold", color : "white"}}>2</Card.Title>
                  <Card.Text style={{marginBottom : "0"}}>설명</Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div>
              <Card
                  style={{
                    backgroundColor : "gray",
                    width : "80%",
                    height: "200px",
                    backgroundSize : "cover",
                    backgroundPosition : "center",
                    padding : "10px"
                  }}
                >
                  <Card.Body className="camp-slide-bar">
                  <Card.Title style={{padding : "20px", fontWeight : "bold", color : "white"}}>3</Card.Title>
                  <Card.Text style={{marginBottom : "0"}}>설명</Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div>
              <Card
                  style={{
                    backgroundColor : "gray",
                    width : "80%",
                    height: "200px",
                    backgroundSize : "cover",
                    backgroundPosition : "center",
                    padding : "10px"
                  }}
                >
                  <Card.Body className="camp-slide-bar">
                  <Card.Title style={{padding : "20px", fontWeight : "bold", color : "white"}}>4</Card.Title>
                  <Card.Text style={{marginBottom : "0"}}>설명</Card.Text>
                </Card.Body>
              </Card>
            </div>
          </Slider>
        </div>
      );
    }
  }
