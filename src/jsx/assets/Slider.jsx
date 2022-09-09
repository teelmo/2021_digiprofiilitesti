// https://material-ui.com/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './../../styles/styles.less';

let categories;

// https://material-ui.com/components/tooltips/
// https://material-ui.com/api/slider/

let StyledSlider;
let StyledTooltip;
class CustomSlider extends Component {
  constructor(props) {
    super(props);

    categories = props.categories;
    this.state = {
      value:this.props.defaultValue
    }
    this.onChange = this.onChange.bind(this);

    StyledSlider = withStyles((theme) => ({
      root:{
        color:'#8a17c7',
        height:8,
      },
      thumb:{
        backgroundColor:'#8a17c7',
        border:0,
        height:31,
        marginLeft:-15,
        marginTop:-12,
        width:31,
        animation: (this.props.disabled == false) ? styles.pulse + ' 1.5s infinite' : 'none',
        '&:focus, &:hover, &$active':{
          animation: 'none',
          boxShadow:'inherit',
        },
        '&$disabled': {
          backgroundColor:'#8a17c7',
          border:0,
          height:31,
          marginLeft:-15,
          marginTop:-12,
          width:31
        }
      },
      disabled:{},
      active:{},
      track:{
        backgroundColor:'transparent',
        borderRadius:4,
        height:8,
        '&$disabled': {
          backgroundColor:'transparent',
          borderRadius:4,
          height:8
        }
      },
      rail:{
        backgroundColor:'rgba(255, 255, 255, 0.5)',
        borderRadius:4,
        height:8,
        opacity:10,
        '&$disabled': {
          backgroundColor:'rgba(255, 255, 255, 0.5)',
          borderRadius:4,
          height:8,
          opacity:10
        }
      },
      mark:{
        backgroundColor:'#fff',
        borderRadius:4,
        height:8,
        marginLeft:-4,
        marginTop:0,
        width:8,
        '&$disabled': {
          backgroundColor:'#fff',
          borderRadius:4,
          height:8,
          marginLeft:-4,
          marginTop:0,
          width:8
        }
      },
      markActive:{
        backgroundColor:'#fff',
        borderRadius:4,
        height:8,
        marginLeft:-4,
        marginTop:0,
        width:8,
        display:'inline-block',
        '&$disabled': {
          backgroundColor:'#fff',
          borderRadius:4,
          height:8,
          marginLeft:-4,
          marginTop:0,
          opacity:10,
          width:8
        }
      },
      markLabel:{
        backgroundColor:'#fff',
        borderRadius:'15px',
        boxShadow:'none',
        color:'#350951',
        fontSize:13,
        fontWeight:600,
        marginTop:'15px',
        padding:'5px',
        textAlign:'center',
        position:'absolute',
        zIndex:3,
        whiteSpace:'pre-wrap',
        '&:before': {
          background:'rgba(255,255,255,1)',
          borderRadius:'50%',
          content:'\'\'',
          height:'23px',
          marginLeft:'7px',
          marginTop:'-41px',
          position:'absolute',
          width:'24px'
        },
        '&:after': {
          left:'50%',
          marginLeft:'-2px',
          bottom:'40px',
          content:'\'\'',
          background:'#fff',
          position:'absolute',
          height:'20px',
          width:'4px'
        }
      }
    }))(Slider);

    // https://material-ui.com/components/slider/
    StyledTooltip = withStyles((theme) => ({
      tooltip:{
        backgroundColor:'#8a17c7',
        borderRadius:'15px',
        boxShadow:'none',
        color:'#fff',
        fontSize:13,
        fontWeight:600,
        margin: '14px 0 !important',
        position:'relative',
        textAlign:'center',
        top:'2px',
        transition:'all 0s ease 0s !important',
        whiteSpace:'pre-wrap',
        '&:after': {
          background:'#8a17c7',
          bottom:'-12px',
          content:'\'\'',
          height:'12px',
          left:'50%',
          marginLeft:'-2px',
          position:'absolute',
          width:'4px'
        }
      },
    }))(Tooltip);
  }
  ValueLabelComponent(props) {
      const {children, open, value} = props;
      return (
        <div>
          <StyledTooltip style={{backgroundColor:'#8a17c7'}} open={open} enterTouchDelay={0} placement="top" title={(props.disabled === true) ? 'oma arvio:\n' + categories[value].toUpperCase() : categories[value].toUpperCase()}>
            {children}
          </StyledTooltip>
        </div>
      );
    }
  onChange(event, newValue) {
    if (this.state.value !== newValue) {
      this.setState((state, props) => ({
        value:newValue
      }));
      this.props.handleSliderChange(newValue)
    }
  }
  render() {
    this.ValueLabelComponent.propTypes = {
      children:PropTypes.element.isRequired,
      open:PropTypes.bool.isRequired,
      value:PropTypes.number.isRequired,
    };
    return (
      <div>
        <StyledSlider
          defaultValue={this.props.defaultValue}
          // valueLabelFormat={valueLabelFormat}
          ValueLabelComponent={this.ValueLabelComponent}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="on"
          step={1}
          disabled={this.props.disabled}
          marks={this.props.marks}
          min={0}
          max={8}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default CustomSlider;