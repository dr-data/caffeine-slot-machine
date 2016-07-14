'use strict';

var Game = function(slotMachine) {
  var slotMachine = slotMachine;
  this.wins = {
    coffee: 0,
    tea: 0,
    espresso: 0,
  };
  var winningCombinations = {
    coffee: ['Coffee Maker', 'Coffee Filter', 'Coffee Grounds'],
    tea: ['Teapot', 'Tea Strainer', 'Loose Tea'],
    espresso: ['Espresso Machine', 'Espresso Tamper', 'Ground Espresso Beans'],
  };
  this.init = function() {
    slotMachine.init();
  };
  this.run = function(callback) {
    slotMachine.start(function(slotResult) {
      checkResult(slotResult, function(wc) {
        callback(wc);
      });
    });
  };
  var checkResult = function(result, callback) {
    let resultSorted = result.sort();
    for (var wc in winningCombinations) {
      let wcSorted = winningCombinations[wc].sort();
      if (_.isEqual(resultSorted, wcSorted)) {
        callback(wc);
        return;
      }
    }
    callback(null);
  }
};

var SlotMachine = function() {
  var slots = [];
  var slotResults = [];
  this.init = function() {
    let $container1 = $('#slot-1 > .item-container');
    let $container2 = $('#slot-2 > .item-container');
    let $container3 = $('#slot-3 > .item-container');

    let slot1 = new Slot($container1, ['Coffee Maker', 'Teapot', 'Espresso Machine'], 500);
    let slot2 = new Slot($container2, ['Coffee Filter', 'Tea Strainer', 'Espresso Tamper'], 250);
    let slot3 = new Slot($container3, ['Coffee Grounds', 'Loose Tea', 'Ground Espresso Beans'], 125);

    slots.push(slot1);
    slots.push(slot2);
    slots.push(slot3);

    $($container1).append('<div style="color: #C86428">' + slot1.items[0] + '</div>');
    $($container1).append('<div style="color: #08A242">' + slot1.items[1] + '</div>');
    $($container1).append('<div style="color: #552000">' + slot1.items[2] + '</div>');

    $($container2).append('<div style="color: #C86428">' + slot2.items[0] + '</div>');
    $($container2).append('<div style="color: #08A242">' + slot2.items[1] + '</div>');
    $($container2).append('<div style="color: #552000">' + slot2.items[2] + '</div>');

    $($container3).append('<div style="color: #C86428">' + slot3.items[0] + '</div>');
    $($container3).append('<div style="color: #08A242">' + slot3.items[1] + '</div>');
    $($container3).append('<div style="color: #552000">' + slot3.items[2] + '</div>');
  };
  this.start = function(callback) {
    let counter = 0;
    slots.forEach((slot) => {
      slot.start((currentItem) => {
        slotResults.unshift(currentItem);
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
  var isRunning = false;
  var $container = container;
  var interval = interval;

  this.start = function(callback) {
    isRunning = true;
    $container.velocity({top: -100}, 'linear', interval, () => {
      this.runSlot();
    });

    // Stop running after timeout
    window.setTimeout(() => {
      isRunning = false;
      this.stopSlot(function(currentItem) {
        callback(currentItem);
      });
    }, 1000 + interval + (interval));
  };
  this.runSlot = function() {
    if (isRunning) {
      let $firstEl = $container.find('div:first-child');
      $container.append($firstEl);
      $container.css({top: 100});
      $container.velocity({top: -100}, 'linear', interval, () => {
        $container.append($firstEl);
        this.runSlot();
      });
    }
  };
  this.stopSlot = function(callback) {
    // Bounce effect on stop
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

$(function() {
  var slotMachine = new SlotMachine();
  var game = new Game(slotMachine);
  game.init();
  $('.status').html("Press the lever!");
  $('.lever').click(function() {
    $('button').prop('disabled', true);
    game.run(function(result) {
      if (result) {
        $('.status').html('Congratulations! You won a ' + result + '!');
      } else {
        $('.status').html('Bummer.. try again!');
      }
      $('button').prop('disabled', false);
    });
  });
})();
