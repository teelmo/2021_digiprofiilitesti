import React, {Component} from 'react';
import style from './../../styles/styles.less';

class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answer_set:props.question.choices.map(() => ''),
      button_label_class:props.question.choices.map(() => ''),
      correct_answer_set:props.question.choices.slice(0).sort((a, b) => (a.correct > b.correct) ? 1 : -1).map((values) => values.text),
      correct_answers_text:false,
      disabled:false,
      points:false,
      result_text:false,
      selected_set:props.question.choices.map(() => false)
    }
  }
  answerClick(question, answer, j) {
    // Check if done.
    if (this.state.disabled === true) {
      return false;
    }

    // Reset selected status for clicked item.
    let selected_set = this.state.selected_set;
    // https://masteringjs.io/tutorials/fundamentals/foreach-break
    question.choices.every((choice, k) => {
      if (choice.text === answer) {
        selected_set[k] = false;
        return false;
      }
      return true;
    });

    // Remove clicked item from the list.
    let answer_set = this.state.answer_set;
    answer_set[j] = '';

    this.setState((state, props) => ({
      answer_set:answer_set,
      selected_set:selected_set
    }));
  }
  orderClick(question, choice, j) {
    // Ignore if already selected.
    if (this.state.selected_set[j] === true) {
      return false;
    }
    // Place clicked item to the list.
    let answer_set = this.state.answer_set;
    // https://masteringjs.io/tutorials/fundamentals/foreach-break
    answer_set.every((answer, k) => {
      if (answer === '') {
         answer_set[k] = choice.text;
        return false;
      }
      return true;
    });

    // Set selected status for clicked item.
    let selected_set = this.state.selected_set;
    selected_set[j] = true;
    this.setState((state, props) => ({
      answer_set:answer_set,
      selected_set:selected_set
    }));

    // Check if we are done.
    if (answer_set.includes('') === false) {
      this.setState((state, props) => ({
        disabled:true,
        result_text:question.result_text
      }));
      this.showCorrect(answer_set, question);
    }
  }
   showCorrect(answer_set, question) {
    let button_label_class = [],
        correct_answers_text = [],
        incorrect = false,
        points = 0;
    answer_set.forEach((answer, i) => {
      if (answer === this.state.correct_answer_set[i]) {
        button_label_class[i] = style.correct;
        points++;
      }
      else {
        incorrect = true;
        button_label_class[i] = style.incorrect;
      }
    });
    if (incorrect === true) {
      question.choices.sort((a, b) => (a.correct > b.correct) ? 1 : -1).forEach((choice, i) => {
        correct_answers_text.push(<div key={i}>{i + 1}: {choice.text}</div>);
      });
    }
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
          <div className={style.answers_container}>
            <ol>
            {
              this.state.answer_set.map((answer, j) => {
                return (
                  <li key={j} onClick={() => this.answerClick(question, answer, j)}>
                    {
                      answer && <label className={((this.state.selected_set[0][j] === true) ? style.selected : (this.state.button_label_class[j]) ? this.state.button_label_class[j] : '') + ' ' + ((this.state.disabled === true) ? style.disabled : '')} style={{backgroundColor: category.css.label_background_color_selected}}><button style={(this.props.disabled === true) ? {textShadow:'0 0 2px ' + category.css.color} : {color: category.css.color_selected}}>{answer}</button></label>
                    }
                  </li>
                )
              })
            }
            </ol>
          </div>
          <div className={style.choices_container}>
            <div className={style.order_from}>
              {
               question.choices.map((choice, j) => {
                  return (
                    <div className={(this.state.selected_set[j] === true) ? style.used : ''} key={j}>
                      <label style={{backgroundColor: category.css.label_background_color}}><button className={(this.state.selected_set[j] === true) ? style.selected : ''} style={(this.props.disabled === true) ? {textShadow:'0 0 2px ' + category.css.color} : {color: category.css.color}} onClick={() => this.orderClick(question, choice, j)}>{choice.text}</button></label>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={style.correct_answer_container} style={(this.state.correct_answers_text) ? {display: 'block'} : {display: 'none'}}><h4>Oikea vastaus</h4>{this.state.correct_answers_text}</div>
          <div className={style.result_text_container} style={(this.state.result_text) ? {display: 'block', backgroundColor: category.css.result_background_color} : {display: 'none'}}>{this.state.result_text}</div>
          <div className={style.points_container} style={(this.state.points !== false) ? {display: 'block'} : {display: 'none'}}>{this.state.points}</div>
        </div>
      </div>
    );
  }
}

export default Order;