import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

// workaround as suggested in http://momentjs.com/docs/
require('moment/locale/de');

var Calendar = React.createClass({
    getInitialState() {
        return {
            month: this.props.selected.clone(),
            selected: ''
        }
    },
    previous() {
        var month = this.state.month;
        month.add(-1, 'M');
        this.setState({
            month: month
        });
    },
    next () {
        var month = this.state.month;
        month.add(1, 'M');
        this.setState({
            month: month
        });
    },
    select(day) {
        this.setState({
            selected: day.date
        });

        this.forceUpdate();
    },
    render() {
        return (<div id="calendar">
            <div className="app-title">TEAM-O</div>
            <div className="header clearfix">
                <button className="btn btn-prev" onClick={this.previous}><i className="fa fa-angle-left"></i></button>
                {this.renderMonthLabel()}
                <button className="btn btn-next" onClick={this.next}><i className="fa fa-angle-right"></i></button>
            </div>
            <DayNames />
            {this.renderWeeks()}
            <div className="selected-day">{(typeof this.state.selected === 'object' ? this.state.selected.format('dddd DD.MM.YYYY').toString() : '')}</div>
        </div>);
    },
    renderWeeks() {
        var weeks = [],
            done = false,
            // set date to first day of the month
            date = this.state.month.clone().startOf('month').day('montag'),
            monthIndex = date.month(),
            count = 0;


        while(!done) {
            weeks.push(<Week key={date.toString()} date={date.clone()} month={this.state.month} select={this.select} selected={this.state.selected} />);
            date.add(1, 'w');
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
        return weeks;
    },
    renderMonthLabel() {
        return <span>{this.state.month.format('MMMM, YYYY')}</span>;
    }
});

var Week = React.createClass({
    render() {
        var days = [],
            date = this.props.date,
            month = this.props.month,
            day;

        for(var i = 0; i < 7; i++) {
            day = {
                name: date.clone().format('dd').substr(0,1),
                number: date.clone().date(),
                date: date,
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), 'day')
            };

            days.push(<span className={'day' + (day.isCurrentMonth ? '' : ' different-month') + (day.isToday ? ' today' : '') + (day.date.isSame(this.props.selected) ? ' selected' : '')} key={day.date.toString()} onClick={this.props.select.bind(null, day)}>{day.number}</span>);
            date = date.clone();
            date.add(1, 'd');
        }
        return <div className="week clearfix" key={days[0].toString()}>
            {days}
        </div>;
    }
});

var DayNames = React.createClass({
    render() {
        return <div className="week names clearfix">
            <span className="day">Mo</span>
            <span className="day">Di</span>
            <span className="day">Mi</span>
            <span className="day">Do</span>
            <span className="day">Fr</span>
            <span className="day">Sa</span>
            <span className="day">So</span>
        </div>;
    }
});

ReactDOM.render(<Calendar selected={moment().startOf('day')} /> , document.getElementById('root'));