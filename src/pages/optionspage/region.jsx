import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Button, Col, Container, FormControl, InputGroup, ListGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// 초성, 중성, 종성 분리 함수
const decomposeHangul = text => {
  const CHOSUNG_START = 44032;
  const CHOSUNG_LIST = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];
  const JUNGSUNG_LIST = [
    'ㅏ',
    'ㅐ',
    'ㅑ',
    'ㅒ',
    'ㅓ',
    'ㅔ',
    'ㅕ',
    'ㅖ',
    'ㅗ',
    'ㅘ',
    'ㅙ',
    'ㅚ',
    'ㅛ',
    'ㅜ',
    'ㅝ',
    'ㅞ',
    'ㅟ',
    'ㅠ',
    'ㅡ',
    'ㅢ',
    'ㅣ',
  ];
  const JONGSUNG_LIST = [
    '',
    'ㄱ',
    'ㄲ',
    'ㄳ',
    'ㄴ',
    'ㄵ',
    'ㄶ',
    'ㄷ',
    'ㄹ',
    'ㄺ',
    'ㄻ',
    'ㄼ',
    'ㄽ',
    'ㄾ',
    'ㄿ',
    'ㅀ',
    'ㅁ',
    'ㅂ',
    'ㅄ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];

  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= CHOSUNG_START && code <= CHOSUNG_START + 11172) {
        const base = code - CHOSUNG_START;
        const chosung = CHOSUNG_LIST[Math.floor(base / 588)];
        const jungsung = JUNGSUNG_LIST[Math.floor((base % 588) / 28)];
        const jongsung = JONGSUNG_LIST[base % 28];
        return chosung + jungsung + jongsung;
      }
      return char;
    })
    .join('');
};

const Region = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [totalNeighborhoods, setTotalNeighborhoods] = useState([]);
  const navigate = useNavigate();
  const regions = ['유성구', '대덕구', '동구', '서구', '중구'];

  useEffect(() => {
    axios
      .get(`api/springboot/locations/city?city=대전광역시`)
      .then(response => {
        setTotalNeighborhoods(response.data);
      })
      .catch(error => {});
  }, []);

  const handleRegionClick = region => {
    setSelectedRegion(region);
    setSelectedNeighborhoods(['전체']);
    setSearchInput('');
    setFilteredNeighborhoods([]);
    setShowSuggestions(false);

    if (region) {
      axios
        .get(`api/springboot/locations/district?city=대전광역시&district=${region}`)
        .then(response => {
          setNeighborhoods(response.data);
        })
        .catch(error => {
          setNeighborhoods([]);
        });
    } else {
      setNeighborhoods([]);
    }
  };

  const handleNeighborhoodClick = neighborhood => {
    if (neighborhood === '전체') {
      setSelectedNeighborhoods(['전체']);
    } else {
      setSelectedNeighborhoods(prevSelected =>
        prevSelected.includes(neighborhood)
          ? prevSelected.filter(item => item !== neighborhood)
          : [...prevSelected, neighborhood]
      );
      if (selectedNeighborhoods.includes('전체')) {
        setSelectedNeighborhoods([neighborhood]);
      }
    }
  };

  const compareHangul = (input, text) => {
    const decomposedInput = decomposeHangul(input);
    const decomposedText = decomposeHangul(text);

    return decomposedInput.split('').every((char, index) => {
      return decomposedText[index] && decomposedText[index] === char;
    });
  };

  const handleSearchInputChange = e => {
    const input = e.target.value;
    setSearchInput(input);

    if (input.trim() === '') {
      setFilteredNeighborhoods([]);
      setShowSuggestions(false);
    } else {
      const filtered = totalNeighborhoods.filter(totalNeighborhood => compareHangul(input, totalNeighborhood));

      setFilteredNeighborhoods(filtered);
      setShowSuggestions(true);
    }
  };

  const searchInputClear = () => {
    setSelectedRegion('');
    setSelectedNeighborhoods([]);
    setSearchInput('');
    setFilteredNeighborhoods([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = suggestion => {
    setSearchInput(suggestion);
    setSelectedRegion(null);
    setSelectedNeighborhoods([suggestion]);
    setShowSuggestions(false);
  };

  const handleNextClick = () => {
    navigate('/extra', { state: { region: selectedRegion, neighborhoods: selectedNeighborhoods } });
  };

  const handleBeforeClick = () => {
    navigate(-1);
  };

  return (
    <div className="options h-100 d-flex flex-column justify-content-start">
      <Container>
        <Row className="mb-5">
          <Col md={5} className="d-flex flex-column justify-content-start mt-5">
            <h1 style={{ fontSize: '90px' }}>어디가세유?</h1>
          </Col>
          <Col md={7} className="d-flex flex-column align-items-left mt-5">
            <div className="d-flex align-items-center mb-3" style={{ maxWidth: '700px' }}>
              <InputGroup className="m-2 position-relative">
                {' '}
                {/* flex-grow-1 */}
                <FormControl
                  className="form-control-lg"
                  placeholder="원하는 동네가 있으면 입력해주세요"
                  aria-label="Search"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onClick={() => searchInputClear(null)}
                  style={{
                    padding: '10px',
                  }}
                />
                {showSuggestions && filteredNeighborhoods.length > 0 && (
                  <ListGroup
                    className="position-absolute start-0 w-100"
                    style={{ zIndex: 1000, top: 'calc(100% + 5px)' }}
                  >
                    {filteredNeighborhoods.map((suggestion, index) => (
                      <ListGroup.Item
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{ cursor: 'pointer' }}
                      >
                        {suggestion}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </InputGroup>
              <Button
                className="ms-2 btn-lg btn-secondary fw-bold"
                style={{
                  border: '1px solid black',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  minWidth: '220px',
                  backgroundColor: selectedRegion === null ? '#FF7828' : '#F7527a',
                }}
                onClick={() => handleRegionClick(null)}
                disabled={searchInput.trim() !== ''}
              >
                아직 정하지 못했어요
              </Button>
            </div>
            <div className="d-flex flex-wrap justify-content-left">
              {regions.map(region => (
                <Button
                  key={region}
                  onClick={() => handleRegionClick(region)}
                  className={`m-2 btn-lg fw-bold`}
                  style={{
                    border: '1px solid black',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    minWidth: '125px',
                    backgroundColor: selectedRegion === region ? '#FF7828' : '#FFCAB2',
                    color: selectedRegion === region ? '#000' : '#fff',
                  }}
                  disabled={searchInput.trim() !== ''}
                >
                  {region}
                </Button>
              ))}
            </div>

            {selectedRegion && (
              <div className="d-flex flex-wrap justify-content-left mt-4">
                {neighborhoods.map(neighborhood => (
                  <Button
                    key={neighborhood}
                    onClick={() => handleNeighborhoodClick(neighborhood)}
                    className={`m-2 btn-lg fw-bold`}
                    style={{
                      border: '1px solid black',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      minWidth: '125px',
                      backgroundColor: selectedNeighborhoods.includes(neighborhood) ? '#FF7828' : '#FFCAB2',
                      color: selectedNeighborhoods.includes(neighborhood) ? '#000' : '#fff',
                    }}
                  >
                    {neighborhood}
                  </Button>
                ))}
              </div>
            )}
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
          disabled={selectedNeighborhoods.length === 0}
          onClick={handleNextClick}
        >
          다음
        </Button>
      </Container>
    </div>
  );
};

export default Region;
