import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

// workaround as suggested in http://momentjs.com/docs/
require('moment/locale/de');

var App = React.createClass({
    getInitialState() {
        return {
            view: 'Calendar',
            startMonth: moment().startOf('day'),
            selected: ''
        };
    },
    clickButton(link) {
        if(this.state.selected === '') {
            return false;
        }
        this.setState({
            view: link
        });
    },
    select(day) {
        this.setState({
            selected: day.date
        });

        this.forceUpdate();
    },
    render() {
        var view;

        switch(this.state.view) {
            case 'Chat':
                view = <ChatView clickButton={this.clickButton} selected={this.state.selected} />;
                break;
            default:
                view = <CalendarView startMonth={this.state.startMonth} selected={this.state.selected} select={this.select} clickButton={this.clickButton} />
        }

        return (
            <div className="app-wrapper">
                <div className="app-title">TEAM-O</div>
                {view}
            </div>
        );
    }
});

var ChatView = React.createClass({
   render(){
       return (<div className="chat-view">
           <Chat clickButton={this.props.clickButton} selected={this.props.selected} />
       </div>);
   }
});

var CalendarView = React.createClass({
    clickButton() {
        console.log('attend')
    },
   render(){
       return (<div className="calendar-view">
           <Calendar startMonth={this.props.startMonth} selected={this.props.selected} select={this.props.select} />
           <Button label="Attend event" view="" clickButton={this.clickButton} />
           <Attendees />
           <Button label="Chat" view="Chat" clickButton={this.props.clickButton} />
       </div>);
   }
});

var Calendar = React.createClass({
    getInitialState() {
        return {
            month: this.props.startMonth.clone()
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
    render() {
        return (<div id="calendar">
            <div className="header clearfix">
                <button className="btn btn-prev" onClick={this.previous}><i className="fa fa-angle-left"></i></button>
                {this.renderMonthLabel()}
                <button className="btn btn-next" onClick={this.next}><i className="fa fa-angle-right"></i></button>
            </div>
            <DayNames />
            {this.renderWeeks()}
            <div className="selected-day">{(typeof this.props.selected === 'object' ? this.props.selected.format('dddd DD.MM.YYYY').toString() : '')}</div>
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
            weeks.push(<Week key={date.toString()} date={date.clone()} month={this.state.month} select={this.props.select} selected={this.props.selected} />);
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

var Attendees = React.createClass({
    render() {
        var attendees = [];
        var attendeeData = [{id: 1, name: 'Felix', time: '18:00'}, {id: 2, name: 'Phil', time: '18:00'}, {id: 3, name: 'Domi', time: '18:30'}];

        return (<div className="attendees">
            {attendeeData.map((item, i) =>
                <div className="attendee" key={i}>{item.name}<span className="time">{item.time}</span></div>
            )}
        </div>);
    }
});

var Chat = React.createClass({
    renderDateLabel() {
        // return <span>date</span>;
        return <span>{this.props.selected.format('dddd DD.MM.YYYY')}</span>;
    },
    render() {
        return (<div className="chat">
            <div className="header clearfix">
                <button className="btn btn-prev" onClick={this.props.clickButton.bind(null, 'Calendar')}><i className="fa fa-angle-left"></i></button>
                {this.renderDateLabel()}
            </div>
            <div className="comments">
                <div className="comment">
                    <span className="name">Domi:</span>
                    <p>Hey wann gehts heut los ?</p>
                </div>
                <div className="comment">
                    <span className="name">Felix:</span>
                    <p>So bald wie's geht, ich bin heiß!</p>
                </div>
                <div className="comment">
                    <span className="name">Phil:</span>
                    <p>Passt ich hab den Kleinen im Rucksack!</p>
                </div>

            </div>
            <Button label="back to calendar" view="Calendar" clickButton={this.props.clickButton}/>
        </div>);
    }
});


var Button = React.createClass({
    render(){
        return (
            <button className="btn" onClick={this.props.clickButton.bind(null, this.props.view)}>{this.props.label}</button>
        );
    }
});

ReactDOM.render(<App /> , document.getElementById('root'));