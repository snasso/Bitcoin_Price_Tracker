import React, { Component } from 'react';
import axios from 'axios';
import {Button, Navbar, Col, Row, Input} from 'react-materialize';
import Moment from 'moment';
import './App.css';

/* C3 - react-c3js */
import C3Chart from 'react-c3js';
import 'c3/c3.css';


class App extends Component {
  constructor() {
    super();

    this.state = {
      startDate: "",
      endDate: "",
      investmentValue: "",
      data: {
        x: 'x',
        columns: [[]]
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          }
        }
      }
    };
  }
  
  getData = () => {
    let url = `http://localhost:8080/${this.state.startDate}/${this.state.endDate}`;

    axios.get(url)
      .then(response => {
        let data = Object.values(response.data);
        let keys = Object.keys(response.data);

        this.setState({
            data: {
              columns: [
                ['x', ...keys],
                ['BitCoin Price Index', ...data]
              ]
            },
            axis: {
              x: {
                categories: [...keys]
              }
            }
        }, () => this.moneyCalculator());
      });
  }

  componentDidMount() {
    this.numDaysAgo(7);
  }

  // User selected start date
  setStartDate = (e, value) => {
    let newValue = Moment(value).format('YYYY-MM-DD');

    this.compareDates(newValue, this.state.endDate);
  }

  // User selected end date
  setEndDate = (e, value) => {
    let newValue = Moment(value).format('YYYY-MM-DD');

    this.compareDates(this.state.startDate, newValue);
  }

  compareDates = (sDate, eDate) => {
    let startDate = sDate;
    let endDate   = eDate;

    var d1 = new Date(startDate);
    var d2 = new Date(endDate);

    if (d1 > d2) {
      alert("Please check dates. Start date is greater than End date.");
    } else {
      this.setState({
        startDate: startDate,
        endDate: endDate
      }, () => console.log(this.state));

      this.getData();
    }
  }

  dateSelect = (e) => {
    let value = e.target.value;

    switch(value) {
      case "2":
        this.numDaysAgo(30);
        break;
      case "3":
        this.numDaysAgo(365);
        break;
      default:
        this.numDaysAgo(7);
    }
  }

  numDaysAgo = (numDays) => {
    let date        = new Date();
    let todaysDate  = Moment(date).format('YYYY-MM-DD');
    
    date.setDate(date.getDate() - numDays);

    let sevenDaysAgo = Moment(date).format('YYYY-MM-DD');

    this.setState({
      startDate: sevenDaysAgo,
      endDate: todaysDate
    }, () => this.getData ());
  }

  moneyCalculator = () => {

    if (this.input.state.value !== undefined && this.input.state.value !== "") {
      let value = this.input.state.value;
      let data  = this.state.data.columns[1];

      let startValue  = data[1];
      let endValue    = data[data.length -1];

      value = (endValue / startValue * value).toFixed(2);

      this.setState({
        investmentValue: value
      });

    } else {
      this.setState({
        investmentValue: ""
      });
    }
  }

  render() {
    return (
      <div>
        <Navbar brand="Bitcoin Price Tracker" className={"navBar " + (window.innerWidth <= 992 ? "hidden" : "")}></Navbar>

        <div className="App">
          <h3>
          Bitcoin Price Index Chart
          </h3>
          <Row>
            <Col s={8} offset="s2">
              <C3Chart data={this.state.data} axis={this.state.axis}/>
              <Input s={12} type="select" label="Date Select" defaultValue="1" onChange={ e => this.dateSelect(e)}>
                <option value="1">Last Week</option>
                <option value="2">Last Month</option>
                <option value="3">Last Year</option>
              </Input>
              <Input s={6} type="date" label="Start Date" placeholder="Start Date" value={this.state.startDate} name="on" onChange={this.setStartDate} />
              <Input s={6} type="date" label="End Date" placeholder="End Date" value={this.state.endDate} name="on" onChange={this.setEndDate} />
            </Col>

            <Col s={4} offset="s2">
              <Input s={12} ref={(input) => { this.input = input }} type="text" label="Money Invested" placeholder="Money Invested"/>
            </Col>
            <Col s={4}>
              <div className={(this.state.investmentValue !== "") ? "" : "investmentHidden"}>
                Investment Value:
                <br/>
                ${this.state.investmentValue}
              </div>
            </Col>
            <Col s={8}>
              <Button s={6} onClick={this.moneyCalculator}>Calculate</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default App;
