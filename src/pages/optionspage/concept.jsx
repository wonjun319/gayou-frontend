import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const Concept = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedConcepts, setSelectedConcepts] = useState([]);

  const { region, neighborhoods, age, gender, travelDate, isLocal } = location.state || {};

  const concepts = [
    '빵지순례',
    '지역 축제',
    '예술/공연',
    '자연',
    '스포츠',
    '로컬맛집',
    '동네 탐험',
    '감성 카페',
    '쇼핑',
    '아이/반려동물',
  ];

  const handleConceptClick = concept => {
    setSelectedConcepts(prev => {
      if (prev.includes(concept)) {
        return prev.filter(item => item !== concept);
      } else if (prev.length < 3) {
        return [...prev, concept];
      } else {
        return [concept];
      }
    });
  };

  const handleNextClick = () => {
    navigate('/routeCreator', { state: { region, neighborhoods, age, gender, travelDate, isLocal, selectedConcepts } });
  };

  const handleBeforeClick = () => {
    navigate(-1);
  };

  return (
    <div className="options h-100 d-flex flex-column justify-content-start">
      <Container>
        <Row className="mb-5 mt-5">
          <Col className="d-flex flex-column justify-content-start">
            <h1 style={{ fontSize: '90px' }}>
              마지막이에유.
              <br />
              원하는 컨셉을 골라보세유.
            </h1>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-end">
            <div className="d-flex flex-wrap justify-content-center">
              {concepts.map(concept => (
                <Button
                  key={concept}
                  onClick={() => handleConceptClick(concept)}
                  className={`m-3 btn-lg`}
                  style={{
                    border: '1px solid black',
                    borderRadius: '40px',
                    padding: '10px',
                    minWidth: '200px',
                    backgroundColor: selectedConcepts.includes(concept) ? '#FF7828' : '#FFF',
                    color: '#000',
                  }}
                >
                  {concept}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
        <Button
          className="fw-bold btn-lg m-5"
          style={{
            position: 'fixed',
            left: '20px',
            bottom: '90px',
            backgroundColor: '#FF7828',
            borderRadius: '30px',
            border: '1px solid black',
            padding: '10px 40px',
          }}
          onClick={handleBeforeClick}
        >
          이전
        </Button>
        <Button
          className="fw-bold btn-lg m-5"
          style={{
            position: 'fixed',
            right: '20px',
            bottom: '90px',
            backgroundColor: '#FF7828',
            borderRadius: '30px',
            border: '1px solid black',
            padding: '10px 40px',
          }}
          disabled={selectedConcepts.length > 3 || selectedConcepts.length < 1}
          onClick={handleNextClick}
        >
          다음
        </Button>
      </Container>
    </div>
  );
};

export default Concept;
