import React, {Component} from 'react';
import style from './../../styles/styles.less';

class Radio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      button_label_class:props.question.choices.map(() => ''),
      disabled:false,
      points:false,
      result_text:false
    }
  }
  click(question, choice, j, event) {
    // Mark that choise has been selected.
    let answer_set = document.getElementsByClassName(style.container)[0];
    this.setState((state, props) => ({
      disabled:true,
      points:choice.points,
      result_text:choice.result_text
    }));
    this.showCorrect(answer_set.querySelectorAll('input[name=question_' + question.id + ']'));
    this.props.handleQuestionChange(question.id, choice.points);
  }
  showCorrect(answer_set) {
    let button_label_class = [],
        correct_answers_text = [];
    answer_set.forEach((answer, i) => {
      if (answer.value === 'true' && answer.checked === true) {
        button_label_class[i] = style.selected + ' ' + style.correct;
      }
      else if (answer.value === 'true') {
        button_label_class[i] = style.correct;
        correct_answers_text.push(<div key={i}>{answer.getAttribute('data-text')}</div>);
      }
      else if (answer.value === 'false' && answer.checked === true) {
        button_label_class[i] = style.selected + ' ' + style.incorrect;
      }
      else if (answer.checked === true) {
        button_label_class[i] = style.selected;
      }
      else {
        button_label_class[i] = '';
      }
    });
    this.setState((state, props) => ({
      button_label_class:button_label_class,
      correct_answers_text:(correct_answers_text.length === 0) ? false : correct_answers_text
    }));
  }
  render() {
    let question = this.props.question,
        category = this.props.category,
        i = question.id;
    return (
      <div key={i} className={(this.props.disabled === true) ? style.disabled + ' ' + style.content_wrapper: style.enabled + ' ' + style.content_wrapper} style={(this.props.disabled === true) ? {textShadow:'0 0 2px ' + category.css.color} : {}}>
        {
          (question.id === 0) && 
            <div className={style.content_container + ' ' + style.instruction_container}>
              <div><p>Testissä on neljä aihepiiriä. Saat tuloksen, kun olet vastannut kaikkiin 24 kysymykseen.</p></div>
            </div>
        }
        {question.category_title && <h1>{question.category_title}</h1>}
        <div className={style.content_container} style={(CSS.supports('backdrop-filter', 'blur(10px)') === true || CSS.supports('-webkit-backdrop-filter', 'blur(10px)') === true) ? {backgroundColor:category.css.content_background_color, border:category.css.content_border} : {backgroundColor:category.css.content_background_color_no_backdrop, border:category.css.content_border_no_backdrop}}>
          <h3>{i + 1}/24 {question.title} {question.title_img && <img src={'//lusi-dataviz.ylestatic.fi/2021_digiprofiilitesti/img/' + question.title_img} alt={question.title_img_alt} />}</h3>
          {question.desc !== false && <h4>{question.desc}</h4>}
          <div className={style.choices_container + ' ' + ((question.choices[0].img) ? style.choices_container_image : '')}>
            {
              question.choices.map((choice, j) => {
                return (
                  <div className={style.choice_container} key={j}>
                    <label className={((this.state.button_label_class[j]) ? this.state.button_label_class[j] : '') + ' ' + ((this.state.disabled === true) ? style.disabled : '')} style={(this.state.button_label_class[j].includes(style.selected)) ? {backgroundColor: category.css.label_background_color_selected} : {backgroundColor: category.css.label_background_color}}>
                      <input
                        data-text={choice.text}
                        disabled={(this.state.disabled === true) ? 'disabled' : ''}
                        name={'question_' + i}
                        onClick={(event) => this.click(question, choice, j, event)}
                        type={question.type}
                        value={choice.correct} />
                      <span style={(this.state.button_label_class[j].includes(style.selected)) ? {color: category.css.color_selected} : {color: category.css.color}}>{(choice.img) ? <img src={'//lusi-dataviz.ylestatic.fi/2021_digiprofiilitesti/img/' + choice.img} alt={choice.text} /> : choice.text}</span>
                    </label>
                  </div>
                )
              })
            }
          </div>
          <div className={style.correct_answer_container} style={(this.state.correct_answers_text) ? {display: 'none'} : {display: 'none'}}><h4>Oikea vastaus</h4>{this.state.correct_answers_text}</div>
          <div className={style.result_text_container} style={(this.state.result_text) ? {display: 'block', backgroundColor: category.css.result_background_color} : {display: 'none'}}>{this.state.result_text}</div>
          <div className={style.points_container} style={(this.state.points !== false) ? {display: 'block'} : {display: 'none'}}>{this.state.points}</div>
        </div>
        {(question.id === 23 && this.state.disabled === true) && <div className={style.content_wrapper}><div className={style.content_container}><div className={style.show_result_button_container}><div><label style={{backgroundColor: category.css.label_background_color}}><button onClick={() => this.props.handleQuestionChange('end', 0)} style={{color: category.css.color}}>Näytä tulos</button></label></div>{(!window.yleVisualisation) ? <div style={{'fontSize': '10px', 'marginTop': '10px'}}>Vastauksesi tallennetaan anonyymisti<br />käyttäen Google Form -lomaketta</div> : ''}</div></div></div>}
      </div>
    );
  }
}

export default Radio;