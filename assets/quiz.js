/* VU1 Field Handbook — quiz view. Fully Swedish, no build step, no dependencies.
   Reads window.QUIZ (assets/quiz-data.js, generated from data/quiz.json). */
(function () {
  'use strict';
  var BANK = window.QUIZ || [];

  var startPanel = document.getElementById('quiz-start');
  var runPanel = document.getElementById('quiz-run');
  var resultsPanel = document.getElementById('quiz-results');
  if (!startPanel || !runPanel || !resultsPanel || !BANK.length) return;

  var startBtn = document.getElementById('quiz-startbtn');
  var progressFill = document.getElementById('quiz-progressfill');
  var progressLabel = document.getElementById('quiz-progresslabel');
  var qEl = document.getElementById('quiz-q');
  var choicesEl = document.getElementById('quiz-choices');
  var explainEl = document.getElementById('quiz-explain');
  var nextBtn = document.getElementById('quiz-nextbtn');
  var scoreEl = document.getElementById('quiz-score');
  var scoreSub = document.getElementById('quiz-scoresub');
  var reviewEl = document.getElementById('quiz-review');
  var retryBtn = document.getElementById('quiz-retrybtn');
  var retryWrongBtn = document.getElementById('quiz-retrywrongbtn');
  var filterbar = document.getElementById('quiz-filterbar');
  var countAll = document.getElementById('quiz-count-all');
  var countWrong = document.getElementById('quiz-count-wrong');
  var countRight = document.getElementById('quiz-count-right');

  var queue = [];   /* questions in this run, shuffled */
  var idx = 0;
  var answered = false;
  var results = []; /* {q, chosenText, correctText, correct} per answered question */

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function startRun(pool) {
    queue = shuffle(pool.slice());
    idx = 0;
    results = [];
    startPanel.hidden = true;
    resultsPanel.hidden = true;
    runPanel.hidden = false;
    renderQuestion();
  }

  function renderQuestion() {
    answered = false;
    var q = queue[idx];
    progressLabel.textContent = 'Fråga ' + (idx + 1) + ' av ' + queue.length;
    progressFill.style.width = (idx / queue.length * 100) + '%';
    qEl.textContent = q.q;
    choicesEl.innerHTML = '';
    explainEl.hidden = true;
    explainEl.textContent = '';
    nextBtn.hidden = true;

    var order = shuffle(q.choices.map(function (_, i) { return i; }));
    order.forEach(function (choiceIdx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quizchoice';
      btn.textContent = q.choices[choiceIdx];
      btn.addEventListener('click', function () { pick(q, choiceIdx, order, btn); });
      choicesEl.appendChild(btn);
    });
  }

  function pick(q, choiceIdx, order, btn) {
    if (answered) return;
    answered = true;
    var isCorrect = choiceIdx === q.correct;
    [].forEach.call(choicesEl.children, function (b, i) {
      b.disabled = true;
      if (order[i] === q.correct) b.classList.add('correct');
    });
    if (!isCorrect) btn.classList.add('wrong');
    if (q.explain) {
      explainEl.textContent = q.explain;
      explainEl.hidden = false;
    }
    nextBtn.hidden = false;
    results.push({
      q: q,
      chosenText: q.choices[choiceIdx],
      correctText: q.choices[q.correct],
      correct: isCorrect
    });
  }

  nextBtn.addEventListener('click', function () {
    idx++;
    if (idx >= queue.length) showResults();
    else renderQuestion();
  });

  function showResults() {
    progressFill.style.width = '100%';
    runPanel.hidden = true;
    resultsPanel.hidden = false;
    var right = results.filter(function (r) { return r.correct; }).length;
    var total = results.length;
    var pct = total ? Math.round(right / total * 100) : 0;
    scoreEl.textContent = right + ' / ' + total + ' (' + pct + ' %)';
    scoreSub.textContent = pct >= 80 ? 'Bra jobbat — nästan redo för provet.'
      : pct >= 50 ? 'På god väg. Gå igenom felen nedan innan provet.'
      : 'Gå igenom felen nedan och kör om quizet innan provet.';
    countAll.textContent = total;
    countWrong.textContent = total - right;
    countRight.textContent = right;
    retryWrongBtn.hidden = (total - right) === 0;
    [].forEach.call(filterbar.querySelectorAll('button'), function (b) {
      b.classList.toggle('on', b.dataset.filter === 'all');
    });
    renderReview('all');
  }

  function renderReview(filter) {
    reviewEl.innerHTML = '';
    results.forEach(function (r, i) {
      if (filter === 'wrong' && r.correct) return;
      if (filter === 'right' && !r.correct) return;
      var item = document.createElement('div');
      item.className = 'quizreview-item ' + (r.correct ? 'is-right' : 'is-wrong');

      var head = document.createElement('p');
      head.className = 'quizreview-q';
      head.textContent = (i + 1) + '. ' + r.q.q;
      item.appendChild(head);

      var yours = document.createElement('p');
      yours.className = 'quizreview-line';
      var yoursLab = document.createElement('span');
      yoursLab.className = 'quizreview-lab';
      yoursLab.textContent = r.correct ? '✅ Ditt svar' : '❌ Ditt svar';
      yours.appendChild(yoursLab);
      yours.appendChild(document.createTextNode(' ' + r.chosenText));
      item.appendChild(yours);

      if (!r.correct) {
        var correct = document.createElement('p');
        correct.className = 'quizreview-line';
        var correctLab = document.createElement('span');
        correctLab.className = 'quizreview-lab';
        correctLab.textContent = '✅ Rätt svar';
        correct.appendChild(correctLab);
        correct.appendChild(document.createTextNode(' ' + r.correctText));
        item.appendChild(correct);
      }

      if (r.q.explain) {
        var ex = document.createElement('p');
        ex.className = 'quizreview-explain';
        ex.textContent = r.q.explain;
        item.appendChild(ex);
      }
      reviewEl.appendChild(item);
    });
  }

  filterbar.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    [].forEach.call(filterbar.querySelectorAll('button'), function (b) {
      b.classList.toggle('on', b === btn);
    });
    renderReview(btn.dataset.filter);
  });

  startBtn.addEventListener('click', function () { startRun(BANK); });
  retryBtn.addEventListener('click', function () { startRun(BANK); });
  retryWrongBtn.addEventListener('click', function () {
    startRun(results.filter(function (r) { return !r.correct; }).map(function (r) { return r.q; }));
  });
})();
