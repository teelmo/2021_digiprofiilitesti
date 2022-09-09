import React, {Component} from 'react';
import style from './../../styles/styles.less';

class Checkbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      button_label_class:props.question.choices.map(() => ''),
      disabled:false,
      points:false,
      result_text:false,
      selected_set:props.question.choices.map(() => false)
    }
  }
  click(question, choice, j, event) {
    // Mark that choise has been selected.
    event.target.parentElement.classList.toggle(style.selected);
    // Set selection.
    let selected_set = this.state.selected_set;
    selected_set[j] = (selected_set[j] === true) ? false : true;
    this.setState((state, props) => ({
      selected_set:selected_set
    }));

    let answer_set = document.getElementsByClassName(style.container)[0];
    // Check if required number of choices have been chocen.
    if (answer_set.querySelectorAll('input[name=question_' + question.id + ']:checked').length >= question.max_count) {
      this.setState((state, props) => ({
        disabled:true,
        result_text:question.result_text
      }));
      this.showCorrect(answer_set.querySelectorAll('input[name=question_' + question.id + ']'), question);
    }
  }
  showCorrect(answer_set, question) {
    let button_label_class = [],
        correct_answers_text = [],
        points = 0;
    answer_set.forEach((answer, i) => {
      if (answer.value === 'true' && answer.checked === true) {
        button_label_class[i] = style.selected + ' ' + style.correct;
        points++;
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
      correct_answers_text:(correct_answers_text.length === 0) ? false : correct_answers_text,
      points:question.points[points]
    }));
    this.props.handleQuestionChange(question.id, question.points[points]);
  }
  render() {
    let question = this.props.question,
        category = this.props.category,
        i = question.id;
    return (
      <div key={i} className={(this.props.disabled === true) ? style.disabled + ' ' + style.content_wrapper: style.enabled + ' ' + style.content_wrapper} style={(this.props.disabled === true) ? {textShadow:'0 0 2px ' + category.css.color} : {}}>
        {question.category_title && <h1>{question.category_title}</h1>}
        <div className={style.content_container} style={(CSS.supports('backdrop-filter', 'blur(10px)') === true || CSS.supports('-webkit-backdrop-filter', 'blur(10px)') === true) ? {backgroundColor:category.css.content_background_color, border:category.css.content_border} : {backgroundColor:category.css.content_background_color_no_backdrop, border:category.css.content_border_no_backdrop}}>
          <h3>{i + 1}/24 {question.title}</h3>
          {question.desc !== false && <h4>{question.desc}</h4>}
          <div className={style.choices_container + ' ' + ((question.choices[0].img) ? style.choices_container_image : '')}>
            {
              question.choices.map((choice, j) => {
                return (
                  <div className={(choice.img) ? style.choice_container_img : style.choice_container_text} key={j}>
                    <label className={((this.state.button_label_class[j]) ? this.state.button_label_class[j] : '') + ' ' + ((this.state.disabled === true) ? style.disabled : '')} style={(this.state.selected_set[j] === true) ? {backgroundColor: category.css.label_background_color_selected} : {backgroundColor: category.css.label_background_color}}>
                      <input
                        data-text={choice.text}
                        disabled={(this.state.disabled === true) ? 'disabled' : ''}
                        name={'question_' + i}
                        onClick={(event) => this.click(question, choice, j, event)}
                        type={question.type}
                        value={choice.correct} />
                      <span style={(this.state.selected_set[j] === true) ? {color: category.css.color_selected} : {color: category.css.color}}>{(choice.img) ? <img src={'//lusi-dataviz.ylestatic.fi/2021_digiprofiilitesti/img/' + choice.img} alt={choice.text} /> : choice.text}</span>
                    </label>
                  </div>
                )
              })
            }
          </div>
          <div className={style.correct_answer_container} style={(this.state.correct_answers_text) ? {display: 'none'} : {display: 'none'}}><h4>Oikeat vastaukset</h4>{this.state.correct_answers_text}</div>
          <div className={style.result_text_container} style={(this.state.result_text) ? {display: 'block', backgroundColor: category.css.result_background_color} : {display: 'none'}}>{this.state.result_text}</div>
          <div className={style.points_container} style={(this.state.points !== false) ? {display: 'block'} : {display: 'none'}}>{this.state.points}</div>
        </div>
      </div>
    );
  }
}

export default Checkbox;