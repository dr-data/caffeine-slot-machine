'use strict';

var Game = function(slotMachine) {
  var slotMachine = slotMachine;
  this.score = {
    coffee: 0,
    tea: 0,
    espresso: 0,
  };
  this.init = function() {
    slotMachine.init();
  };
  this.run = function(callback) {
    slotMachine.start(function(slotResult) {
      console.log(slotResult);
      checkResult(slotResult, function(wc) {
        callback(wc);
      });
    });
  };
  var checkResult = function(result, callback) {
    let resultSorted = result.sort();
    let winningCombinations = slotMachine.winningCombinations;
    for (var wc in winningCombinations) {
      let wcSorted = winningCombinations[wc].combination.sort();
      if (_.isEqual(resultSorted, wcSorted)) {
        callback(wc);
        return;
      }
    }
    callback(null);
  }
};

var SlotMachine = function(combinations) {
  var slots = [];
  var slotResults = [];
  this.winningCombinations = combinations;

  this.init = function() {
    let $container1 = $('#slot-1 > .item-container');
    let $container2 = $('#slot-2 > .item-container');
    let $container3 = $('#slot-3 > .item-container');

    let items1 = shuffle([{item: 'Coffee Maker', color: '#C86428'},
      {item: 'Teapot', color: '#08A242'},
      {item: 'Espresso Machine', color: '#552000'}]);
    let items2 = shuffle([{item: 'Coffee Filter', color: '#C86428'},
      {item: 'Tea Strainer', color: '#08A242'},
      {item: 'Espresso Tamper', color: '#552000'}]);
    let items3 = shuffle([{item: 'Coffee Grounds', color: '#C86428'},
      {item: 'Loose Tea', color: '#08A242'},
      {item: 'Ground Espresso Beans', color: '#552000'}]);

    let slot1 = new Slot($container1, items1, 350);
    let slot2 = new Slot($container2, items2, 215);
    let slot3 = new Slot($container3, items3, 100);

    slots = [slot1, slot2, slot3];

    slots.forEach((slot) => {
      for (var i = 0; i < slot.items.length; i++) {
        slot.$container.append('<div style="color:' + slot.items[i].color+ '">' + slot.items[i].item + '</div>');
      }
    });
    function shuffle(arr) {
      let i, j, x;
      for (i = arr.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
      }
      return arr;
    };
  };
  this.start = function(callback) {
    let counter = 0;
    slots.forEach((slot) => {
      slot.start((currentItem) => {
        slotResults.push(currentItem);
        counter++;
        if (counter === slots.length) {
          var result = getResults();
          callback(result);
        }
      });
    });
  };
  function getResults() {
    let result = slotResults;
    slotResults = [];
    return result;
  }
};

var Slot = function(container, items, interval) {
  this.items = items;
  this.$container = container;
  var isRunning = false;
  var interval = interval;

  this.start = function(callback) {
    isRunning = true;
    this.$container.velocity({top: -75}, 'linear', interval, () => {
      this.runSlot();
    });

    // Stop running after timeout
    let randomOffset = Math.random() < 0.5 ? -1 : 1;
    window.setTimeout(() => {
      isRunning = false;
      this.stopSlot(function(currentItem) {
        callback(currentItem);
      });
    }, 3000 + (2*interval) + (randomOffset * interval));
  };
  this.runSlot = function() {
    if (isRunning) {
      let $container = this.$container;
      let $firstEl = $container.find('div:first-child');
      $container.append($firstEl);
      $container.css({top: 100});
      $container.velocity({top: -75}, 'linear', interval, () => {
        $container.append($firstEl);
        this.runSlot();
      });
    }
  };
  this.stopSlot = function(callback) {
    // Bounce effect on stop
    let $container = this.$container;
    $container.velocity({top: 30}, 'ease-out', 200);
    $container.velocity({top: -15}, 'ease-out', 250);
    $container.velocity({top: 7}, 'ease-out', 125);
    $container.velocity({top: -3}, 'ease-out', 100);
    $container.velocity({top: 0}, 'ease-out', 85, () => {
      let currentItem = $(container).children()[0];
      callback($(currentItem).text());
    });
  };
};

(function() {
  var winningCombinations = {
    coffee: {
      combination: ['Coffee Maker', 'Coffee Filter', 'Coffee Grounds'],
      color: '#C86428',
    },
    tea: {
      combination: ['Teapot', 'Tea Strainer', 'Loose Tea'],
      color: '',
    },
    espresso: {
      combination: ['Espresso Machine', 'Espresso Tamper', 'Ground Espresso Beans'],
      color: '',
    },
  };
  var slotMachine = new SlotMachine(winningCombinations);
  var game = new Game(slotMachine);
  game.init();

  $('.status').html("Press the lever!");
  $('button').click(function() {
    $('button').prop('disabled', true);
    game.run(function(result) {
      if (result) {
        if (result === 'coffee') {
          game.score.coffee += 1;
          $('#score-coffee').html('x ' + game.score.coffee);
        } else if (result === 'tea') {
          game.score.tea += 1;
          $('#score-tea').html('x ' + game.score.tea);
        } else if (result === 'espresso') {
          game.score.espresso += 1;
          $('#score-espresso').html('x ' + game.score.espresso);
        } else {
          console.log('error');
        }
        $('.status').html('Congratulations! You won a cup of ' + result + '!');
      } else {
        $('.status').html('Bummer.. try again!');
      }
      $('button').prop('disabled', false);
    });
  });
})();
