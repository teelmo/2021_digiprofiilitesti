import React, {Component} from 'react';
import style from './../../styles/styles.less';

class Compine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answer_set:props.question.choices[0].map(() => undefined),
      button_label_class:props.question.choices[0].map(() => ''),
      correct_answer_set:props.question.choices[0].map((values) => values.correct),
      correct_answers_text:false,
      points:false,
      disabled:false,
      result_text:false,
      selected_from:false,
      selected_set:[
        props.question.choices[0].map(() => false),
        props.question.choices[1].map(() => false)
      ],
      selected_to:false,
      used_set:props.question.choices[1].map(() => false)
    }
  }
  toClick(question, answer, j) {
    if (this.state.disabled === true) {
      return false;
    }
    else if (this.state.selected_from) {
      let idx;
      let used_set = this.state.used_set;
      question.choices[1].every((choice, k) => {
        if (choice.text === this.state.selected_from && used_set[k] === false) {
          idx = k;
          return false;
        }
        return true;
      });
      let selected_set = this.state.selected_set;
      selected_set[1] = selected_set[1].map((value) => {
        value = false;
      });
      // Return used to the list if needed.
      let answer_set = this.state.answer_set;
      question.choices[1].every((choice, k) => {
        if (choice.text == answer_set[j] && used_set[k] === true) {
          used_set[k] = false;
          return false;
        }
        return true;
      });

      used_set[idx] = true;
      answer_set[j] = this.props.question.choices[1][idx].text;

      // Unset selected status.
      let selected_from = this.state.selected_from;
      selected_from = undefined;
      this.setState((state, props) => ({
        answer_set:answer_set,
        selected_from:false,
        selected_set:selected_set,
        used_set:used_set
      }));
      // Check if we are done.
      if (answer_set.includes(undefined) === false) {
        let selected_set = this.state.selected_set;
        selected_set[0][j] = false;

        this.setState((state, props) => ({
          disabled:true,
          result_text:question.result_text,
        }));
        this.showCorrect(answer_set, question);
      }
    }
    else {
      // Check if done.
      let selected_set = this.state.selected_set;
      // Reset selection.
      selected_set[0] = selected_set.map((item, k) => {
        return false;
      });
      selected_set[0][j] = true;

      // Set selection.
      this.setState((state, props) => ({
        selected_to:answer.text,
        selected_set:selected_set
      }));
    }
  }
  answerClick(question, answer, j) {
    // Check if done.
    if (this.state.disabled === true) {
      return false;
    }

    // Reset selected status for the clicked item.
    let used_set = this.state.used_set;
    // https://masteringjs.io/tutorials/fundamentals/foreach-break
    question.choices[1].every((choice, k) => {
      if (choice.text === answer && used_set[k] === true) {
        used_set[k] = false;
        return false;
      }
      return true;
    });

    // Remove clicked item from the list.
    let answer_set = this.state.answer_set;
    delete(answer_set[j]);

    this.setState((state, props) => ({
      answer_set:answer_set,
      used_set:used_set
    }));
  }
  fromClick(question, answer, j) {
    if (this.state.selected_to) {
      let idx;
      question.choices[0].every((choice, k) => {
        if (choice.text === this.state.selected_to) {
          idx = k;
          return false;
        }
        return true;
      });
      // Remove selection from to list.
      let selected_set = this.state.selected_set;
      selected_set[0] = selected_set[0].map((value) => {
        value = false;
      });
      let answer_set = this.state.answer_set;
      let used_set = this.state.used_set;
      // Return used to the list if needed.
      question.choices[1].every((choice, k) => {
        if (answer_set[idx] === choice.text && used_set[k] === true) {
          used_set[k] = false;
          return false;
        }
        return true;
      });
      
      answer_set[idx] = answer.text;
      // Unset selected status.
      let selected_to = this.state.selected;
      selected_to = undefined;
      used_set[j] = true;
      this.setState((state, props) => ({
        answer_set:answer_set,
        selected_to:false,
        selected_set:selected_set,
        used_set:used_set
      }));
      // Check if we are done.
      if (answer_set.includes(undefined) === false) {
        let selected_set = this.state.selected_set;
        selected_set[0][j] = false;

        this.setState((state, props) => ({
          disabled:true,
          result_text:question.result_text,
        }));
        this.showCorrect(answer_set, question);
      }
    }
    else {
      let selected_set = this.state.selected_set;
      // Reset selection.
      selected_set[1] = selected_set.map((item, k) => {
        return false;
      });
      selected_set[1][j] = true;
      this.setState((state, props) => ({
        selected_from:answer.text,
        selected_set:selected_set
      }));
    }
  }
  showCorrect(answer_set, question) {
    let button_label_class = [],
        correct_answers_text = [],
        points = 0;
    answer_set.forEach((answer, i) => {
      if (answer === this.state.correct_answer_set[i]) {
        button_label_class[i] = style.correct;
        points++;
      }
      else {
        correct_answers_text.push(<div key={i}><span className={style.label_to}>{this.props.question.choices[0][i].text}</span> <span className={style.label_from}>{this.state.correct_answer_set[i]}</span></div>);
        button_label_class[i] = style.incorrect;
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
          <div className={style.choices_container}>
            <div className={style.compine_to} style={{borderColor: category.css.compine_to_border_color}}>
              {
                question.choices[0].map((choice, j) => {
                  return (
                    <div className={(this.state.selected_set[0][j] === true) ? style.selected : ''} key={j}>
                      <label className={((this.state.selected_set[0][j] === true) ? style.selected : (this.state.button_label_class[j]) ? this.state.button_label_class[j] : '') + ' ' + ((this.state.disabled === true) ? style.disabled : '')} style={(this.state.selected_set[0][j] === true) ? {backgroundColor: category.css.label_background_color_selected} : {backgroundColor: category.css.label_background_color}}>
                        <button className={(this.state.selected_set[0][j] === true) ? style.selected : ''} style={(this.props.disabled === true) ? {textShadow:'0 0 2px ' + category.css.color} : (this.state.selected_set[0][j] === true) ? {color: category.css.color_selected} : {color: category.css.color}} onClick={() => this.toClick(question, choice, j)}>{(choice.img) ? (this.state.selected_set[0][j] === true) ? <img src={'//lusi-dataviz.ylestatic.fi/2021_digiprofiilitesti/img/' + choice.img_selected} /> : <img src={'//lusi-dataviz.ylestatic.fi/2021_digiprofiilitesti/img/' + choice.img} alt={choice.text} /> : choice.text}</button>
                        
                      </label>
                      <div onClick={() => this.answerClick(question, this.state.answer_set[j], j)} className={style.answer_container}>
                        {
                          this.state.answer_set[j] && <label className={((this.state.button_label_class[j]) ? this.state.button_label_class[j] : '') + ' ' + ((this.state.disabled === true) ? style.disabled : '')}><button style={{color: category.css.color}}>{this.state.answer_set[j]}</button></label>
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className={style.compine_from}>
              {
                question.choices[1].map((choice, j) => {
                  return (
                    <div className={(this.state.used_set[j] === true) ? style.used : ''} key={j}>
                      <label className={((this.state.selected_set[1][j] === true) ? style.selected : '') + ' ' + ((this.state.disabled === true) ? style.disabled : '')} style={(this.state.selected_set[1][j] === true) ? {backgroundColor: category.css.label_background_color_selected} : {}}><button className={(this.state.selected_set[1][j] === true) ? style.selected : ''} style={(this.props.disabled === true) ? {textShadow:'0 0 2px ' + category.css.color} : (this.state.selected_set[1][j] === true) ? {color: category.css.color_selected} : {color: category.css.color}} onClick={() => this.fromClick(question, choice, j)}>{choice.text}</button></label>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={style.correct_answer_container} style={(this.state.correct_answers_text) ? {display: 'block'} : {display: 'none'}}><h4>Oikeat vastaukset</h4>{this.state.correct_answers_text}</div>
          <div className={style.result_text_container} style={(this.state.result_text) ? {display: 'block', backgroundColor: category.css.result_background_color} : {display: 'none'}}>{this.state.result_text}</div>
          <div className={style.points_container} style={(this.state.points !== false) ? {display: 'block'} : {display: 'none'}}>{this.state.points}</div>
        </div>
      </div>
    );
  }
}

export default Compine;