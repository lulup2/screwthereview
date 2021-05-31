/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MapImage from './Map.png';
import server from './server';

class Result extends Component {
  constructor(props) {
    super(props);
    // this.getDirections = this.getDirections.bind(this);
    this.state = {
      name: null,
      description: null,
      phone: null,
      website: null,
      address: null,
      tags: null,
      price: null,
      hours: null,
    };
  }

  componentDidMount() {
    // console.log(this.props.location);
    fetch(server.getServerUrl(), {
      headers: {
        location: this.props.location,
        category: this.props.category,
      },
    })
      .then((response) => response.text())
      .then((json) => {
        console.log(json);
        this.parseResult(json);
      });
  }

  getDirections() {
    fetch('https://www.google.com/maps/dir/?api=1', {
      headers: {
        origin: this.props.searchValue,
        category: this.props.category,
      },
    })
      .then((response) => response.text())
      .then((json) => {
        this.parseResult(json);
      });
    const { parentCallbackResult } = this.props;
    parentCallbackResult(this.state.name);
  }

    parseResult = (json) => {
      const result = JSON.parse(json);
      // console.log(result);
      // decompose categories
      const rCategories = result.categories;
      let sCategories = '';
      if (rCategories.length > 0) {
        sCategories = rCategories[0].title;
      }
      for (let i = 1; i < rCategories.length; i += 1) {
        sCategories += `, ${rCategories[i].title}`;
      }
      const sHours = this.parseHours(result.hours);
      this.setState({
        name: result.name,
        imageURL: result.image_url,
        phone: result.display_phone,
        website: result.url,
        address: result.location.display_address.join(' '),
        tags: sCategories,
        price: result.price,
        hours: sHours,
        description: result.description,
      });
    }

    convertHours = (hour) => {
      let result = '';
      const iHour = parseInt(hour, 10);
      let timeOfDay = ' am';

      let hours = (iHour / 100);
      // check time of day
      if (hours === 0) {
        hours = 12;
      }
      if (hours > 12) {
        timeOfDay = ' pm';
        hours -= 12;
        // add zero for single digit
        if (hours < 10) {
          result = '0';
        }
      }
      result += hours.toString();
      result += ':';
      const minutes = (iHour % 100);
      // add zero for single digit
      if (minutes < 10) {
        result += '0';
      }
      result += minutes.toString();
      result += timeOfDay;
      return result;
    }

    parseHours = (hours) => {
      let result = '';
      const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'];
      let day;
      let dayStart;
      let dayEnd;
      const hoursOpen = hours[0].open;
      for (let i = 0; i < hoursOpen.length; i += 1) {
        day = hoursOpen[i];
        result += dayMap[day.day];
        result += ': ';
        dayStart = this.convertHours(day.start);
        result += dayStart;
        result += ' - ';
        dayEnd = this.convertHours(day.end);
        result += dayEnd;
        result += '\n';
      }
      return result;
    }

    render() {
      return (
        <Container fluid className="page-container" style={{ paddingBottom: '36px' }}>
          <Row>
            <div className="col font-large" data-testid="result-name">{this.state.name}</div>
          </Row>
          <Row>
            <Col sm={5}>
              <Row>
                <img alt="result" className="img-fluid" src={this.state.imageURL} style={{ width: '100%' }} />
              </Row>
              <Row>
                <table id="result-info-table" data-testid="result-info-table">
                  <tbody>
                    <tr data-testid="info-item">
                      <td>Phone: </td>
                      <td>{this.state.phone}</td>
                    </tr>
                    <tr data-testid="info-item">
                      <td>
                        <a id="link" href={this.state.website}>Website</a>
                      </td>
                      <td />
                    </tr>
                    <tr data-testid="info-item">
                      <td>Tags: </td>
                      <td>{this.state.tags}</td>
                    </tr>
                    <tr data-testid="info-item">
                      <td>Price: </td>
                      <td>{this.state.price}</td>
                    </tr>
                  </tbody>
                </table>
              </Row>
            </Col>
            <Col sm={{ span: 6, offset: 1 }}>
              <div className="font-medium">About</div>
              <div>{this.state.description}</div>
              <Row>
                <Col sm={7}>
                  <img alt="map" src={MapImage} className="img-responsive fit-image col-12" />
                </Col>
                <Col sm={5}>
                  <div className="font-medium">Hours</div>
                  <div className="hours">{this.state.hours}</div>
                </Col>
              </Row>
              <Row>
                <Col sm={7}>
                  <div className="font-medium">Location</div>
                  <div>{ this.state.address }</div>
                </Col>
                <Col sm={5}>
                  {/* <button type="button" className="font-medium"
                       onClick={this.getDirections}>Get Directions</button> */}
                  <button type="button" className="font-medium">Get Directions</button>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* <Row>
                    <Button className="str-button" href="/roulette">Spin Again!</Button>
                </Row> */}
        </Container>
      );
    }
}

export default Result;
