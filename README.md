# exam-wizard
Exam Wizard Jquery Plugin to Handling Examinations, Questions, Answers Easily, its helpful to build exams,  surveys, questioners 

## Screenshot from Simple Demo

![Yii2 timeDownCounter screenshot_t1](http://2nees.com/github/examWizard/examwizard.png)

## Features

1. Ability to build unlimited of questions with full of action control.
2. Ability to let user marks questions.
3. Ability to let users use quick access menu.
4. Ability to set real answer or alternate answer to display in quick access menu.
5. Ability to determind number of qustions in quick access menu.
6. Ability to display summery of result on modal when user click on finish button.
7. Ability to enable/disable mark questions, quick access, finish modal.
8. Ability to update selectors for actions control.
9. Ability to trigger callback function on every main action.
10. Ability to prevent next/prev button dependance on pre-trigger-funtion.
11. Ability To Save All Users Answers in cookies.
12. Ability to add auth key for cookie to keep data safe for every user/exam dependance of your rules.
13. Ability to retrieve all marked value from examVariable directly.
14. Ability to retrieve all answerd value from examVariable directly with options to retrive all form data or just questions data, also we can get data sorted as a groub or with normal array.
15. Ability to retrieve total of marked questions from examVariable directly.
16. Ability to retrieve total of answerd questions from examVariable directly.
17. Ability to retrieve total of Remaining questions from examVariable directly.
18. Ability to retrieve current question number from examVariable directly.
19. You will work on exam wizard with data-attribute for name, values and types, and this give you a power to keep real name, value and type without change, its helpfual if you like to use it in exsisting form, with fremworks, or cms.
20. This plugin work on input type, select and textarea.
21. This plugin work on multiple value for select and checkbox fields.

## Dependency
1. jQuery Library

## Installation:
The preferred way to install this extension is through [composer](https://getcomposer.org/).

Either run

`php composer.phar require --prefer-dist aneeshikmat/exam-wizard "*@dev"`

## Usage
To use this plugin you need to write your code like this template(in basic use):

```
<!-- Html Template -->
<form id="examwizard-question"><!-- examwizard-question #id selector for exam form(you can update it by option -->
  <div class="yourClass" data-question="1">
    ------
    <input type="radio" data-alternatetype="radio" name="fieldName[0]" data-alternateName="answer[0]" data-alternateValue="A" value="1"/>
    ------
  </div>
    <div class="yourClass hidden" data-question="2"><!-- We Add hidden class here -->
    ------
    <input type="radio" data-alternatetype="radio" name="fieldName[1]" data-alternateName="answer[1]" data-alternateValue="A" value="1"/>
    ------
  </div>
  
  <!-- Hidden field, save current question number, marked values, total of question -->
  <input type="hidden" value="1" id="currentQuestionNumber" name="currentQuestionNumber" />
  <input type="hidden" value="18" id="totalOfQuestion" name="totalOfQuestion" />
  <input type="hidden" value="[]" id="markedQuestion" name="markedQuestions" />

</form>

<!-- Scripts -->
<script src="js/jquery.js"></script><!-- Required -->
<script src="js/examwizard.min.js"></script><!-- Required -->

<script>
    var examWizard = $.fn.examWizard();
</script>
```

As you see, its very simple, and now we will be explaning this code, and then go to display all option may be use to help us.
1) Form tag must be has an #id selector, the default selector is examwizard-question, and you can change it by set it in examwizard configration like this: 
```
<script>
    var examWizard = $.fn.examWizard({
      formSelector: "#new-examwizard-question",
    });
</script>
```
2) Wrapper <div> has an data-question attribute with question number value.
3) Question Field most be write with this rule:
  a. data-alternatetype: this data attribute has an field type.(required)
  b. data-alternateName: this data attribute has an alternate name, this is useful to keep field name without any update, its useful if you need to update old form, use in cms or fremwork, alternateName most has value like this rule "answer[question-number - 1]" so that if we on question 1 thats mean alternateName="answerd[0]".(required)
  c. data-alternateValue: this data attribute has an alternate value for field, its useful on quick access menu, its will be display a readable value for user, for example if field value is 1 and data-alternateValue="A" then the displayed value will be is "A" not "1".
  


