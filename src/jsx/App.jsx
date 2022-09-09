import React, {Component} from 'react';
import style from './../styles/styles.less';

// https://d3js.org/
import * as d3 from 'd3';

// https://www.npmjs.com/package/react-tsparticles
// import Particles from 'react-tsparticles';
// https://github.com/Wufe/react-particles-js
// https://rpj.bembi.org/#images
// import Particles from 'react-particles-js';

let path_prefix,
    points_array = [],
    url = window.location.href;
if (location.href.match('localhost')) {
  path_prefix = './';
}
else {
  path_prefix = 'https://lusi-dataviz.ylestatic.fi/2021_digiprofiilitesti/';
}

// Import components.
import Radio from './assets/Radio.jsx';
import Checkbox from './assets/Checkbox.jsx';
import Compine from './assets/Compine.jsx';
import Order from './assets/Order.jsx';
import Slider from './assets/Slider.jsx';

import Markdown from 'markdown-to-jsx';

const randomArray = (length, min, max) => Array(length).fill().map(() => Math.floor(Math.random() * (max - min + 1) + min));

let imageAnimationDelay = [0, 3, 6],
    imageAnimationDuration = randomArray(3, 40, 60),
    dropAnimationDuration = randomArray(200, 20, 100),
    dropTop = randomArray(200, 0, 100),
    dropLeft = randomArray(200, -50, 100);

let dropSizes = dropAnimationDuration.map((duration) => {
    return Math.round((3 - 5) * ((duration - Math.min(...dropAnimationDuration)) / (Math.max(...dropAnimationDuration) - Math.min(...dropAnimationDuration))) + 5, 0);
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current_category:0,
      current_question:false,
      data:false,
      level:4,
      points:0,
      result:false,
      marks:[]
    }
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.appRef = React.createRef();
  }
  componentDidMount() {
    this.getData();
    if (document.getElementsByClassName('ydd-footer')[0]) {
      document.getElementsByClassName('ydd-footer')[0].style.position = 'relative';
      document.getElementsByClassName('ydd-footer')[0].style.zIndex = 3;
    }
    if (document.getElementsByClassName('max-w-cod')[0]) {
      document.getElementsByClassName('max-w-cod')[0].style.position = 'relative';
      document.getElementsByClassName('max-w-cod')[0].style.zIndex = 5;
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }
  componentWillUnMount() {

  }
  // shouldComponentUpdate(nextProps, nextState) {}
  // static getDerivedStateFromProps(props, state) {}
  // getSnapshotBeforeUpdate(prevProps, prevState) {}
  // static getDerivedStateFromError(error) {}
  // componentDidCatch() {}
  getData() {
    d3.json(path_prefix + 'data/data.json').then((data) => {
      data.questions = data.questions.map((question) => {
        if (question.type === 'compine' && question.shuffle === true) {
          question.choices[0] = this.shuffle(question.choices[0]);
          question.choices[1] = this.shuffle(question.choices[1]);
        }
        else if (question.type === 'order' && question.shuffle === true) {
          question.choices = this.shuffle(question.choices);
        }
        else if (question.shuffle === true) {
          question.choices = this.shuffle(question.choices);
        }
        return question;
      });

      data.categories = data.categories.map((category) => {
        category.particles = this.shuffle(category.particles)
        return category;
      });

      let images = [];
      let i = 0;
      data.categories.map((category) => {
        category.particles.map((particle) => {
          images[i] = new Image();
          images[i].src = particle.src;
          i++;
        });
      });
      let image = new Image();
      image.src = path_prefix + 'img/8_5_hymy_valko_250px.png';

      this.setState((state, props) => ({
        data:data
      }), () => this.handleSliderChange(this.state.level));
    });
  }
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  printParticles(category) {
    let rows = [];
    category.particles.map((particle, i) => {
      rows.push(<li className={style.image} key={i} style={{animationDelay: imageAnimationDelay[i] + 's', animationDuration: imageAnimationDuration[i] + 's', top: ((i + 1) * 30) + '%', left:'-130px'}}><img src={particle.src} style={{height: (particle.height * 0.6) + 'px', width: (particle.width * 0.6) + 'px'}} /></li>);
    });
    for (var i = 0; i <= 200; i++) {
      rows.push(<li className={style.drop} key={i + 3} style={{animationDelay: '0s', animationDuration: dropAnimationDuration[i] + 's', top: dropTop[i] + '%', left: dropLeft[i] + '%', width: dropSizes[i], height: dropSizes[i]}}></li>);
    }
    return (<ul className={style.particles}>{rows}</ul>);
  }
  printQuestions() {
    let elements = [],
        category_elements = [];
    for (let i = 0; i < this.state.data.questions.length; i++) {
      let question = this.state.data.questions[i];
      switch (question.type) {
        case 'radio':
          category_elements.push(<Radio key={i} disabled={(i > this.state.current_question) ? true : false} question={question} category={this.state.data.categories[question.category_id]} handleQuestionChange={this.handleQuestionChange} />);
          break;
        case 'checkbox':
          category_elements.push(<Checkbox key={i} disabled={(i > this.state.current_question) ? true : false} question={question} category={this.state.data.categories[question.category_id]} handleQuestionChange={this.handleQuestionChange} />);
          break;
        case 'compine':
          category_elements.push(<Compine key={i} disabled={(i > this.state.current_question) ? true : false} question={question} category={this.state.data.categories[question.category_id]} handleQuestionChange={this.handleQuestionChange} />);
          break;
        case 'order':
          category_elements.push(<Order key={i} disabled={(i > this.state.current_question) ? true : false} question={question} category={this.state.data.categories[question.category_id]} handleQuestionChange={this.handleQuestionChange} />);
          break;
        default:
          return false;
      }
      if (question.category_last_question === true) {
        elements.push(<div key={i} className={style.category_container} data-category-id={'category_' + question.category_id} style={(this.state.data) ? {color: this.state.data.categories[question.category_id].css.color} : {}}><div className={style.background_container} style={(this.state.data) ? {backgroundImage: this.state.data.categories[question.category_id].css.backgroundImage} : {}}></div>{category_elements}</div>);
        category_elements = [];
      }
    }
    return elements;
  }
  handleQuestionChange(i, points) {
    points_array.push(points);
    if (i === -1) {
      this.appRef.current.scrollIntoView();
    }
    // Check if ready.
    if (i === 'end') {
      this.setState((state, props) => ({
        current_category:5,
        current_question:true
      }), () => this.calculateResult());
      
    }
    else if (i === (this.state.data.questions.length - 1)) {
      this.setState((state, props) => ({
        points:state.points + points
      }));
    }
    else {
      this.setState((state, props) => ({
        current_category:this.state.data.questions[i + 1].category_id,
        current_question:i + 1,
        points:state.points + points
      }));
    }
  }
  handleSliderChange(value) {
    this.setState((state, props) => ({
      level:value
    }));
  }
  calculateResult() {
    let value,
        marks = [{value:0,label:null},{value:1,label:null},{value:2,label:null},{value:3,label:null},{value:4,label:null},{value:5,label:null},{value:6,label:null},{value:7,label:null},{value:8,label:null}];
    this.state.data.results.forEach((result, i) => {
      if (this.state.points >= result.min && this.state.points <= result.max) {
        value = i;
      }
    });
    marks[value] = {value:value, label: 'tulos:\n' + this.state.data.results[value].title.toUpperCase()};
    document.getElementsByClassName('evaluation_input')[0].value = this.state.level;
    document.getElementsByClassName('points_input')[0].value = points_array.join(',');
    document.getElementsByClassName('result_input')[0].value = value;
    if (!window.yleVisualisation && !location.href.match('localhost')) {
      document.getElementById('plus_form').submit();
    }
    this.setState((state, props) => ({
      marks:marks,
      result:value,
      result_text:(Math.abs(this.state.level - value) > 1) ? this.state.data.results[value].text : this.state.data.results[value].text2,
      result_subtitle:(Math.abs(this.state.level - value) > 1) ? this.state.data.results[value].subtitle : this.state.data.results[value].subtitle2,
    }), () => this.appRef.current.scrollIntoView());
  }
  shareButtonClick(event) {
    const specs = 'top=' + ((screen.height / 2) - (420 / 2)) + ',left=' + ((screen.width / 2) - (550 / 2)) + ',toolbar=0,status=0,width=550,height=420';
    window.open(event.currentTarget.href, 'Jaa', specs);
    event.preventDefault();
  }
  render() {
    return (
      <div className={style.app} ref={this.appRef}>
        <div className={style.total_points_container}>{this.state.points}</div>
        <div className={style.particles_container}>
          {this.state.data && this.printParticles(this.state.data.categories[this.state.current_category])}
        </div>
        {(parseInt(this.state.current_question) >= 0) && <div className={style.container}>{this.printQuestions()}</div>}
        {
          (this.state.current_question === false && this.state.data) && 
            <div className={style.container}>
              <div className={style.category_container + ' ' + style.single} style={(this.state.data) ? {color: this.state.data.categories[this.state.current_category].css.color} : {}}>
                <div className={style.background_container} style={(this.state.data) ? {backgroundImage: this.state.data.categories[this.state.current_category].css.backgroundImage} : {}}></div>
                <div className={style.content_wrapper}>
                  <h1>Tervetuloa!<br />Selvitä oma digitaitotasosi</h1>
                  <div className={style.content_container} style={(CSS.supports('backdrop-filter', 'blur(10px)') === true || CSS.supports('-webkit-backdrop-filter', 'blur(10px)') === true) ? {backgroundColor: this.state.data.categories[this.state.current_category].css.content_background_color, border:this.state.data.categories[this.state.current_category].css.content_border} : {backgroundColor: this.state.data.categories[this.state.current_category].css.content_background_color_no_backdrop, border:this.state.data.categories[this.state.current_category].css.content_border_no_backdrop}}>
                    <h3>Arvioi ensin omat digitaitosi: liikuta alla olevaa palloa. Testin lopussa näet, osuiko arviosi kohdalleen.</h3>
                    <div className={style.slider_container} style={{marginBottom:'20px', marginTop:'60px'}}><Slider disabled={false} defaultValue={4} handleSliderChange={this.handleSliderChange} marks={true} categories={this.state.data.results.map((result) => result.title)} /></div>
                    <label><button onClick={() => this.handleQuestionChange(-1, 0)}>Aloita</button></label>
                  </div>
                </div>
              </div>
            </div>
        }
        {
          (this.state.current_question === true && this.state.data && this.state.result !== false) && 
            <div className={style.container}>
              <div className={style.category_container + ' ' + style.single + ' ' + style.end} style={(this.state.data) ? {color: this.state.data.categories[this.state.current_category].css.color} : {}}>
                <div className={style.background_container} style={(this.state.data) ? {backgroundImage: this.state.data.categories[this.state.current_category].css.backgroundImage} : {}}></div>
                <div className={style.content_wrapper}>
                  <div className={style.slider_container} style={{marginBottom:'40px', marginTop:'80px'}}><Slider disabled={true} defaultValue={this.state.level} marks={this.state.marks} categories={this.state.data.results.map((result) => result.title)} /></div>
                  <img className={style.result_img} src={path_prefix + 'img/result/' + this.state.data.results[this.state.result].emoji} alt={this.state.data.results[this.state.result].title} />
                  <h1>Olet digi{this.state.data.results[this.state.result].title.toLowerCase()}!</h1>
                  <h2>
                    {this.state.result_subtitle}<br />
                    Jaa tuloksesi <a href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://share.api.yle.fi/share/digitaitotesti/' + this.state.data.results[this.state.result].some_id + '.html?url=' + url.replace('https://yle.fi/aihe/',''))} target="_blank" onClick={this.shareButtonClick}>Facebookissa</a> ja <a href={'https://twitter.com/intent/tweet?url=' + url + '&hashtags=' + encodeURIComponent('yle,digitaitotesti') + '&text=' + encodeURIComponent(this.state.data.results[this.state.result].some_text)} target="_blank" onClick={this.shareButtonClick}>Twitterissä</a></h2>
                  <div className={style.content_container} style={(CSS.supports('backdrop-filter', 'blur(10px)') === true || CSS.supports('-webkit-backdrop-filter', 'blur(10px)') === true) ? {backgroundColor: this.state.data.categories[this.state.current_category].css.content_background_color, border:this.state.data.categories[this.state.current_category].css.content_border} : {backgroundColor: this.state.data.categories[this.state.current_category].css.content_background_color_no_backdrop, border:this.state.data.categories[this.state.current_category].css.content_border_no_backdrop}}>
                    <Markdown>{this.state.result_text}</Markdown>
                    <h5>Tekijät</h5>
                    <div className={style.authors_container}>
                      <p>Grafiikka: Mikko Lehtola</p>
                      <p>Tekniikka: Teemo Tebest</p>
                      <p>Toimittaja: Katja Solla</p>
                      <p>Tuottaja: Anna-Leena Lappalainen</p>
                    </div>
                    <h5>Julkaistu 2.9.2021</h5>
                  </div>
                </div>
              </div>
            </div>
        }
        <div className={style.hidden}>
          <form action="https://docs.google.com/forms/u/1/d/e/1FAIpQLScGR-7ZdxwqOuptCcJ3Dop-LDuaygNDZhbMRCRUaW2y0qGGXg/formResponse" method="POST" target="hidden_iframe" id="plus_form">
            <div><input className="evaluation_input" name="entry.125784456" type="text" /></div>
            <div><input className="points_input" name="entry.1982799243" type="text" /></div>
            <div><input className="result_input" name="entry.1257355776" type="text" /></div>
          </form>
        </div>
        <iframe name="hidden_iframe" className={style.hidden}></iframe>
      </div>
    );
  }
}

export default App;